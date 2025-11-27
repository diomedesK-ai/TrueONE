import React, { useState } from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import './TranslateScreen.css'

export default function TranslateScreen() {
  const { onVoiceIntent } = useTouristApp()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'theirs',
      original: 'สวัสดีครับ ยินดีต้อนรับ',
      translated: 'Hello, welcome!',
    },
    {
      id: 2,
      type: 'yours',
      original: 'Hi! Where is the nearest temple?',
      translated: 'สวัสดี! วัดที่ใกล้ที่สุดอยู่ที่ไหน?',
    },
    {
      id: 3,
      type: 'theirs',
      original: 'วัดพระแก้วอยู่ใกล้ที่นี่ เดินไปประมาณ 10 นาที',
      translated: 'Wat Phra Kaew is nearby. About 10 minutes walk.',
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [activeMode, setActiveMode] = useState(null)
  const [yourLanguage, setYourLanguage] = useState('English')
  
  const languages = ['English', 'French', 'Chinese', 'Spanish', 'German', 'Japanese', 'Korean', 'Arabic']

  const handleStartListening = (mode) => {
    setActiveMode(mode)
    setIsListening(true)
    
    setTimeout(() => {
      const newMessage = mode === 'yours' 
        ? {
            id: messages.length + 1,
            type: 'yours',
            original: 'How much does it cost to enter?',
            translated: 'ค่าเข้าชมเท่าไหร่?',
          }
        : {
            id: messages.length + 1,
            type: 'theirs',
            original: 'ค่าเข้าชม 500 บาท สำหรับชาวต่างชาติ',
            translated: '500 Baht for foreigners.',
          }
      
      setMessages(prev => [...prev, newMessage])
      setIsListening(false)
      setActiveMode(null)
    }, 2000)
  }

  const handleClear = () => {
    setMessages([])
  }

  return (
    <div className="translate-screen">
      {/* Language indicator inside dynamic island */}
      <div className="island-lang-indicator">
        <span className="lang-en">EN</span>
        <span className="lang-sep">↔</span>
        <span className="lang-th">TH</span>
      </div>

      {/* Header */}
      <div className="translate-header">
        <button 
          className="back-chevron"
          onClick={() => onVoiceIntent('navigate_home')}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="header-center"></div>
        
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg ${msg.type}`}>
            <div className="msg-bubble">
              <span className="msg-original">{msg.original}</span>
              <span className="msg-translated">{msg.translated}</span>
              <button className="play-btn">▶</button>
            </div>
          </div>
        ))}
        
        {isListening && (
          <div className={`msg ${activeMode}`}>
            <div className="msg-bubble listening">
              <span className="listening-dots">
                <span></span><span></span><span></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="input-col">
          <span className="input-label">Their Language</span>
          <button 
            className={`speak-pill thai ${activeMode === 'theirs' ? 'active' : ''}`}
            onClick={() => handleStartListening('theirs')}
            disabled={isListening}
          >
            Thai
          </button>
        </div>
        
        <div className="input-col">
          <span className="input-label">Your Language</span>
          <button 
            className={`speak-pill your-lang ${activeMode === 'yours' ? 'active' : ''}`}
            onClick={() => handleStartListening('yours')}
            disabled={isListening}
          >
            <select 
              value={yourLanguage} 
              onChange={(e) => {
                e.stopPropagation()
                setYourLanguage(e.target.value)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </button>
        </div>
      </div>
    </div>
  )
}
