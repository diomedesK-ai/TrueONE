import React, { useState } from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import HomeScreen from './HomeScreen'
import LoyaltyHub from './LoyaltyHub'
import ExploreScreen from './ExploreScreen'
import ItineraryScreen from './ItineraryScreen'
import SmartOffers from './SmartOffers'
import TranslateScreen from './TranslateScreen'
import TouristChat from './TouristChat'
import './TouristApp.css'

export default function TouristApp({ 
  isDarkMode, 
  onToggleTheme,
  peerConnectionRef,
  dataChannelRef,
  audioElementRef,
  isAgentConnected,
  setIsAgentConnected,
  isRecording,
  setIsRecording
}) {
  const { state, onVoiceIntent } = useTouristApp()
  const { currentScreen } = state
  
  // Activation flow states
  const [activationStep, setActivationStep] = useState('welcome') // 'welcome', 'scanning', 'assigning', 'ready', 'done'
  const [showFaceID, setShowFaceID] = useState(false)
  const [faceIDSuccess, setFaceIDSuccess] = useState(false)
  const [assignedNumber, setAssignedNumber] = useState('')
  const [assignedPlan, setAssignedPlan] = useState('')
  const [bonusCoins, setBonusCoins] = useState(0)

  const handleActivate = () => {
    setActivationStep('scanning')
    setShowFaceID(true)

    // Step 1: Face ID scanning (1.8s)
    setTimeout(() => {
      setFaceIDSuccess(true)
      
      // Step 2: Start assigning number (1.5s after success)
      setTimeout(() => {
        setActivationStep('assigning')
        
        // Animate number assignment
        let numberProgress = 0
        const numberInterval = setInterval(() => {
          numberProgress++
          if (numberProgress <= 10) {
            // Show random digits while "finding" number
            setAssignedNumber(`+66 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`)
          } else {
            // Final number
            setAssignedNumber('+66 98 765 4321')
            clearInterval(numberInterval)
            
            // Show plan
            setTimeout(() => {
              setAssignedPlan('Tourist 7-Day Unlimited')
              
              // Show bonus coins
              setTimeout(() => {
                setBonusCoins(150)
                setActivationStep('ready')
              }, 600)
            }, 500)
          }
        }, 100)
      }, 1200)
    }, 1800)
  }

  const handleContinue = () => {
    setActivationStep('done')
  }

  const toggleRecording = () => {
    setIsRecording(prev => !prev)
  }

  const disconnect = () => {
    if (peerConnectionRef?.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (dataChannelRef?.current) {
      dataChannelRef.current.close()
      dataChannelRef.current = null
    }
    setIsAgentConnected(false)
    setIsRecording(false)
  }

  // Show main app after activation
  if (activationStep === 'done') {
    const renderScreen = () => {
      switch (currentScreen) {
        case 'home':
          return <HomeScreen onOpenChat={() => onVoiceIntent('navigate_chat')} />
        case 'loyalty':
          return <LoyaltyHub />
        case 'explore':
          return <ExploreScreen />
        case 'itinerary':
          return <ItineraryScreen />
        case 'offers':
          return <SmartOffers />
        case 'translate':
          return <TranslateScreen />
        case 'chat':
          return (
            <TouristChat
              onEnd={() => onVoiceIntent('navigate_home')}
              peerConnectionRef={peerConnectionRef}
              dataChannelRef={dataChannelRef}
              audioElementRef={audioElementRef}
              isAgentConnected={isAgentConnected}
              setIsAgentConnected={setIsAgentConnected}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          )
        default:
          return <HomeScreen onOpenChat={() => onVoiceIntent('navigate_chat')} />
      }
    }

    return (
      <div className="tourist-app-main">
        {/* Dynamic Island Controls - Persistent across screens */}
        {isAgentConnected && currentScreen !== 'chat' && (
          <div className="dynamic-island-controls">
            <button
              className={`island-control-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              title={isRecording ? "Pause" : "Resume"}
            >
              {isRecording ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255, 69, 58, 1)">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 153, 255, 1)" strokeWidth="2.5">
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

        <div className="screen-content">
          {renderScreen()}
        </div>
      </div>
    )
  }

  // Activation flow
  return (
    <div className="tourist-landing">
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

      <div className="setup-card">
        <div className="setup-header-left">
          <div className="title-wrapper">
            <h1 className="setup-title">True</h1>
            <div className="title-row-two">
              <span className="title-one">ONE</span>
              <span className="super-app-pill">SUPER APP</span>
            </div>
          </div>
          
          <p className="setup-subtitle">
            {activationStep === 'welcome' && (
              <>Your <span className="service-glow">5G</span>, <span className="service-glow">Maps</span>, <span className="service-glow">Rewards</span> & <span className="service-glow">Offers</span> in one app.</>
            )}
            {activationStep === 'scanning' && (
              <span className="highlight-text">Verifying identity...</span>
            )}
            {activationStep === 'assigning' && (
              <span className="highlight-text">Setting up your account...</span>
            )}
            {activationStep === 'ready' && (
              <>Welcome to Thailand! <span className="highlight-text">You're connected.</span></>
            )}
          </p>
          
          {/* Khun AI Sphere */}
          {activationStep === 'welcome' && (
            <div className="khun-sphere-container">
              <div className="khun-sphere"></div>
              <p className="khun-intro">Hey, I'm <span className="khun-name">Khun</span></p>
              <p className="khun-tagline">Your Thailand Companion</p>
            </div>
          )}
        </div>

        <div className="setup-form">
          {/* Welcome State */}
          {activationStep === 'welcome' && (
            <>
              <div className="activation-prompt">
                <div className="prompt-line">Connect with True Mobile</div>
                <div className="prompt-line-sub">Instant eSIM activation</div>
              </div>

              <button
                onClick={handleActivate}
                className="start-button"
              >
                Get Connected
              </button>
            </>
          )}

          {/* Scanning State */}
          {activationStep === 'scanning' && (
            <div className="activation-progress">
              <div className="progress-item active">
                <div className="progress-dot scanning"></div>
                <span>Verifying identity</span>
              </div>
              <div className="progress-item">
                <div className="progress-dot"></div>
                <span>Assigning number</span>
              </div>
              <div className="progress-item">
                <div className="progress-dot"></div>
                <span>Activating plan</span>
              </div>
            </div>
          )}

          {/* Assigning State */}
          {activationStep === 'assigning' && (
            <div className="activation-progress">
              <div className="progress-item complete">
                <div className="progress-dot complete"></div>
                <span>Identity verified</span>
              </div>
              <div className="progress-item active">
                <div className="progress-dot scanning"></div>
                <span>Assigning number</span>
              </div>
              <div className="progress-item">
                <div className="progress-dot"></div>
                <span>Activating plan</span>
              </div>
              
              {assignedNumber && (
                <div className="assigned-info">
                  <span className="assigned-label">Your Number</span>
                  <span className="assigned-value number">{assignedNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Ready State */}
          {activationStep === 'ready' && (
            <>
              <div className="activation-complete">
                <div className="complete-row">
                  <span className="complete-label">Phone Number</span>
                  <span className="complete-value">{assignedNumber}</span>
                </div>
                <div className="complete-row">
                  <span className="complete-label">Plan</span>
                  <span className="complete-value-cyan">{assignedPlan}</span>
                </div>
                <div className="complete-row">
                  <span className="complete-label">Welcome Bonus</span>
                  <span className="complete-value-gold">+{bonusCoins} TrueCoins</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="start-button"
              >
                Start Exploring
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
