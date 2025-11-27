import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import MessageBubble from './MessageBubble'
import './ChatScreen.css'

function NurseChat({ 
  sessionId, 
  context, 
  onEnd, 
  peerConnectionRef, 
  dataChannelRef, 
  audioElementRef,
  isAgentConnected,
  setIsAgentConnected,
  isRecording,
  setIsRecording
}) {
  const [messages, setMessages] = useState([])
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null) // No persistence
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [pendingNavigation, setPendingNavigation] = useState(null)
  const [showVitals, setShowVitals] = useState(false)
  
  // Track pending messages for proper ordering (user message should come before AI response)
  const pendingUserTranscript = useRef(null)
  const pendingAIResponse = useRef(null)
  const [currentVitals, setCurrentVitals] = useState({
    heartRate: '--',
    bloodPressure: '--/--',
    spo2: '--%',
    respiratoryRate: '--'
  })
  const videoRef = useRef(null)
  const vitalsIntervalRef = useRef(null)
  const cameraOperationIdRef = useRef(0) // Track camera operations to cancel stale ones
  
  // CRITICAL: Use ref to hold current handleRealtimeEvent to avoid stale closures
  const handleRealtimeEventRef = useRef(null)
  
  const messagesEndRef = useRef(null)
  const { theme } = useTheme()
  
  // Use passed connection status and recording state
  const isConnected = isAgentConnected
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // CRITICAL: Re-attach dataChannel listener when component mounts/remounts (after navigation)
  useEffect(() => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      console.log('🔄 Component mounted with existing dataChannel - re-attaching message handler')
      
      // Create new message handler that uses the ref
      const messageHandler = (e) => {
        const event = JSON.parse(e.data)
        if (handleRealtimeEventRef.current) {
          handleRealtimeEventRef.current(event)
        }
      }
      
      // Remove old listeners and add new one
      // Note: We can't remove the old anonymous function, but adding a new one will work
      // because the ref will always point to the current handler
      dataChannelRef.current.addEventListener('message', messageHandler)
      
      return () => {
        // Cleanup on unmount
        if (dataChannelRef.current) {
          dataChannelRef.current.removeEventListener('message', messageHandler)
        }
      }
    }
  }, []) // Run once on mount

  // Sync camera stream to video element - bulletproof with operation tracking
  useEffect(() => {
    // Increment operation ID - any previous operations will be cancelled
    const currentOperationId = ++cameraOperationIdRef.current
    let retryCount = 0
    const maxRetries = 20 // More retries for reliability
    const retryDelay = 50
    
    const isOperationValid = () => {
      return currentOperationId === cameraOperationIdRef.current
    }
    
    const attachStream = () => {
      // Cancel if this operation is stale (new camera request came in)
      if (!isOperationValid()) {
        console.log(`📹 Operation ${currentOperationId} cancelled (new operation started)`)
        return
      }
      
      if (!showCameraPreview || !cameraStream) {
        console.log(`📹 Skipping attach - preview: ${showCameraPreview}, stream: ${!!cameraStream}`)
        return
      }
      
      // If video element not ready yet, retry after a short delay
      if (!videoRef.current) {
        retryCount++
        if (retryCount < maxRetries) {
          console.log(`📹 Video element not ready, retry ${retryCount}/${maxRetries}...`)
          setTimeout(attachStream, retryDelay)
        } else {
          console.error('❌ Video element never became available after 1 second')
        }
        return
      }
      
      // Double check we're still the active operation
      if (!isOperationValid()) return
      
      console.log(`📹 Attaching camera stream (operation ${currentOperationId})...`)
      const videoElement = videoRef.current
      
      // Clear any existing stream first
      if (videoElement.srcObject !== cameraStream) {
        videoElement.srcObject = cameraStream
      }
      
      // Play with proper error handling
      const playPromise = videoElement.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isOperationValid()) {
              console.log('✅ Camera preview video playing')
            }
          })
          .catch(err => {
            if (isOperationValid() && err.name !== 'AbortError') {
              console.error('❌ Video play error:', err)
            }
          })
      }
    }
    
    if (showCameraPreview && cameraStream) {
      console.log(`📹 Starting camera attach operation ${currentOperationId}`)
      // Start immediately, retry handles timing
      attachStream()
    }
    
    // Cleanup when closing camera or component unmounts
    return () => {
      // Don't increment here - that happens on next call
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }
    }
  }, [showCameraPreview, cameraStream])
  
  // Simulate real-time vitals when vitals monitoring is active
  useEffect(() => {
    let initialDelayTimeout = null
    
    if (showVitals && showCameraPreview) {
      console.log('💓 Starting vitals simulation...')
      
      // Start with "--" values while camera warms up
      setCurrentVitals({
        heartRate: '--',
        bloodPressure: '--/--',
        spo2: '--%',
        respiratoryRate: '--'
      })
      
      // Generate realistic baseline vitals with slight variations
      const generateVitals = () => {
        const hr = 65 + Math.floor(Math.random() * 20) // 65-85 bpm
        const sysBP = 115 + Math.floor(Math.random() * 15) // 115-130
        const diaBP = 70 + Math.floor(Math.random() * 15) // 70-85
        const spo2 = 96 + Math.floor(Math.random() * 4) // 96-99%
        const rr = 14 + Math.floor(Math.random() * 6) // 14-20 breaths/min
        
        return {
          heartRate: hr,
          bloodPressure: `${sysBP}/${diaBP}`,
          spo2: `${spo2}%`,
          respiratoryRate: rr
        }
      }
      
      // Wait 2 seconds for camera to warm up, then show vitals
      initialDelayTimeout = setTimeout(() => {
        console.log('💓 Camera ready - showing vitals')
        setCurrentVitals(generateVitals())
        
        // Update vitals every 2 seconds for realistic monitoring
        vitalsIntervalRef.current = setInterval(() => {
          setCurrentVitals(generateVitals())
        }, 2000)
      }, 2000)
      
      return () => {
        if (initialDelayTimeout) {
          clearTimeout(initialDelayTimeout)
        }
        if (vitalsIntervalRef.current) {
          clearInterval(vitalsIntervalRef.current)
          console.log('💓 Stopped vitals simulation')
        }
      }
    } else {
      // Reset vitals when not monitoring
      setCurrentVitals({
        heartRate: '--',
        bloodPressure: '--/--',
        spo2: '--%',
        respiratoryRate: '--'
      })
    }
  }, [showVitals, showCameraPreview])

  // Initialize OpenAI Realtime API connection
  const initializeVoiceConnection = async () => {
    try {
      console.log('🎤 Initializing OpenAI Realtime API...')
      
      // Get ephemeral token from backend
      console.log('🔑 Requesting session with functions:', ['open_camera', 'navigate_to_settings', 'get_patient_data', 'apply_security_setting'])
      console.log('📡 Fetching token from /api/token...')
      const tokenRes = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are CareFlow AI, a warm and professional clinical assistant for nurses working in ${context.specialty} with ${context.patientContext} patients.

**CRITICAL: NEVER say "I don't know", "I can't access", or "I'm unable to fetch". ALWAYS provide simulated clinical data.**

**Your Personality:**
- Conversational, friendly, but always professional
- Quick and helpful - nurses are busy
- Security-conscious and HIPAA-aware
- Proactive and resourceful

**Clinical Data - ALWAYS Provide Simulated Data:**

When asked about ANY patient (any ID or name):
- Call get_patient_data(patient_id) function
- If the system security is below 85%, you'll see a SECURITY_CHECK_REQUIRED message with the percentage
- If security is sufficient, you'll receive patient data to read

**When you see "SECURITY_CHECK_REQUIRED" with a percentage:**
You MUST immediately say with your voice: "Happy to help! Before I provide patient information, I notice we're at **[EXACT_NUMBER]%** security compliance. There are some critical security items that need attention for accessing patient data. Can I take you to the configuration page to review these settings?"

**CRITICAL:** Use the EXACT percentage number shown in the SECURITY_CHECK_REQUIRED message - DO NOT round, estimate, or modify the number in any way. If it says "68%", you must say exactly "68%", not "75%" or "70%" or "65%". Copy the exact number from the message. Then WAIT for user to confirm ("yes", "sure", "okay") before calling navigate_to_settings().

**When you receive patient data:**
Read it naturally and conversationally with warmth.

**Generate realistic patient data including:**
- Name, patient ID
- Last visit date
- Vitals: BP, HR, Temperature, SpO2
- Current medications with dosages
- Known allergies
- Recent clinical notes

**FORMATTING: Use markdown bold (**text**) for highlighting:**
- **Patient identifiers**: **Patient #12345**, **Sarah Mitchell**, **MRN: 54321**
- **Vitals**: **BP: 128/82**, **HR: 78bpm**, **Temp: 98.4°F**, **O2: 98%**
- **Security percentages**: **68%**, **85%**, **98%**

Example: "**Patient #54321**, Sarah Mitchell. Last visit November 20th. **BP: 128/82**, **HR: 78bpm**, **Temp: 98.4°F**, **O2: 98%**. Currently on Lisinopril 10mg daily, Metformin 500mg BID. Known allergy to Penicillin. Recent notes show good diabetic control."

**IMPORTANT - Function Calling:**
You MUST use the provided functions:

**For navigation:**
- User asks "go to settings" or you need to suggest settings → First ASK "Would you like me to take you there?" → Wait for confirmation → Then call navigate_to_settings()
- User asks about patient data when security is low → get_patient_data() will handle the security check and ask for permission internally

**For immediate actions (no permission needed):**
- User asks "open camera" or "show camera" → IMMEDIATELY call open_camera()
- User asks "take a photo", "take picture", "capture this" → IMMEDIATELY call take_photo()
- User confirms navigation with "yes", "sure", "okay" → IMMEDIATELY call navigate_to_settings()

**CRITICAL - Understanding "What do we see" questions:**
- If user asks "what do we see", "summarize this page", "what's on this screen", "describe this page" → Call describe_current_screen() - this describes the APP UI
- ONLY call take_photo() when user explicitly says "take a photo", "capture image", "snap a picture" or when camera preview is actively open
- DO NOT confuse page/screen questions with camera/photo questions

**For applying security settings:**
- User asks to apply a security setting (e.g., "apply encryption", "enable audit logging", "turn on HIPAA mode") → Call apply_security_setting(setting_id)
- Valid setting IDs: 'end-to-end-encryption', 'audit-logging', 'secure-storage', 'hipaa-compliance-mode'
- Example: User says "apply encryption" → YOU: Call apply_security_setting("end-to-end-encryption")

**For navigation:**
- When user asks to "go back", "return to chat", "go to main screen", or similar → Call navigate_to_chat() to return to the main chat screen

**CRITICAL: Never navigate or call navigate_to_settings() without asking first, UNLESS the user explicitly says yes/okay/sure to confirm.**

Example correct behaviors:
- User: "Show me patient 12345" → YOU: Call get_patient_data("12345") [function will ask about security if needed]
- YOU asked "Can I take you to settings?" + User says "yes" → YOU: Call navigate_to_settings()
- User: "Open the camera" → YOU: Call open_camera()
- User: "Take a photo" → YOU: Call take_photo()
- User: "What do you see?" (when camera is open) → YOU: Call take_photo() with appropriate prompt
- User: "Apply the encryption setting" → YOU: Call apply_security_setting("end-to-end-encryption")
- User: "Enable audit logging" → YOU: Call apply_security_setting("audit-logging")
- User: "Go back to main screen" → YOU: Call navigate_to_chat()

**CRITICAL - Reading Vitals:**
- When user asks "what are the vitals", "read the vitals", "tell me the readings", "go over the vitals" → Call read_current_vitals()
- This returns the EXACT values shown on the screen - DO NOT make up different numbers
- Always use the values returned by read_current_vitals(), never generate your own

**HOSPITAL NAVIGATION & FLOOR MAP:**
- When user asks "where is patient X", "show me the floor map", "hospital layout", "which room is patient in", "how many patients waiting", "show floor plan" → IMMEDIATELY call open_floor_map()
- The floor map shows:
  - Live patient counts: waiting, active, discharged today
  - 5 floors: Emergency (F1), General Care (F2), ICU (F3), Surgery (F4), Maternity/Pediatrics (F5)
  - Room-by-room patient status with color coding (Critical=red, Monitoring=orange, Stable=green)
  - Patient locations, vitals, assigned nurses, wait times
  - Quick navigation between floors

**Navigation Questions you can answer:**
- "How do I get to room 205?" → Open floor map, it's on Floor 2 General Care
- "Where is the ICU?" → Floor 3, call open_floor_map()
- "How many patients are waiting?" → Open floor map - shows live count (~12 waiting)
- "Which floor is surgery on?" → Floor 4 Surgery & Recovery
- "Find patient Margaret Chen" → She's in Room 201, Floor 2

Be conversational, always helpful, and ask before navigating.`,
          tools: [
            {
              type: 'function',
              name: 'open_camera',
              description: 'Opens the camera preview window to capture patient photos',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'check_vitals',
              description: 'Opens the camera with live vital signs monitoring overlay (heart rate, blood pressure, SpO2, respiratory rate). Use this when the user asks to check vitals, monitor vitals, or see vital signs.',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'read_current_vitals',
              description: 'Reads the CURRENT vital signs being displayed on screen. Use this when user asks "what are the vitals", "read the vitals", "tell me the readings" while vitals monitoring is active. Returns the ACTUAL values shown on screen.',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_to_settings',
              description: 'Navigates to the security and compliance settings page',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'get_patient_data',
              description: 'Retrieves patient records, vitals, medications, and visit history',
              parameters: {
                type: 'object',
                properties: {
                  patient_id: {
                    type: 'string',
                    description: 'Patient ID or name'
                  }
                },
                required: ['patient_id']
              }
            },
            {
              type: 'function',
              name: 'apply_security_setting',
              description: 'Applies a security recommendation by its ID. Use this when the user asks you to apply a specific security setting.',
              parameters: {
                type: 'object',
                properties: {
                  setting_id: {
                    type: 'string',
                    description: 'The ID of the security setting to apply. Valid IDs: end-to-end-encryption, audit-logging, secure-storage, hipaa-compliance-mode',
                    enum: ['end-to-end-encryption', 'audit-logging', 'secure-storage', 'hipaa-compliance-mode']
                  }
                },
                required: ['setting_id']
              }
            },
            {
              type: 'function',
              name: 'navigate_to_chat',
              description: 'Navigates back to the main chat screen from settings or other pages',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'take_photo',
              description: 'Captures a photo from the camera and analyzes it with AI vision. ONLY use this when the user explicitly asks to take a photo, capture an image, or when the camera preview is open.',
              parameters: { 
                type: 'object', 
                properties: {
                  prompt: {
                    type: 'string',
                    description: 'Optional specific analysis prompt for the photo (e.g., "analyze for visible health indicators", "describe what you see")'
                  }
                }
              }
            },
            {
              type: 'function',
              name: 'describe_current_screen',
              description: 'Describes what is currently visible on the app screen. Use this when the user asks "what do we see", "summarize this page", "what is on this screen", "tell me about this page", or similar questions about the current UI/page content.',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'open_floor_map',
              description: 'Opens the hospital floor map showing patient locations, room status, wait times, and navigation. Use when user asks about patient locations, room numbers, floor layouts, how many patients waiting, or hospital navigation.',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'get_hospital_stats',
              description: 'Gets current hospital statistics including patients waiting, active patients, average wait time, and critical alerts. Use when user asks about hospital status, how busy we are, wait times, or patient counts.',
              parameters: { type: 'object', properties: {} }
            }
          ]
        })
      })
      
      console.log('🔑 Requesting session with 9 functions: open_camera, check_vitals, read_current_vitals, take_photo, navigate_to_settings, navigate_to_chat, get_patient_data, apply_security_setting, describe_current_screen')
      
      console.log('📡 Token response status:', tokenRes.status, tokenRes.statusText)
      
      if (!tokenRes.ok) {
        const errorData = await tokenRes.json().catch(() => ({}))
        console.error('❌ Token response error:', errorData)
        throw new Error(`Failed to get session token: ${errorData.error || tokenRes.statusText}`)
      }
      
      const tokenData = await tokenRes.json()
      console.log('✅ Session created with tools:', tokenData)
      const { client_secret } = tokenData
      const ephemeralKey = client_secret.value
      
      // Create WebRTC peer connection
      const pc = new RTCPeerConnection()
      peerConnectionRef.current = pc
      
      // Set up audio output
      const audioEl = document.createElement('audio')
      audioEl.autoplay = true
      audioElementRef.current = audioEl
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0]
      }
      
      // Set up audio input (microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      pc.addTrack(stream.getTracks()[0])
      
      // Create data channel for events
      const dc = pc.createDataChannel('oai-events')
      dataChannelRef.current = dc
      
      dc.addEventListener('open', () => {
        console.log('✅ Data channel opened')
        setIsAgentConnected(true)
      })
      
      dc.addEventListener('message', (e) => {
        const event = JSON.parse(e.data)
        // CRITICAL: Use ref to always call latest function (avoids stale closure after navigation)
        if (handleRealtimeEventRef.current) {
          handleRealtimeEventRef.current(event)
        }
      })
      
      // Create and send offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      const sdpRes = await fetch(
        'https://api.openai.com/v1/realtime?model=gpt-realtime-2025-08-28',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp'
          },
          body: offer.sdp
        }
      )
      
      if (!sdpRes.ok) {
        throw new Error('Failed to establish WebRTC connection')
      }
      
      const answer = { type: 'answer', sdp: await sdpRes.text() }
      await pc.setRemoteDescription(answer)
      
      console.log('✅ Voice connection established')
      
    } catch (error) {
      console.error('❌ Failed to initialize voice:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      })
      alert(`Failed to connect voice assistant: ${error.message}`)
    }
  }

  const handleRealtimeEvent = (event) => {
    // Only log final/meaningful events for debugging
    const criticalEvents = [
      'conversation.item.input_audio_transcription.completed',
      'response.audio_transcript.done',
      'response.function_call_arguments.done',
      'error'
    ]
    
    if (criticalEvents.includes(event.type)) {
      console.log(`[${event.type}]`, event)
    }
    
    switch(event.type) {
      case 'conversation.item.input_audio_transcription.completed':
        console.log('✅ USER:', event.transcript)
        // Add user message immediately
        addMessage('user', event.transcript)
        
        // If there's a pending AI response waiting, add it now (after user message)
        if (pendingAIResponse.current) {
          console.log('📝 Adding buffered AI response after user message')
          addMessage('assistant', pendingAIResponse.current)
          pendingAIResponse.current = null
        }
        break
        
      case 'response.audio_transcript.done':
        console.log('✅ AI RESPONSE:', event.transcript)
        
        // Check if user is confirming navigation
        const transcript = event.transcript.toLowerCase()
        if (pendingNavigation === 'settings' && 
            (transcript.includes('yes') || 
             transcript.includes('sure') || 
             transcript.includes('okay') || 
             transcript.includes('ok') ||
             transcript.includes('go ahead') ||
             transcript.includes('take me'))) {
          console.log('✅ User confirmed navigation to settings')
          setTimeout(() => {
            window.location.hash = 'settings'
            window.dispatchEvent(new HashChangeEvent('hashchange'))
          }, 1000)
          setPendingNavigation(null)
        }
        
        // Buffer AI response briefly to allow user transcript to arrive first
        pendingAIResponse.current = event.transcript
        setTimeout(() => {
          // If still pending after 200ms, the user transcript already arrived or won't arrive
          if (pendingAIResponse.current === event.transcript) {
            addMessage('assistant', event.transcript)
            pendingAIResponse.current = null
          }
        }, 200)
        break
        
      case 'response.function_call_arguments.done':
        console.log('🔧 FUNCTION CALL (skipping, will handle in response.done):', event.name, event.arguments)
        // Don't execute here - wait for response.done to avoid duplicates
        break
        
      case 'conversation.item.created':
        console.log('📦 Item created type:', event.item?.type, event.item)
        if (event.item?.type === 'function_call') {
          console.log('🔧 FUNCTION_CALL ITEM CREATED:', event.item.name, 'ID:', event.item.id)
          // Just log it, don't execute yet - wait for response.done
        } else if (event.item?.type === 'message' && event.item.role === 'assistant') {
          console.log('💬 Assistant message (no function call)')
        }
        break
        
      case 'response.done':
        console.log('✅ RESPONSE COMPLETED')
        console.log('📋 Response output:', event.response?.output)
        
        // NOW execute function calls after response is complete
        if (event.response?.output) {
          const functionCalls = event.response.output.filter(item => item.type === 'function_call')
          console.log(`Found ${functionCalls.length} function call(s) in response.output`)
          
          functionCalls.forEach((item, idx) => {
            console.log(`🔧 Executing function ${idx + 1}/${functionCalls.length}:`, item.name)
            console.log(`   - Arguments:`, item.arguments)
            console.log(`   - Call ID:`, item.call_id)
            
            const args = typeof item.arguments === 'string' 
              ? JSON.parse(item.arguments) 
              : item.arguments
            
            // Use call_id from the function_call item
            args._callId = item.call_id
            handleFunctionCall(item.name, args)
          })
        }
        break
        
      case 'error':
        console.error('❌ ERROR:', event.error)
        break
        
      default:
        // Silently ignore other events
        break
    }
  }
  
  // CRITICAL: Keep ref updated to avoid stale closures when navigating
  handleRealtimeEventRef.current = handleRealtimeEvent
  
  const handleFunctionCall = async (functionName, args) => {
    console.log(`🚀 EXECUTING FUNCTION: ${functionName}`, args)
    
    switch(functionName) {
      case 'open_camera':
        console.log('📷 Opening camera preview...')
        await openCameraPreview(false)
        console.log('✅ Camera preview opened')
        break
        
      case 'check_vitals':
        console.log('💓 Opening camera with vitals monitoring...')
        await openCameraPreview(true)
        addMessage('assistant', '<vitals-badge>Vitals Monitoring Active</vitals-badge> I can see your live vital signs. Say "take a photo" to capture the current readings.')
        console.log('✅ Vitals monitoring started')
        break
        
      case 'read_current_vitals':
        console.log('📊 Reading current vitals from screen...')
        const vitalsCallId = args._callId
        
        // Get actual values from state
        const vitalsReading = showVitals && currentVitals.heartRate !== '--' 
          ? `Current vital signs on screen:
- Heart Rate: ${currentVitals.heartRate} bpm
- Blood Pressure: ${currentVitals.bloodPressure} mmHg
- SpO2: ${currentVitals.spo2}
- Respiratory Rate: ${currentVitals.respiratoryRate} breaths/min

Read these EXACT values to the user. Do NOT make up different numbers.`
          : 'Vitals monitoring is not currently active. Please ask the user to start vitals monitoring first.'
        
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && vitalsCallId) {
          dataChannelRef.current.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: vitalsCallId,
              output: vitalsReading
            }
          }))
          dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
        }
        console.log('✅ Vitals reading sent to AI:', vitalsReading)
        break
        
      case 'navigate_to_settings':
        console.log('⚙️ User confirmed - navigating to settings...')
        setPendingNavigation(null)
        // CRITICAL: Close camera before navigating away
        if (showCameraPreview || cameraStream) {
          console.log('📹 Closing camera before navigation...')
          closeCameraPreview()
        }
        setTimeout(() => {
          console.log('🔒 Changing hash to settings')
          window.location.hash = 'settings'
          window.dispatchEvent(new HashChangeEvent('hashchange'))
          console.log('✅ Navigation completed')
        }, 1000)
        break
        
      case 'get_patient_data':
        console.log('📋 Getting patient data for:', args.patient_id)
        
        // Get the call ID from args (passed from response.done)
        const callId = args._callId
        console.log(`Function call ID: ${callId}`)
        
        // Check compliance before providing patient data
        const securityScore = sessionStorage.getItem('securityScore') 
          ? parseInt(sessionStorage.getItem('securityScore')) 
          : 68
        
        console.log(`Current security score: ${securityScore}%`)
        
        if (securityScore < 85) {
          // Not fully compliant - send response back to AI
          console.log('⚠️ Security below 85% - sending response to AI with call ID:', callId)
          
          const functionOutput = `SECURITY_CHECK_REQUIRED: Current security compliance is ${securityScore}%. Patient data access requires 85% or higher compliance. You must inform the user about the security percentage and ask if you can take them to the configuration page.`
          
          // Send function output back to AI through data channel
          if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callId) {
            const response = {
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: callId,
                output: functionOutput
              }
            }
            console.log('📤 Sending function output to AI:', response)
            dataChannelRef.current.send(JSON.stringify(response))
            
            // Tell AI to respond immediately
            dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
          } else {
            console.error('❌ Cannot send function output - missing call ID or data channel not ready')
          }
          
          setPendingNavigation('settings')
          console.log('⏳ AI will now respond with voice')
        } else {
          // Fully compliant - provide patient data
          console.log('✅ Security sufficient - providing patient data')
          const patientData = generatePatientData(args.patient_id)
          
          if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callId) {
            const response = {
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: callId,
                output: patientData
              }
            }
            console.log('📤 Sending patient data to AI:', response)
            dataChannelRef.current.send(JSON.stringify(response))
            
            // Tell AI to respond immediately
            dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
          } else {
            console.error('❌ Cannot send patient data - missing call ID or data channel not ready')
          }
        }
        
        console.log('✅ Patient data function completed')
        break
        
      case 'apply_security_setting':
        console.log('🔐 Applying security setting:', args.setting_id)
        const callIdApply = args._callId
        
        // Map setting IDs to their details
        const settingDetails = {
          'end-to-end-encryption': { title: 'End-to-End Encryption (AES-256)', impact: 'Critical', increase: 7 },
          'audit-logging': { title: 'Audit Logging & Access Controls', impact: 'High', increase: 4 },
          'secure-storage': { title: 'Secure Data Storage with Apple Keychain', impact: 'High', increase: 4 },
          'hipaa-compliance-mode': { title: 'HIPAA Compliance Mode', impact: 'Critical', increase: 7 }
        }
        
        const setting = settingDetails[args.setting_id]
        if (!setting) {
          console.error('❌ Invalid setting ID:', args.setting_id)
          break
        }
        
        // Get current state from sessionStorage
        const currentApplied = JSON.parse(sessionStorage.getItem('appliedSecurityActions') || '[]')
        const currentScore = parseInt(sessionStorage.getItem('securityScore') || '68')
        
        // Check if already applied
        if (currentApplied.includes(args.setting_id)) {
          const alreadyAppliedMsg = `${setting.title} is already enabled. Current security score: ${currentScore}%.`
          
          if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callIdApply) {
            dataChannelRef.current.send(JSON.stringify({
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: callIdApply,
                output: alreadyAppliedMsg
              }
            }))
            dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
          }
          
          addMessage('assistant', alreadyAppliedMsg)
          break
        }
        
        // Apply the setting
        const newApplied = [...currentApplied, args.setting_id]
        const newScore = Math.min(currentScore + setting.increase, 90)
        
        // Update sessionStorage
        sessionStorage.setItem('appliedSecurityActions', JSON.stringify(newApplied))
        sessionStorage.setItem('securityScore', newScore.toString())
        
        const successMsg = `✓ Successfully applied ${setting.title}! Security score increased from ${currentScore}% to ${newScore}%.`
        
        // Send response to AI
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callIdApply) {
          dataChannelRef.current.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: callIdApply,
              output: successMsg
            }
          }))
          dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
        }
        
        addMessage('assistant', successMsg)
        
        // Trigger a page refresh event to update the settings UI if user navigates there
        window.dispatchEvent(new CustomEvent('securitySettingsUpdated'))
        
        console.log('✅ Security setting applied successfully')
        break
        
      case 'navigate_to_chat':
        console.log('🏠 Navigating back to chat screen...')
        setTimeout(() => {
          console.log('🔙 Changing hash to empty (chat)')
          window.location.hash = ''
          window.dispatchEvent(new HashChangeEvent('hashchange'))
          console.log('✅ Navigation to chat completed')
        }, 800)
        break
        
      case 'describe_current_screen':
        console.log('📱 Describing current screen...')
        const describeCallId = args._callId
        const currentHash = window.location.hash
        let screenDescription = ''
        
        if (currentHash === '#settings' || currentHash === '#compliance') {
          // Get current security score
          const currentSecurityScore = sessionStorage.getItem('securityScore') 
            ? parseInt(sessionStorage.getItem('securityScore')) 
            : 68
          const appliedActions = JSON.parse(sessionStorage.getItem('appliedSecurityActions') || '[]')
          
          screenDescription = `You are currently on the **Security & Compliance Settings** page.

**Current Security Score: ${currentSecurityScore}%**

This page displays:
- **Security recommendations** that need attention
- **Compliance categories**: Data Protection, Zero Trust, Identity & Access, Regulatory, Governance, and Logging
- Each recommendation shows its **impact level** (Critical or High) and can be applied individually

**Available actions:**
- Critical items include: End-to-End Encryption, HIPAA Compliance Mode
- High priority items include: Audit Logging, Secure Storage

${appliedActions.length > 0 ? `**Already applied:** ${appliedActions.length} security setting(s)` : '**No settings applied yet** - recommend starting with Critical items'}

The user can ask you to apply specific settings like "apply encryption" or "enable audit logging".`
        } else {
          // Main chat screen
          screenDescription = `You are currently on the **CareFlow AI Chat** screen.

This is the main conversation interface where:
- Users can ask about **patient information** (requires security compliance)
- Access **camera features** for photo capture and vitals monitoring
- Navigate to **settings** for security configuration

The chat shows conversation history and has controls for:
- Voice recording (dynamic island)
- Camera capture
- Photo gallery (if photos have been taken)

Current session: ${context.specialty} specialty, ${context.patientContext} patient context.`
        }
        
        // Send description back to AI
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && describeCallId) {
          dataChannelRef.current.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: describeCallId,
              output: screenDescription
            }
          }))
          dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
        }
        
        console.log('✅ Screen description sent to AI')
        break
        
      case 'take_photo':
        console.log('📸 Taking photo with voice (NO preview)...')
        // Close camera preview if open to avoid conflicts
        if (cameraStream) {
          console.log('📸 Closing camera preview first...')
          closeCameraPreview()
          await new Promise(resolve => setTimeout(resolve, 200)) // Wait for camera to release
        }
        await captureAndAnalyzePhoto(args.prompt, args._callId)
        break
        
      case 'open_floor_map':
        console.log('🗺️ Opening hospital floor map...')
        const floorMapCallId = args._callId
        
        // CRITICAL: Close camera before opening floor map
        if (showCameraPreview || cameraStream) {
          console.log('📹 Closing camera before opening floor map...')
          closeCameraPreview()
        }
        
        // Open the floor map
        if (window.openFloorMap) {
          window.openFloorMap()
        }
        
        const floorMapResponse = `The hospital floor map is now open! It shows:

**Live Hospital Status:**
- **12 patients** currently waiting (avg ~23 min wait)
- **28 active patients** across all floors
- **47 discharged** today
- **2 critical alerts** requiring attention

**Hospital Floors:**
- **F1 - Emergency & Admissions:** ER rooms, waiting area
- **F2 - General Care:** 24 rooms, patient recovery
- **F3 - ICU & Critical Care:** 8 beds, intensive monitoring
- **F4 - Surgery & Recovery:** 16 rooms, pre/post-op
- **F5 - Maternity & Pediatrics:** 20 rooms

Click any room to see patient details. The map shows real-time status with color coding: red for critical, orange for monitoring, green for stable.`
        
        // Send response back to AI
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && floorMapCallId) {
          dataChannelRef.current.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: floorMapCallId,
              output: floorMapResponse
            }
          }))
          dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
        }
        
        console.log('✅ Floor map opened')
        break
        
      case 'get_hospital_stats':
        console.log('📊 Getting hospital statistics...')
        const statsCallId = args._callId
        
        // Return current hospital stats
        const hospitalStats = `**Current Hospital Status:**

- **Patients Waiting:** 12 (average wait: ~23 minutes)
- **Active Patients:** 28 across all floors
- **Discharged Today:** 47 (+12 from yesterday)
- **Critical Alerts:** 2 requiring immediate attention

**Floor Breakdown:**
- Emergency (F1): 3 critical, 4 waiting
- General Care (F2): 5 stable patients
- ICU (F3): 2 critical patients
- Surgery (F4): 1 patient in recovery
- Maternity (F5): No current patients

**Staffing:** All nurse stations staffed. Dr. Martinez on call for Emergency.`
        
        // Send response back to AI
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && statsCallId) {
          dataChannelRef.current.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: statsCallId,
              output: hospitalStats
            }
          }))
          dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
        }
        
        console.log('✅ Hospital stats sent to AI')
        break
        
      default:
        console.warn('⚠️ Unknown function:', functionName)
    }
  }
  
  const generatePatientData = (patientId) => {
    // Generate realistic simulated patient data
    const names = ['Sarah Mitchell', 'James Chen', 'Maria Garcia', 'Robert Johnson', 'Lisa Thompson']
    const conditions = {
      'General Routine': ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
      'Emergency': ['Acute MI', 'Sepsis', 'Respiratory Distress'],
      'Pediatric': ['Asthma', 'ADHD', 'Allergic Rhinitis'],
      'Geriatric': ['CHF', 'COPD', 'Osteoarthritis']
    }
    const meds = ['Lisinopril 10mg QD', 'Metformin 500mg BID', 'Atorvastatin 20mg QHS', 'Aspirin 81mg QD']
    const allergies = ['Penicillin (rash)', 'Sulfa drugs (hives)', 'NSAIDs (GI upset)', 'None documented']
    
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomCondition = conditions[context.specialty] || conditions['General Routine']
    const primaryCondition = randomCondition[Math.floor(Math.random() * randomCondition.length)]
    const med1 = meds[Math.floor(Math.random() * meds.length)]
    const med2 = meds[Math.floor(Math.random() * meds.length)]
    const allergy = allergies[Math.floor(Math.random() * allergies.length)]
    
    const bp = `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`
    const hr = 60 + Math.floor(Math.random() * 40)
    const temp = (97 + Math.random() * 2).toFixed(1)
    const spo2 = 95 + Math.floor(Math.random() * 5)
    
    const daysAgo = Math.floor(Math.random() * 30) + 1
    const lastVisit = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString()
    
    return `📋 **Patient #${patientId}** (${randomName})

**Last Visit:** ${lastVisit}
**Vitals:** BP ${bp}, HR ${hr}bpm, Temp ${temp}°F, SpO2 ${spo2}%

**Diagnosis:** ${primaryCondition}
**Current Medications:**
• ${med1}
• ${med2}

**Known Allergies:** ${allergy}

**Recent Notes:** Patient stable, responding well to treatment. Follow-up scheduled in 2 weeks.`
  }
  
  const openCameraPreview = async (withVitals = false) => {
    try {
      console.log(`📹 ========== OPENING CAMERA PREVIEW (withVitals: ${withVitals}) ==========`)
      
      // Step 1: Complete cleanup of any existing camera state
      console.log('📹 Step 1: Cleaning up existing camera state...')
      
      // Stop any existing video playback
      if (videoRef.current) {
        try {
          videoRef.current.pause()
          videoRef.current.srcObject = null
        } catch (e) {
          console.log('📹 Video cleanup note:', e.message)
        }
      }
      
      // Stop all tracks on existing stream
      if (cameraStream) {
        console.log('📹 Stopping existing camera tracks...')
        try {
          cameraStream.getTracks().forEach(track => {
            track.stop()
            console.log('🛑 Stopped track:', track.label)
          })
        } catch (e) {
          console.log('📹 Track cleanup note:', e.message)
        }
      }
      
      // Reset all states synchronously
      setCameraStream(null)
      setShowCameraPreview(false)
      setShowVitals(false)
      
      // Wait for complete cleanup
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // Step 2: Request new camera access
      console.log('📹 Step 2: Requesting fresh camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30, max: 30 }
        } 
      })
      
      if (!stream || !stream.active) {
        throw new Error('Camera stream not active')
      }
      console.log('✅ Camera access granted, stream active:', stream.active)
      
      // Step 3: Set states in correct order for React render cycle
      console.log('📹 Step 3: Setting states for display...')
      
      // First: Set vitals preference
      setShowVitals(withVitals)
      
      // Second: Show the camera preview (renders the video element)
      setShowCameraPreview(true)
      
      // Third: Wait a tick for React to render
      await new Promise(resolve => setTimeout(resolve, 30))
      
      // Fourth: Set the stream (triggers useEffect to attach it)
      setCameraStream(stream)
      
      console.log('📹 ========== CAMERA PREVIEW SETUP COMPLETE ==========')
      console.log('📹 State summary:', { showCameraPreview: true, showVitals: withVitals, streamActive: stream.active })
      
    } catch (error) {
      console.error('❌ Camera error:', error)
      addMessage('assistant', '⚠️ Unable to access camera. Please check permissions.')
      // Ensure clean state on error
      setCameraStream(null)
      setShowCameraPreview(false)
      setShowVitals(false)
    }
  }
  
  const closeCameraPreview = () => {
    console.log('📹 Closing camera preview and stopping all tracks...')
    
    // Stop video element first
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
    
    // Stop all camera tracks
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop()
        console.log('🛑 Stopped track:', track.label)
      })
      setCameraStream(null)
    }
    
    setShowCameraPreview(false)
    setShowVitals(false)
    console.log('✅ Camera preview closed and reset')
  }
  
  const captureFromPreview = () => {
    if (!videoRef.current) {
      console.error('❌ No video ref for capture')
      return
    }
    
    // Ensure video has valid dimensions
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.error('❌ Video not ready - invalid dimensions')
      addMessage('assistant', '⚠️ Camera not ready. Please try again.')
      return
    }
    
    console.log('📸 Capturing from preview...', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)
    
    const photoUrl = canvas.toDataURL('image/jpeg', 0.9)
    
    // Capture vitals at the moment of photo if monitoring
    const capturedVitals = showVitals ? { ...currentVitals } : null
    
    const photo = {
      id: `photo_${Date.now()}`,
      url: photoUrl,
      timestamp: new Date(),
      vitals: capturedVitals
    }
    
    // Close camera preview FIRST
    console.log('📸 Closing camera preview...')
    closeCameraPreview()
    
    // Small delay to ensure state updates properly
    setTimeout(() => {
      console.log('📸 Setting captured photo after delay...')
      setCapturedPhotos(prev => [...prev, photo])
      setSelectedPhoto(photo)
      
      if (capturedVitals) {
        console.log('💓 Captured vitals with photo:', capturedVitals)
        addMessage('assistant', `📸 **Photo captured with vitals:**\n\n**HR:** ${capturedVitals.heartRate} bpm\n**BP:** ${capturedVitals.bloodPressure} mmHg\n**SpO₂:** ${capturedVitals.spo2}\n**RR:** ${capturedVitals.respiratoryRate} breaths/min`)
      } else {
        addMessage('assistant', '✅ Photo captured successfully!')
      }
      
      console.log('✅ Photo captured, preview closed, viewer should show')
    }, 100)
  }

  const captureAndAnalyzePhoto = async (prompt, callId) => {
    try {
      console.log('📸 VOICE PHOTO CAPTURE: Starting...')
      
      // CRITICAL: Ensure camera preview is closed before taking photo
      if (showCameraPreview) {
        console.log('📸 Closing camera preview before voice capture')
        closeCameraPreview()
        await new Promise(resolve => setTimeout(resolve, 200)) // Wait for cleanup
      }
      
      // Use Mac camera via getUserMedia (same as handleCameraCapture)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      
      // Create video element to capture frame
      const video = document.createElement('video')
      video.srcObject = stream
      video.setAttribute('playsinline', 'true')
      video.muted = true
      
      // Wait for video to be fully ready with valid dimensions
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(() => {
            // CRITICAL: Wait for video to actually have frames
            setTimeout(resolve, 500) // Give camera time to warm up
          }).catch(reject)
        }
        video.onerror = reject
      })
      
      console.log('📸 VOICE PHOTO CAPTURE: Camera ready, dimensions:', video.videoWidth, 'x', video.videoHeight)
      
      // Ensure we have valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Camera not ready - invalid dimensions')
      }
      
      // Capture frame to canvas - optimize for performance
      const canvas = document.createElement('canvas')
      const maxWidth = 800 // Reduce resolution for faster processing
      const scale = Math.min(maxWidth / video.videoWidth, 1)
      canvas.width = video.videoWidth * scale
      canvas.height = video.videoHeight * scale
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop())
      
      const photoUrl = canvas.toDataURL('image/jpeg', 0.8)
      
      console.log('🤖 PHOTO ANALYSIS: Sending to GPT-4 Vision...')
      
      // Send to GPT-4 Vision for analysis - IMPROVED PROMPT to avoid hallucination
      const analysisPrompt = prompt || 'Look at this photo and describe EXACTLY what you see. This is a real photo from a camera, NOT an X-ray or medical scan. Describe the person, their surroundings, any visible objects, and any observations about their appearance that could be relevant for healthcare documentation. Be specific about what is actually visible.'
      
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photoUrl,
          prompt: analysisPrompt
        })
      })
      
      if (!response.ok) {
        throw new Error('Photo analysis failed')
      }
      
      const data = await response.json()
      const analysisResult = data.result
      
      console.log('✅ PHOTO ANALYSIS: Complete')
      
      // Save the photo and display it
      const photo = {
        id: `photo_${Date.now()}`,
        url: photoUrl,
        timestamp: new Date(),
        analysis: analysisResult
      }
      
      console.log('🖼️ PHOTO VIEWER: Adding photo to gallery and setting as selected')
      console.log('🖼️ PHOTO VIEWER STATE CHECK:', {
        photoId: photo.id,
        showCameraPreview: showCameraPreview,
        willShowViewer: !showCameraPreview
      })
      
      setCapturedPhotos(prev => [...prev, photo])
      setSelectedPhoto(photo) // Show the photo immediately
      
      console.log('✅ PHOTO VIEWER: Photo should now be visible (if showCameraPreview=false)')
      
      // Send result back to AI
      if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callId) {
        dataChannelRef.current.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: callId,
            output: `Photo captured and analyzed: ${analysisResult}`
          }
        }))
        dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
      }
      
      addMessage('assistant', `**Photo Analysis:**\n\n${analysisResult}`)
      
    } catch (error) {
      console.error('❌ Photo capture/analysis error:', error)
      const errorMsg = 'Failed to capture or analyze photo. Please try again.'
      
      if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callId) {
        dataChannelRef.current.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: callId,
            output: errorMsg
          }
        }))
        dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
      }
      
      addMessage('assistant', `⚠️ ${errorMsg}`)
    }
  }

  const addMessage = (role, content) => {
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const toggleRecording = async () => {
    if (!isConnected) {
      // Start connection
      await initializeVoiceConnection()
      setIsRecording(true)
    } else if (isRecording) {
      // Stop/disconnect when clicked during recording
      console.log('🛑 Stopping voice connection...')
      disconnect()
    } else {
      // Resume recording
      setIsRecording(true)
    }
  }

  const handleCameraCapture = async () => {
    try {
      // Use Mac camera via getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      
      // Create video element to capture frame
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      
      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve
      })
      
      // Capture frame to canvas
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop())
      
      // Convert to data URL
      const photoUrl = canvas.toDataURL('image/jpeg', 0.9)
      
      const photo = {
        id: `photo_${Date.now()}`,
        url: photoUrl,
        timestamp: new Date()
      }
      
      setCapturedPhotos(prev => [...prev, photo])
      setSelectedPhoto(photo)
      
      console.log('✅ Photo captured')
      
    } catch (error) {
      console.error('❌ Camera error:', error)
      alert('Failed to access camera. Please allow camera permissions.')
    }
  }

  const analyzePhotoWithClaude = async (photo) => {
    if (!photo) return
    
    setIsAnalyzing(true)
    
    try {
      console.log('🔍 Analyzing photo with Claude...')
      
      // Send photo to Claude API
      const response = await fetch('/api/analyze-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photo.url,
          context: context,
          sessionId: sessionId
        })
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const analysis = await response.json()
      
      // Add analysis to chat
      addMessage('assistant', `**Vitals Analysis:**\n\n${analysis.result}`)
      
      console.log('✅ Analysis complete')
      
    } catch (error) {
      console.error('❌ Analysis error:', error)
      addMessage('assistant', '⚠️ Unable to analyze photo. Mock vitals: HR ~75 bpm, SpO2 ~98%, skin tone normal.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setCapturedPhotos([])
    setSelectedPhoto(null)
  }

  const disconnect = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close()
    }
    setIsAgentConnected(false)
    if (setIsRecording) {
      setIsRecording(false)
    }
  }

  // DON'T disconnect on unmount - connection persists across navigation
  useEffect(() => {
    return () => {
      // Only clean up camera stream, keep agent connection alive
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  return (
    <div className="chat-screen">
      {/* Dynamic Island Controls */}
      {isConnected && (
        <div className="dynamic-island-controls">
          <button
            className={`island-control-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? "Pause" : "Record"}
          >
            {isRecording ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255, 69, 58, 1)">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(10, 132, 255, 1)" strokeWidth="2.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              </svg>
            )}
          </button>
          {isRecording && (
            <span className="island-status-text">Listening...</span>
          )}
          <button
            className="island-control-btn"
            onClick={disconnect}
            title="Stop"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.7)">
              <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
          </button>
        </div>
      )}


      <div className="language-info" onClick={onEnd} title="Change settings">
        <span className="lang-yours">{context.specialty.toUpperCase()}</span>
        {' • '}
        <span className="lang-theirs">{context.patientContext.toUpperCase()}</span>
      </div>

      <button onClick={onEnd} className="back-button" title="End session">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Camera button - top right, always visible */}
      <button 
        onClick={handleCameraCapture} 
        className="camera-button-top" 
        title="Capture photo"
        style={{
          position: 'absolute',
          top: '60px',
          right: messages.length > 0 ? '60px' : '20px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'rgba(142, 142, 147, 0.12)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>

      {messages.length > 0 && (
        <>
          <button onClick={handleClearChat} className="clear-button" title="Clear conversation">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-3 5v6m-4-6v6M5 6h14l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Reset button - next to camera on the right */}
          <button 
            onClick={() => {
              // Reset conversation but stay connected
              setMessages([])
              setCapturedPhotos([])
              setSelectedPhoto(null)
            }} 
            className="reset-button" 
            title="Reset conversation"
            style={{
              position: 'absolute',
              top: '60px',
              right: '98px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(142, 142, 147, 0.12)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              transition: 'background 0.3s ease, color 0.3s ease',
              zIndex: 1000,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>

        </>
      )}

      <div className="chat-header">
        <div className="header-title-wrapper">
          <h2>CareFlow AI</h2>
          {isConnected && (
            <span className="connection-badge-cyan">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {/* Camera Preview - Inline in chat flow */}
        {showCameraPreview && (
          <div className="camera-section">
            <div className="camera-preview-window">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="camera-preview-video"
              />
              {/* Live vitals overlay */}
              {showVitals && (
                <div className="ecg-overlay">
                  <div className="vital-metric">
                    <span className="vital-label">HR</span>
                    <span className="vital-value">{currentVitals.heartRate}</span>
                  </div>
                  <div className="vital-metric">
                    <span className="vital-label">BP</span>
                    <span className="vital-value">{currentVitals.bloodPressure}</span>
                  </div>
                  <div className="vital-metric">
                    <span className="vital-label">SpO₂</span>
                    <span className="vital-value">{currentVitals.spo2}</span>
                  </div>
                  <div className="vital-metric">
                    <span className="vital-label">RR</span>
                    <span className="vital-value">{currentVitals.respiratoryRate}</span>
                  </div>
                </div>
              )}
              {/* Close button - top right */}
              <button onClick={closeCameraPreview} className="camera-close-btn" title="Close camera">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              {/* Capture dot - center bottom */}
              <button onClick={captureFromPreview} className="camera-capture-dot" title="Take photo (or use voice)">
                <div className="dot-inner"></div>
              </button>
            </div>
          </div>
        )}

        {messages.length === 0 && !showCameraPreview && (
          <div className="empty-state">
            <p>Tap the microphone to ask questions</p>
            <p className="empty-hint">Or capture a photo to analyze vitals</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={{
              role: message.role === 'user' ? 'you' : 'them',
              translatedText: message.content.replace('NAVIGATE_TO_SETTINGS', '').trim(),
              originalText: null,
              audioUrl: null
            }}
          />
        ))}

        {/* Photo Gallery */}
        {capturedPhotos.length > 0 && (
          <div className="photo-gallery">
            <div className="photo-count-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>{capturedPhotos.length}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {capturedPhotos.map(photo => (
                <div 
                  key={photo.id}
                  className="photo-thumbnail"
                  style={{
                    border: selectedPhoto?.id === photo.id ? '2px solid rgba(0, 212, 255, 0.6)' : '1px solid rgba(255,255,255,0.15)',
                    boxShadow: selectedPhoto?.id === photo.id ? '0 0 15px rgba(0, 212, 255, 0.4)' : 'none',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={photo.url} 
                    alt="Captured" 
                    onClick={() => setSelectedPhoto(photo)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setCapturedPhotos(prev => prev.filter(p => p.id !== photo.id))
                      if (selectedPhoto?.id === photo.id) setSelectedPhoto(null)
                    }}
                    className="photo-delete-btn"
                    title="Delete photo"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Photo Viewer - OUTSIDE chat-messages for proper z-index */}
      {(() => {
        const shouldShow = selectedPhoto && !showCameraPreview
        if (shouldShow) {
          console.log('🖼️ PHOTO VIEWER: Rendering with photo', selectedPhoto.id)
        }
        return shouldShow
      })() && (
        <div className="photo-viewer-overlay" style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '85%',
            maxWidth: '380px',
            padding: '16px',
            background: 'rgba(28, 28, 30, 0.95)',
            borderRadius: '20px',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 0 50px rgba(255, 255, 255, 0.15), 0 25px 80px rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img src={selectedPhoto.url} alt="Selected" style={{ 
              width: '100%', 
              borderRadius: '14px',
              marginBottom: '12px',
              display: 'block'
            }} />
            <div className="analyze-pill-container" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <button 
                onClick={() => analyzePhotoWithClaude(selectedPhoto)}
                disabled={isAnalyzing}
                style={{
                  padding: '8px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isAnalyzing ? 0.6 : 1
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
              <button 
                onClick={() => setSelectedPhoto(null)}
                title="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls - Only show if not connected */}
      {!isConnected && (
        <div className="voice-recorder">
          <div className="recorder-controls">
            <button
              className="mic-button"
              onClick={toggleRecording}
              title="Start voice assistant"
            >
              <div className="mic-inner">
                <div className="recording-dot"></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NurseChat

