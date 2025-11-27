import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './SetupScreen.css'

const TRAVEL_PURPOSES = [
  { code: 'tourist', name: 'Tourist Adventure' },
  { code: 'business', name: 'Business Travel' },
  { code: 'transit', name: 'Transit / Layover' },
  { code: 'expat', name: 'Long-term Stay' },
]

const INTERESTS = [
  { code: 'explore', name: 'Explore Everything' },
  { code: 'shopping', name: 'Shopping & Retail' },
  { code: 'transport', name: 'Getting Around' },
  { code: 'dining', name: 'Food & Dining' },
]

function SetupScreen({ onStart }) {
  const [travelPurpose, setTravelPurpose] = useState('tourist')
  const [interest, setInterest] = useState('explore')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFaceID, setShowFaceID] = useState(false)
  const [faceIDSuccess, setFaceIDSuccess] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleStart = async () => {
    // Scroll to top like iPhone
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Show Face ID authentication
    setShowFaceID(true)
    setIsLoading(true)
    setError(null)

    // Simulate Face ID scanning (1.8 seconds)
    setTimeout(() => {
      setFaceIDSuccess(true)
      
      // Show success for 1.8 seconds (longer), then navigate
      setTimeout(() => {
        try {
          const sessionId = `session_${Date.now()}`
          onStart(sessionId, { travelPurpose, interest })
        } catch (err) {
          setError(err.message)
          setShowFaceID(false)
          setFaceIDSuccess(false)
        } finally {
          setIsLoading(false)
        }
      }, 1800)
    }, 1800)
  }

  return (
    <div className="setup-screen">
      {/* Face ID in Dynamic Island */}
      <div className={`setup-dynamic-island ${showFaceID ? 'expanded' : ''} ${faceIDSuccess ? 'success' : ''}`}>
        {showFaceID && (
          <>
            {!faceIDSuccess ? (
              <div className="island-faceid-content">
                <img src="/lock_1.png" alt="Lock" className="island-lock-icon-img" />
                <img src="/Face_ID_logo.svg.png" alt="Face ID" className="island-faceid-icon" />
              </div>
            ) : (
              <div className="island-success-content">
                <img src="/lock_1.png" alt="Lock" className="island-lock-icon-img" />
                <div className="island-checkmark">✓</div>
              </div>
            )}
          </>
        )}
      </div>

      <button onClick={() => window.location.hash = 'settings'} className="settings-button-setup" title="Settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      
      <div className="setup-card">
        <div className="setup-header-left">
          <div className="apple-intelligence-badge">
            <img src="/appleai.png" alt="Apple Intelligence" className="apple-ai-icon" />
            <span className="ai-text">Apple Intelligence</span>
          </div>
          
          <div className="title-wrapper">
            <h1 className="setup-title">TrueOne</h1>
            <span className="beta-badge">BETA</span>
          </div>
          
          <p className="setup-subtitle">
            Your AI travel companion. <span className="hipaa-highlight">5G eSIM. Transit. Retail. All in one.</span>
          </p>
          
          <div className="trueone-logo-section">
            <div className="trueone-logo">
              <span className="logo-true">true</span>
              <span className="logo-one">ONE</span>
            </div>
            <span className="logo-tagline">Discover the True Thailand</span>
          </div>
        </div>

        <div className="setup-form">
          <div className="form-group">
            <label>Travel Purpose</label>
            <select
              value={travelPurpose}
              onChange={(e) => setTravelPurpose(e.target.value)}
              className="select-input select-input-their"
            >
              {TRAVEL_PURPOSES.map((purpose) => (
                <option key={purpose.code} value={purpose.code}>
                  {purpose.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Primary Interest</label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="select-input select-input-your"
            >
              {INTERESTS.map((int) => (
                <option key={int.code} value={int.code}>
                  {int.name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="start-button"
          >
            {isLoading ? 'Connecting...' : 'Start Exploring'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen
