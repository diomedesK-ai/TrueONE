import React from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import './BottomNav.css'

export default function BottomNav() {
  const { state, onVoiceIntent } = useTouristApp()
  const { currentScreen } = state

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'loyalty', label: 'TrueCoin' },
    { id: 'explore', label: 'Explore' },
    { id: 'itinerary', label: 'Itinerary' },
  ]

  const handleNav = (id) => {
    onVoiceIntent(`navigate_${id}`)
  }

  return (
    <nav className="bottom-nav">
      <div className="nav-inner">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
