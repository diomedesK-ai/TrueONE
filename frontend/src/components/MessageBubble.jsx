import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import WalkingDirections, { isWalkingDirections } from './tourist/WalkingDirections'
import './MessageBubble.css'

// Vitals Icon Component - Red gradient circle with heart
const VitalsIcon = () => (
  <span className="vitals-icon-wrapper">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vitalsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FF2D55" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" stroke="url(#vitalsGradient)" strokeWidth="1.5" fill="transparent"/>
      <path d="M12 17.5C12 17.5 6 13.5 6 10C6 8 7.5 6.5 9.5 6.5C10.5 6.5 11.5 7 12 8C12.5 7 13.5 6.5 14.5 6.5C16.5 6.5 18 8 18 10C18 13.5 12 17.5 12 17.5Z" 
            stroke="url(#vitalsGradient)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  </span>
)

function MessageBubble({ message }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = React.useRef(null)

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const isTheirMessage = message.role === 'them'
  const rawText = message.translatedText || ''
  
  // Check if this is walking directions
  const showWalkingDirections = isWalkingDirections(rawText)
  
  // Process message to handle custom tags and auto-highlight percentages
  let processedText = rawText.replace(/<vitals-icon><\/vitals-icon>/g, '') || ''
  const hasVitalsIcon = rawText.includes('<vitals-icon>')
  
  // Extract vitals badge if present
  const vitalsBadgeMatch = processedText.match(/<vitals-badge>(.*?)<\/vitals-badge>/)
  const vitalsBadgeText = vitalsBadgeMatch ? vitalsBadgeMatch[1] : null
  processedText = processedText.replace(/<vitals-badge>.*?<\/vitals-badge>/g, '')
  
  // Auto-wrap percentages in bold markdown for highlighting
  // First remove any existing bold around percentages, then re-wrap consistently
  processedText = processedText.replace(/\*\*(\d+%)\*\*/g, '$1') // Remove existing bold
  processedText = processedText.replace(/(\d+%)/g, '**$1**') // Wrap all percentages
  
  // Auto-highlight vitals readings - detect common patterns and wrap them
  // Heart rate patterns: "81 bpm", "81 beats per minute", "heart rate: 81", "HR: 81"
  processedText = processedText.replace(/(\d{2,3})\s*(bpm|beats?\s*per\s*minute)/gi, '**$1 $2**')
  processedText = processedText.replace(/(heart\s*rate[:\s]+)(\d{2,3})/gi, '$1**$2 bpm**')
  processedText = processedText.replace(/(HR[:\s]+)(\d{2,3})/gi, '$1**$2 bpm**')
  
  // Blood pressure patterns: "124/81", "124 over 81", "BP: 124/81"
  processedText = processedText.replace(/(\d{2,3})\s*(\/|over)\s*(\d{2,3})\s*(mmHg|mm\s*Hg|millimeters?\s*of\s*mercury)?/gi, '**$1/$3 mmHg**')
  processedText = processedText.replace(/(blood\s*pressure[:\s]+)(\d{2,3}\/\d{2,3})/gi, '$1**$2 mmHg**')
  processedText = processedText.replace(/(BP[:\s]+)(\d{2,3}\/\d{2,3})/gi, '$1**$2 mmHg**')
  
  // SpO2/Oxygen patterns: "SpO2: 96%", "oxygen: 96%", "O2: 96%"
  processedText = processedText.replace(/(SpO2|oxygen|O2)[:\s]+(\d{2,3})%?/gi, '$1: **$2%**')
  
  // Respiratory rate patterns: "14 breaths", "RR: 14"
  processedText = processedText.replace(/(\d{1,2})\s*(breaths?\s*per\s*minute|breaths?\/min)/gi, '**$1 breaths/min**')
  processedText = processedText.replace(/(respiratory\s*rate[:\s]+)(\d{1,2})/gi, '$1**$2 breaths/min**')
  processedText = processedText.replace(/(RR[:\s]+)(\d{1,2})/gi, '$1**$2 breaths/min**')
  
  // Temperature patterns
  processedText = processedText.replace(/(temp(erature)?[:\s]+)(\d{2,3}(\.\d)?)\s*(°?[FC]|degrees?)?/gi, '$1**$3°F**')

  // Custom renderer to highlight special content
  const components = {
    strong: ({node, ...props}) => {
      const text = props.children?.[0]
      if (typeof text === 'string') {
        // Check for vitals patterns FIRST (more specific)
        // Heart rate, blood pressure, SpO2, respiratory rate, temperature
        if (text.match(/\d+\s*(bpm|beats|mmHg|breaths|°F|°C)/i)) {
          return <strong className="highlight-vitals" {...props} />
        }
        // Blood pressure format (e.g., "124/81 mmHg")
        if (text.match(/\d{2,3}\/\d{2,3}/)) {
          return <strong className="highlight-vitals" {...props} />
        }
        // SpO2 percentage (but not security percentages which are usually 2 digits)
        if (text.match(/9[0-9]%|100%/)) {
          return <strong className="highlight-vitals" {...props} />
        }
        // Vitals labels
        if (text.match(/BP:|HR:|Temp:|O2:|RR:|HbA1c:|SpO2/i)) {
          return <strong className="highlight-vitals" {...props} />
        }
        // Security percentages (typically lower numbers like 68%, 85%)
        if (text.match(/^[0-8]\d%$/)) {
          return <strong className="highlight-security" {...props} />
        }
        // PII patterns
        if (text.match(/Patient|MRN|ID|DOB|SSN/i)) {
          return <strong className="highlight-pii" {...props} />
        }
      }
      return <strong className="highlight-default" {...props} />
    },
    code: ({node, inline, ...props}) => {
      return inline ? <code className="highlight-code" {...props} /> : <code {...props} />
    }
  }

  // Extract potential destination for walking directions (look for 7-Eleven or other landmarks)
  const destinationMatch = rawText.match(/7-Eleven|seven.?eleven|store|restaurant|station|temple|park|mall|hotel/i)
  const destination = destinationMatch ? destinationMatch[0] : null

  return (
    <div className={`message-bubble ${isTheirMessage ? 'them' : 'you'}`}>
      <div className="bubble-content">
        {message.originalText && (
          <div className="original-text">{message.originalText}</div>
        )}
        <div className="translated-text">
          {vitalsBadgeText && <span className="vitals-badge-red">{vitalsBadgeText}</span>}
          
          {/* Show visual walking directions if detected */}
          {showWalkingDirections && isTheirMessage ? (
            <WalkingDirections 
              text={rawText} 
              destination={destination}
            />
          ) : (
            <ReactMarkdown components={components}>
              {processedText}
            </ReactMarkdown>
          )}
        </div>
        <div className="message-footer">
          {message.audioUrl && (
            <>
              <button
                onClick={handlePlayAudio}
                className="play-button"
                title="Play translation"
              >
                <span className="play-icon">{isPlaying ? '⏸' : '▶'}</span>
              </button>
              <audio
                ref={audioRef}
                src={message.audioUrl}
                onEnded={handleAudioEnded}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
