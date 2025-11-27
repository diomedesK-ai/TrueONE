import React from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import './HomeScreen.css'

export default function HomeScreen({ onOpenChat }) {
  const { state, onVoiceIntent } = useTouristApp()
  const { user, loyalty, assistantMessage, currentScreen } = state

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'loyalty', label: 'TrueCoins' },
    { id: 'explore', label: 'Offers' },
    { id: 'itinerary', label: 'Itinerary' },
  ]

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-header">
        <span className="greeting">Welcome to Thailand</span>
        <h1 className="home-title">Tourist ONE</h1>
        
        {/* Nav Tabs */}
        <div className="nav-tabs">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${currentScreen === item.id ? 'active' : ''}`}
              onClick={() => onVoiceIntent(`navigate_${item.id}`)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Card */}
      <div className="plan-card">
        <div className="plan-status">
          <span className="status-dot"></span>
          <span className="status-text">Connected</span>
        </div>
        <div className="plan-number">{user.phoneNumber}</div>
        <div className="plan-name">{user.planName}</div>
        
        <div className="plan-stats">
          <div className="stat">
            <span className="stat-value">{user.dataRemaining}</span>
            <span className="stat-label">remaining</span>
          </div>
          <div className="stat-separator"></div>
          <div className="stat">
            <span className="stat-value">{user.daysLeft} days</span>
            <span className="stat-label">until renewal</span>
          </div>
          <div className="stat-separator"></div>
          <div 
            className="stat coin-stat"
            onClick={() => onVoiceIntent('navigate_loyalty')}
          >
            <span className="stat-value coin-value">{loyalty.balance}</span>
            <span className="stat-label">trueCoins</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="feature-cards">
        <button 
          className="feature-card"
          onClick={() => onVoiceIntent('navigate_explore')}
        >
          <div className="feature-image">
            <img src="/ExploreT.png" alt="Places" />
          </div>
          <div className="feature-content">
            <span className="feature-title">Places</span>
            <span className="feature-desc">Discover Thailand</span>
          </div>
        </button>
        
        <button 
          className="feature-card"
          onClick={() => onVoiceIntent('navigate_itinerary')}
        >
          <div className="feature-image">
            <img src="/itinerary2.png" alt="Plan Itinerary" />
          </div>
          <div className="feature-content">
            <span className="feature-title">Itinerary</span>
            <span className="feature-desc">Plan your trip</span>
          </div>
        </button>
        
        <button 
          className="feature-card"
          onClick={() => onVoiceIntent('navigate_stores')}
        >
          <div className="feature-image">
            <img src="/711.png" alt="Stores & Offers" />
          </div>
          <div className="feature-content">
            <span className="feature-title">Stores & Offers</span>
            <span className="feature-desc">Deals & locations</span>
          </div>
        </button>

        <button 
          className="feature-card"
          onClick={() => onVoiceIntent('navigate_translate')}
        >
          <div className="feature-image">
            <img src="/translate.png" alt="Live Translation" />
          </div>
          <div className="feature-content">
            <span className="feature-title">Translate</span>
            <span className="feature-desc">Live conversation</span>
          </div>
        </button>
      </div>

      {/* Assistant Message */}
      {assistantMessage && (
        <div className="assistant-card">
          <p>{assistantMessage}</p>
          <button onClick={() => onVoiceIntent('clear_message')}>Dismiss</button>
        </div>
      )}

      {/* Voice Button */}
      <div className="voice-section">
        <button className="voice-button" onClick={() => onVoiceIntent('navigate_chat')}>
          <div className="voice-ring"></div>
        </button>
      </div>
    </div>
  )
}
