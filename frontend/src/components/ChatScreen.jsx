import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import MessageBubble from './MessageBubble'
import VoiceRecorder from './VoiceRecorder'
import './ChatScreen.css'

function ChatScreen({ conversationId, languages, onEnd }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const messagesEndRef = useRef(null)
  const audioContextRef = useRef(null)
  const currentAudioSourceRef = useRef(null) // Track currently playing audio
  const { theme, toggleTheme } = useTheme()
  
  // Initialize audio context on first user interaction and unlock audio
  const enableAudio = async () => {
    if (!audioContextRef.current) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        audioContextRef.current = ctx
        
        // Resume context and play silent buffer to unlock audio playback
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        
        // Create and play a silent buffer to fully unlock audio
        const buffer = ctx.createBuffer(1, 1, 22050)
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.connect(ctx.destination)
        source.start(0)
        
        console.log('✅ [ChatScreen] Audio context initialized and unlocked')
        setAudioEnabled(true)
      } catch (err) {
        console.error('❌ [ChatScreen] Failed to create audio context:', err)
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewMessage = async (audioBlob, roleParam) => {
    console.log('📤 [ChatScreen] Processing voice message...')
    
    // Enable audio on first interaction
    enableAudio()

    setIsLoading(true)

    try {
      const base64Audio = await blobToBase64(audioBlob)
      console.log('✅ [ChatScreen] Base64 conversion complete')

      const startTime = Date.now()

      const response = await fetch(`/conversations/${conversationId}/messages/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'auto',  // Let backend auto-detect
          audioBase64: base64Audio,
        }),
      })

      const duration = Date.now() - startTime
      console.log(`⏱️ [ChatScreen] Backend responded in ${duration}ms`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [ChatScreen] Backend error:', response.status, errorText)
        
        // Handle 400 errors gracefully (unsupported language, empty speech, wrong language pair, etc.)
        if (response.status === 400) {
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.message && 
                (errorData.message.includes('Unsupported language') || 
                 errorData.message.includes('No speech detected') ||
                 errorData.message.includes('Please speak in'))) {
              console.warn('⚠️ [ChatScreen] Audio issue (empty, unsupported, or wrong language), ignoring...')
              console.warn(`   ℹ️  ${errorData.message}`)
              // Just silently skip this message - don't throw error or show alert
              return null
            }
          } catch (e) {
            // If parsing fails, fall through to generic error
          }
        }
        
        throw new Error(`Backend error: ${response.status}`)
      }

      const data = await response.json()
      
      // Skip if response was null (unsupported language)
      if (!data) {
        return
      }
      
      console.log('✅ [ChatScreen] Translation successful:', {
        originalText: data.message.originalText,
        translatedText: data.message.translatedText,
        sourceLang: data.message.sourceLang,
        targetLang: data.message.targetLang
      })

      setMessages((prev) => [...prev, data.message])
      
      // Auto-play for THEM speaking (their language → your language)
      // Use audioContextRef instead of audioEnabled state to avoid timing issues
      const audioReady = audioContextRef.current !== null
      console.log(`📊 [ChatScreen] Message received - Role: ${data.message.role}, AudioURL: ${data.message.audioUrl}, Muted: ${isMuted}, AudioReady: ${audioReady}`)
      
      if (data.message.audioUrl && data.message.role === 'them' && !isMuted && audioReady) {
        console.log('🔊 [ChatScreen] Auto-playing: THEM speaking (translated to YOUR language)')
        console.log(`   - Source: ${data.message.sourceLang} → Target: ${data.message.targetLang}`)
        console.log(`   - Audio URL: ${data.message.audioUrl}`)
        
        // Use AudioContext to play - bypasses auto-play restrictions
        setTimeout(async () => {
          try {
            // STOP any currently playing audio before starting new one
            if (currentAudioSourceRef.current) {
              try {
                currentAudioSourceRef.current.stop()
                console.log('⏹️ [ChatScreen] Stopped previous audio')
              } catch (e) {
                // Already stopped or never started - ignore
              }
              currentAudioSourceRef.current = null
            }
            
            const ctx = audioContextRef.current
            
            // Resume audio context if needed
            if (ctx.state === 'suspended') {
              await ctx.resume()
              console.log('🔓 [ChatScreen] Audio context resumed')
            }
            
            // Fetch audio data
            const response = await fetch(data.message.audioUrl)
            const arrayBuffer = await response.arrayBuffer()
            
            // Decode audio data
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            
            // Create source and play through AudioContext
            const source = ctx.createBufferSource()
            source.buffer = audioBuffer
            source.connect(ctx.destination)
            
            // Clean up when audio finishes playing
            source.onended = () => {
              if (currentAudioSourceRef.current === source) {
                currentAudioSourceRef.current = null
                console.log('✅ [ChatScreen] Audio playback completed')
              }
            }
            
            // Store reference to current source
            currentAudioSourceRef.current = source
            source.start(0)
            
            console.log('✅ [ChatScreen] Audio playing successfully via AudioContext!')
          } catch (err) {
            console.error('❌ [ChatScreen] Auto-play failed:', err)
            // Fallback to Audio element
            try {
              const audio = new Audio(data.message.audioUrl)
              audio.volume = 1.0
              await audio.play()
              console.log('✅ [ChatScreen] Audio playing via fallback!')
            } catch (fallbackErr) {
              console.error('❌ [ChatScreen] Fallback also failed:', fallbackErr)
            }
          }
        }, 150)
      } else if (data.message.role === 'them' && isMuted) {
        console.log('🔇 [ChatScreen] Muted - skipping auto-play for THEM')
      } else if (data.message.role === 'them' && !audioReady) {
        console.log('⚠️ [ChatScreen] Audio not enabled yet - waiting for user interaction')
      } else if (data.message.role === 'you') {
        console.log('🔇 [ChatScreen] No auto-play for YOU speaking (THEY will hear the translation)')
      } else {
        console.log(`⚠️ [ChatScreen] No audio or unexpected role: role=${data.message.role}, audioUrl=${data.message.audioUrl}`)
      }
      
    } catch (err) {
      console.error('❌ [ChatScreen] Error processing message:', err)
      alert('Failed to process message: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="chat-screen">
      <div className="language-info" onClick={onEnd} title="Change languages">
        <span className="lang-yours">{languages.yourLanguage.toUpperCase()}</span>
        {' ↔ '}
        <span className="lang-theirs">{languages.theirLanguage.toUpperCase()}</span>
      </div>

      <button onClick={onEnd} className="back-button" title="Change languages">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button 
        onClick={() => setIsMuted(!isMuted)} 
        className={`mute-button ${isMuted ? 'muted' : ''}`} 
        title={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {messages.length > 0 && (
        <button onClick={handleClearChat} className="clear-button" title="Clear conversation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-3 5v6m-4-6v6M5 6h14l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <div className="chat-header">
        <div className="header-title-wrapper">
          <h2>Live Translation</h2>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Tap the button below to begin</p>
            <p className="empty-hint">Speak naturally - translation is automatic</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <VoiceRecorder onRecord={handleNewMessage} isLoading={isLoading} languages={languages} />
    </div>
  )
}

export default ChatScreen
