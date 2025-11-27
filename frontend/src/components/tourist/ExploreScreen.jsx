import React, { useState } from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import { getImageForType } from '../../utils/imageLibrary'
import './ExploreScreen.css'

export default function ExploreScreen() {
  const { state, onVoiceIntent } = useTouristApp()
  const { loyalty } = state
  const [activeTab, setActiveTab] = useState('offers')
  const [expandedCard, setExpandedCard] = useState(null)

  const handleAddToItinerary = (place, slot = 'morning', day = 0) => {
    onVoiceIntent('add_to_itinerary', { place, slot, day })
  }

  // CP Group Thailand Offers - Tourist focused
  const cpOffers = [
    {
      id: 1,
      brand: '7-Eleven',
      title: 'Free Coffee',
      description: 'Grab any hot Americano, Latte or Cappuccino free when you spend ฿50+. Over 13,000 stores nationwide!',
      cost: 30,
      type: 'coins',
      color: '#00843D',
      gradient: 'linear-gradient(135deg, #00843D 0%, #005A2B 100%)'
    },
    {
      id: 2,
      brand: '7-Eleven',
      title: 'Snack Bundle',
      description: 'Get a free drink + snack combo. Perfect for your day trips, beach visits & temple tours',
      cost: 0,
      type: 'free',
      color: '#00843D',
      gradient: 'linear-gradient(135deg, #00995C 0%, #006B3F 100%)'
    },
    {
      id: 3,
      brand: 'The Pizza Company',
      title: 'Buy 1 Get 1 Free',
      description: 'Order any large pizza, get another free. Delivery to your hotel or dine-in at 400+ locations',
      cost: 80,
      type: 'coins',
      color: '#D4002A',
      gradient: 'linear-gradient(135deg, #D4002A 0%, #8B001B 100%)'
    },
    {
      id: 4,
      brand: "Swensen's",
      title: '50% Off Sundae',
      description: 'Cool down with half-price sundaes & earthquakes. Perfect treat after exploring Bangkok heat!',
      cost: 40,
      type: 'coins',
      color: '#E91E63',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)'
    },
    {
      id: 5,
      brand: "Chester's Grill",
      title: 'Free Meal Upgrade',
      description: 'Upgrade any combo free - larger drink, more fries & extra chicken. Quick bites between sights',
      cost: 0,
      type: 'free',
      color: '#FF6B00',
      gradient: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)'
    },
    {
      id: 6,
      brand: 'True Mobile',
      title: '1GB Data Bonus',
      description: 'Extra 1GB 5G data for 24 hours. Stay connected for maps, translation & sharing your trip',
      cost: 25,
      type: 'coins',
      color: '#E31937',
      gradient: 'linear-gradient(135deg, #E31937 0%, #B31429 100%)'
    },
    {
      id: 7,
      brand: 'True Money',
      title: '฿50 Cashback',
      description: 'Get ฿50 back on your first True Money payment. Use at street vendors, markets & more',
      cost: 0,
      type: 'free',
      color: '#FF6F00',
      gradient: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)'
    },
    {
      id: 8,
      brand: 'Dairy Queen',
      title: 'Free Blizzard',
      description: 'Free mini Blizzard with any meal. Oreo, Choco Brownie & Thai-exclusive flavors available',
      cost: 45,
      type: 'coins',
      color: '#E31937',
      gradient: 'linear-gradient(135deg, #D4145A 0%, #9B0E3E 100%)'
    },
    {
      id: 9,
      brand: 'True Tourist',
      title: 'Airport Fast Track',
      description: 'Skip immigration queues at Suvarnabhumi & Don Mueang. Exclusive for True SIM holders',
      cost: 100,
      type: 'coins',
      color: '#003D7C',
      gradient: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)'
    }
  ]

  // Places to visit - images auto-assigned by type
  const places = [
    { id: 1, name: 'Grand Palace', location: 'Bangkok', type: 'Temple', rating: '4.8' },
    { id: 2, name: 'Wat Arun', location: 'Bangkok', type: 'Temple', rating: '4.7' },
    { id: 3, name: 'Phi Phi Islands', location: 'Krabi', type: 'Beach', rating: '4.9' },
    { id: 4, name: 'Chatuchak Market', location: 'Bangkok', type: 'Shopping', rating: '4.6' },
    { id: 5, name: 'Doi Suthep', location: 'Chiang Mai', type: 'Temple', rating: '4.7' },
    { id: 6, name: 'Floating Market', location: 'Bangkok', type: 'Market', rating: '4.5' },
    { id: 7, name: 'Thai Massage Spa', location: 'Silom', type: 'Wellness', rating: '4.8' },
    { id: 8, name: 'Elephant Sanctuary', location: 'Chiang Mai', type: 'Wildlife', rating: '4.9' },
  ]

  const handleRedeemOffer = (offer) => {
    if (offer.type === 'free' || loyalty.coins >= offer.cost) {
      onVoiceIntent('redeem_offer', { offer })
    }
  }

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  return (
    <div className="explore-screen">
      {/* Header */}
      <div className="explore-header">
        <button 
          className="back-chevron"
          onClick={() => onVoiceIntent('navigate_home')}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="explore-title">Offers</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button 
          className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          Offers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'places' ? 'active' : ''}`}
          onClick={() => setActiveTab('places')}
        >
          Places
        </button>
      </div>

      {/* Offers Tab - Wallet Style Cards */}
      {activeTab === 'offers' && (
        <div className="offers-tab">
          <div className="wallet-stack">
            {cpOffers.map((offer, index) => (
              <div 
                key={offer.id}
                className={`wallet-card ${expandedCard === offer.id ? 'expanded' : ''} ${offer.cost > loyalty.coins && offer.type !== 'free' ? 'locked' : ''} ${index === cpOffers.length - 1 ? 'top-card' : ''}`}
                style={{ 
                  background: offer.gradient,
                  '--card-index': index,
                  zIndex: expandedCard === offer.id ? 100 : index + 1
                }}
                onClick={() => handleCardClick(offer.id)}
              >
                <div className="card-header">
                  <span className="card-brand">{offer.brand}</span>
                  {offer.type === 'free' ? (
                    <span className="card-badge free">FREE</span>
                  ) : (
                    <span className="card-badge coins">{offer.cost} pts</span>
                  )}
                </div>
                <div className="card-title">{offer.title}</div>
                <div className="card-desc">{offer.description}</div>
                {expandedCard === offer.id && (
                  <button 
                    className="redeem-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRedeemOffer(offer)
                    }}
                  >
                    {offer.type === 'free' ? 'Claim Now' : 'Redeem'}
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="wallet-hint">
            <span>Tap card to expand • {loyalty.coins} TrueCoins available</span>
          </div>
        </div>
      )}

      {/* Places Tab */}
      {activeTab === 'places' && (
        <div className="places-tab">
          <div className="places-grid">
            {places.map((place) => (
              <div key={place.id} className="place-card">
                <div 
                  className="place-image"
                  style={{ backgroundImage: `url(${getImageForType(place.type)})` }}
                >
                  <span className="place-rating">★ {place.rating}</span>
                </div>
                <div className="place-content">
                  <div className="place-name">{place.name}</div>
                  <div className="place-meta">
                    <span className="place-location">{place.location}</span>
                    <span className="place-type">{place.type}</span>
                  </div>
                </div>
                <button 
                  className="add-itinerary-btn"
                  onClick={() => handleAddToItinerary(place)}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
