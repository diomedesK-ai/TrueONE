import React, { useState, useRef, useEffect } from 'react'
import './VoiceRecorder.css'

function VoiceRecorder({ onRecord, isLoading, languages }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const silenceTimerRef = useRef(null)
  const recordingRef = useRef(false)
  const recordingStartTimeRef = useRef(null)

  // VAD parameters - OPTIMIZED for capturing complete speech without cutting off
  const SPEECH_THRESHOLD = 0.03  // 3% threshold (balanced sensitivity)
  const SILENCE_DURATION = 800  // 0.8 seconds of silence (faster cutoff for snappier response)
  const MIN_RECORDING_TIME = 300  // 0.3 seconds minimum

  useEffect(() => {
    // Cleanup only on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startListening = async () => {
    if (isListening) {
      return
    }
    
    try {
      console.log('🎤 [VoiceRecorder] Starting listening mode')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      console.log('✅ [VoiceRecorder] Microphone ready')
      streamRef.current = stream
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.8
      microphone.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      
      setIsListening(true)
      monitorAudioLevel()
      
    } catch (err) {
      console.error('❌ [VoiceRecorder] FAILED to start listening:', err)
      alert('Microphone permission denied. Please allow microphone access.')
    }
  }

  const stopListening = () => {
    if (!isListening && !streamRef.current) {
      return
    }
    
    console.log('🛑 [VoiceRecorder] Stopping listening')
    
    setIsListening(false)
    setIsSpeaking(false)
    
    if (recordingRef.current && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const monitorAudioLevel = () => {
    if (!analyserRef.current) {
      return
    }

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    let sampleCount = 0
    
    const checkLevel = () => {
      if (!analyserRef.current || !streamRef.current) {
        return
      }
      
      analyser.getByteFrequencyData(dataArray)
      
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const average = sum / bufferLength / 255
      
      setAudioLevel(average)
      
      if (average > SPEECH_THRESHOLD) {
        if (!recordingRef.current) {
          console.log('🗣️ [VoiceRecorder] SPEECH DETECTED - Recording started')
          startRecording()
        }
        
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        
        setIsSpeaking(true)
        
        silenceTimerRef.current = setTimeout(() => {
          if (recordingRef.current) {
            console.log('⏹️ [VoiceRecorder] Silence detected - Recording stopped')
            stopRecording()
          }
        }, SILENCE_DURATION)
        
      } else {
        if (!recordingRef.current) {
          setIsSpeaking(false)
        }
      }
      
      requestAnimationFrame(checkLevel)
    }
    
    checkLevel()
  }

  const startRecording = () => {
    if (!streamRef.current || recordingRef.current) return
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      recordingRef.current = true
      recordingStartTimeRef.current = Date.now()
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        recordingRef.current = false
        setIsSpeaking(false)
        
        if (chunksRef.current.length === 0) {
          console.log('⚠️ [VoiceRecorder] No audio captured')
          return
        }
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        
        if (audioBlob.size > 1000) {
          console.log('✅ [VoiceRecorder] Sending audio to backend')
          onRecord(audioBlob, 'auto')
        } else {
          console.log('⚠️ [VoiceRecorder] Audio too short, skipping')
        }
      }
      
      mediaRecorder.start()
      
    } catch (err) {
      console.error('❌ [VoiceRecorder] Failed to start recording:', err)
      recordingRef.current = false
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingRef.current) {
      mediaRecorderRef.current.stop()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        <button
          className={`mic-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={toggleListening}
          disabled={isLoading}
        >
          <div className="mic-inner">
            <div className={`recording-dot ${isSpeaking ? 'active' : ''}`}></div>
          </div>
        </button>
      </div>

      <div className="listening-hint" style={{ visibility: isListening && !isLoading ? 'visible' : 'hidden' }}>
        <p className="listening-status">{isSpeaking ? 'Recording...' : 'Listening...'}</p>
      </div>
      
      {/* Processing indicator removed for cleaner UI */}
    </div>
  )
}

export default VoiceRecorder
