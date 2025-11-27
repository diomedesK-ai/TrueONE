import React from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import './LoyaltyHub.css'

export default function LoyaltyHub() {
  const { state, onVoiceIntent } = useTouristApp()
  const { loyalty } = state

  const offers = [
    { id: 1, title: 'Free Coffee', desc: 'At True Coffee locations', cost: 50 },
    { id: 2, title: '฿20 off 7-Eleven', desc: 'Orders over ฿100', cost: 30 },
    { id: 3, title: '1GB Data Boost', desc: 'Valid for 24 hours', cost: 100 },
  ]

  const handleRedeem = (offer) => {
    if (loyalty.balance >= offer.cost) {
      onVoiceIntent('redeem_coins', { amount: offer.cost, reward: offer.title })
    }
  }

  return (
    <div className="loyalty-hub">
      {/* Header */}
      <div className="loyalty-header">
        <button 
          className="back-chevron"
          onClick={() => onVoiceIntent('navigate_home')}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="loyalty-title">TrueCoins</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Card - Apple Pay Style */}
      <div className="coin-card">
        <div className="card-glow"></div>
        <div className="card-glow-accent"></div>
        <div className="card-content">
          <div className="card-top">
            <span className="card-label">TrueCoins</span>
            <span className="card-network">true</span>
          </div>
          <div className="card-balance">
            <span className="balance-value">{loyalty.balance}</span>
            <span className="balance-label">points</span>
          </div>
          <div className="card-bottom">
            <span className="card-holder">Sarah Mitchell</span>
            <span className="card-type">Tourist Rewards</span>
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="offers-section">
        <div className="section-header">
          <span className="section-title">Redeem</span>
          <button className="learn-more">Learn more →</button>
        </div>
        
        <div className="offers-list">
          {offers.map((offer) => (
            <button 
              key={offer.id}
              className={`offer-item ${loyalty.balance < offer.cost ? 'locked' : ''}`}
              onClick={() => handleRedeem(offer)}
              disabled={loyalty.balance < offer.cost}
            >
              <div className="offer-info">
                <span className="offer-title">{offer.title}</span>
                <span className="offer-desc">{offer.desc}</span>
              </div>
              <div className="offer-cost">
                <span className="cost-value">{offer.cost}</span>
                <span className="cost-label">pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="info-section">
        <span className="info-text">Earn 1 point per ฿100 at partner stores</span>
        <button className="info-link">View partners →</button>
      </div>
    </div>
  )
}
