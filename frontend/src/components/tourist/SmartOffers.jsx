import React from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import './SmartOffers.css'

export default function SmartOffers() {
  const { state, onVoiceIntent } = useTouristApp()
  const { offers, itinerary, loyalty } = state

  const getContextualOffers = () => {
    const contextOffers = [...offers]
    
    if (contextOffers.length === 0) {
      const hasBeach = itinerary.days.some(day => 
        day && Object.values(day).some(place => 
          place?.name?.toLowerCase().includes('beach') || 
          place?.name?.toLowerCase().includes('island')
        )
      )
      
      if (hasBeach) {
        contextOffers.push({
          id: 'beach-data',
          title: 'Beach Day Boost',
          description: '5GB high-speed data',
          value: '฿99',
        })
      }
      
      if (loyalty.balance >= 50) {
        contextOffers.push({
          id: 'coffee-redeem',
          title: 'Free Coffee',
          description: 'At any True Coffee',
          coins: 50,
        })
      }
      
      contextOffers.push({
        id: 'topup-bonus',
        title: 'Top-up Bonus',
        description: '฿500 → Get ฿100 free',
        value: '+฿100',
      })
      
      contextOffers.push({
        id: '711-discount',
        title: '10% at 7-Eleven',
        description: 'Orders over ฿200',
        value: '10% off',
      })
    }
    
    return contextOffers
  }

  const displayOffers = getContextualOffers()

  const handleAccept = (offer) => {
    if (offer.coins) {
      onVoiceIntent('redeem_coins', { amount: offer.coins, reward: offer.title })
    }
    onVoiceIntent('accept_offer', { offerId: offer.id })
  }

  return (
    <div className="smart-offers">
      {/* Header */}
      <div className="offers-header">
        <button 
          className="back-chevron"
          onClick={() => onVoiceIntent('navigate_home')}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="offers-title">Offers</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Offers */}
      <div className="offers-list">
        {displayOffers.map((offer) => (
          <button 
            key={offer.id} 
            className="offer-row"
            onClick={() => handleAccept(offer)}
          >
            <div className="offer-info">
              <span className="offer-name">{offer.title}</span>
              <span className="offer-desc">{offer.description}</span>
            </div>
            <span className="offer-value">
              {offer.value || `${offer.coins} coins`}
            </span>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="offers-footer">
        <span className="footer-text">Personalized based on your activity</span>
      </div>
    </div>
  )
}
