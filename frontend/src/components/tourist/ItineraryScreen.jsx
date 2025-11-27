import React, { useState } from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import { getImageForType } from '../../utils/imageLibrary'
import './ItineraryScreen.css'

/**
 * ITINERARY SCREEN - DYNAMIC ASSET LIBRARY
 * 
 * This component dynamically builds tourist itineraries using:
 * 1. IMAGE LIBRARY (90+ categories): Temple, Beach, Restaurant, Market, Hotel, Airport, etc.
 * 2. TRANSPORT BADGE LIBRARY (styled like "SUPER APP" pill):
 *    - BTS (Bangkok Sky Train)
 *    - MRT (Metro)
 *    - Airport Rail (ARL)
 *    - Boat / Ferry (Chao Phraya, etc.)
 *    - Taxi / Grab
 *    - Walk
 *    - Bus / Van
 *    - Plane (domestic flights)
 *    - Train (intercity)
 * 
 * AI INTEGRATION:
 * When building dynamic itineraries, the AI should:
 * - Use activity type to auto-select appropriate image (e.g., "Temple" → temple photo)
 * - Specify transport type for each step (e.g., "BTS", "Airport Rail", "Walk")
 * - Provide pricing, duration, and line info from web search
 * - All transport badges render uniformly with the same elegant pill style
 * 
 * The system will automatically:
 * - Match activity types to images (case-insensitive partial match)
 * - Apply consistent badge styling to all transport types
 * - Format pricing and durations
 */

export default function ItineraryScreen() {
  const { state, onVoiceIntent } = useTouristApp()
  const { itinerary } = state
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedDays, setSelectedDays] = useState(3)
  const [destination, setDestination] = useState('Bangkok')

  const destinations = ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi']
  const dayOptions = [3, 5, 7]
  
  // Check if we're in building mode
  const isBuilding = itinerary.isBuilding
  const buildingSteps = itinerary.buildingSteps || []

  // Sample itinerary data for demo with transport info
  // Images are auto-assigned based on activity type using the smart image library
  const sampleItinerary = {
    title: 'Bangkok Discovery',
    subtitle: '3 Days Trip',
    description: 'Experience the vibrant culture, ancient temples, and amazing street food of Thailand\'s capital.',
    days: 3,
    travelers: 2,
    avgCost: '฿15,000',
    activities: {
      1: [
        { id: 1, time: '9:00 AM', title: 'Suvarnabhumi Airport (Arrival)', location: 'Bangkok Airport', price: 'Included', action: 'View Flight', type: 'Airport', transport: { type: 'Airport Rail', line: 'ARL', duration: '30 min to city', fare: '฿45' } },
        { id: 2, time: '11:30 AM', title: 'Hotel Check-in', location: 'Sukhumvit, Bangkok', price: '฿2,500/night', action: 'View Booking', type: 'Hotel', transport: { type: 'BTS', line: 'Sukhumvit Line', duration: '5 min walk', fare: '฿0' }, bookable: true },
        { id: 3, time: '1:00 PM', title: 'Lunch at Thip Samai', location: 'Phra Nakhon, Bangkok', price: '~฿200/person', action: 'Get Directions', type: 'Food', transport: { type: 'Taxi/Grab', line: '', duration: '20 min', fare: '฿100-150' } },
        { id: 4, time: '3:00 PM', title: 'Grand Palace & Wat Phra Kaew', location: 'Na Phra Lan Road', price: '฿500/ticket', action: 'Book Ticket', type: 'Temple', transport: { type: 'Chao Phraya Boat', line: 'Express Boat', duration: '15 min', fare: '฿20' }, bookable: true },
      ],
      2: [
        { id: 1, time: '8:00 AM', title: 'Wat Arun (Temple of Dawn)', location: 'Bangkok Yai', price: '฿100/ticket', action: 'Book Ticket', type: 'Temple', transport: { type: 'Ferry', line: 'Cross-river', duration: '5 min', fare: '฿5' }, bookable: true },
        { id: 2, time: '11:00 AM', title: 'Chatuchak Weekend Market', location: 'Chatuchak', price: 'Free entry', action: 'Get Directions', type: 'Market', transport: { type: 'BTS + MRT', line: 'Mo Chit / Chatuchak Park', duration: '25 min', fare: '฿44' } },
        { id: 3, time: '2:00 PM', title: 'Thai Massage Experience', location: 'Silom', price: '฿800/hour', action: 'Reserve', type: 'Massage', transport: { type: 'BTS', line: 'Silom Line', duration: '20 min', fare: '฿37' }, bookable: true },
        { id: 4, time: '7:00 PM', title: 'Rooftop Dinner', location: 'Sathorn', price: '~฿1,500/person', action: 'Reserve Table', type: 'Restaurant', transport: { type: 'BTS', line: 'Silom Line', duration: '10 min', fare: '฿25' }, bookable: true },
      ],
      3: [
        { id: 1, time: '9:00 AM', title: 'Floating Market Tour', location: 'Damnoen Saduak', price: '฿1,200/tour', action: 'Book Tour', type: 'Floating Market', transport: { type: 'Tour Van', line: 'Hotel pickup', duration: '1.5 hr', fare: 'Included' }, bookable: true },
        { id: 2, time: '2:00 PM', title: 'Jim Thompson House', location: 'Pathum Wan', price: '฿200/ticket', action: 'Book Ticket', type: 'Museum', transport: { type: 'BTS', line: 'National Stadium', duration: '30 min', fare: '฿32' }, bookable: true },
        { id: 3, time: '5:00 PM', title: 'Airport Transfer', location: 'Suvarnabhumi Airport', price: '฿400', action: 'Book Transfer', type: 'Transfer', transport: { type: 'Airport Rail', line: 'ARL Makkasan', duration: '30 min', fare: '฿45' }, bookable: true },
      ],
    }
  }
  
  // Convert built itinerary steps to display format
  const getBuiltActivities = () => {
    if (!buildingSteps.length) return null
    
    const activitiesByDay = {}
    buildingSteps.forEach((step, idx) => {
      const dayNum = (step.day || 0) + 1
      if (!activitiesByDay[dayNum]) activitiesByDay[dayNum] = []
      
      const timeSlots = { morning: '9:00 AM', afternoon: '2:00 PM', evening: '7:00 PM' }
      activitiesByDay[dayNum].push({
        id: idx + 1,
        time: timeSlots[step.slot] || '12:00 PM',
        title: step.activity?.name || 'Activity',
        location: step.activity?.type || 'Bangkok',
        price: step.activity?.price || 'TBD',
        action: 'Book Now',
        image: getImageForType(step.activity?.type),
        transport: getTransportForType(step.activity?.type),
        bookable: true,
        description: step.activity?.description,
        duration: step.activity?.duration
      })
    })
    return activitiesByDay
  }
  
  // Image mapping is now handled by the centralized imageLibrary utility
  // See: src/utils/imageLibrary.js for the full category mapping
  
  // Transport suggestions based on activity type - AI can also provide specific transport
  // TRANSPORT BADGE LIBRARY - All badges styled uniformly like "SUPER APP" pill
  // Available transport types for dynamic itinerary: BTS, MRT, Airport Rail, Boat, Ferry, Taxi, Grab, Walk, Bus, Van, Plane, Train
  const getTransportForType = (type) => {
    const transports = {
      // Religious & Cultural
      'Temple': { type: 'BTS + Boat', line: 'Chao Phraya Express', duration: '20-30 min', fare: '฿25-45' },
      'Wat': { type: 'Boat', line: 'Chao Phraya Express', duration: '15-25 min', fare: '฿20' },
      'Palace': { type: 'BTS + Boat', line: 'Chao Phraya Express', duration: '20-30 min', fare: '฿25-45' },
      'Shrine': { type: 'BTS', line: 'Various', duration: '10-20 min', fare: '฿25-44' },
      
      // Beach & Islands
      'Beach': { type: 'Bus', line: 'Eastern Terminal', duration: '2-3 hr', fare: '฿150-300' },
      'Island': { type: 'Van + Ferry', line: 'Various', duration: '3-5 hr', fare: '฿300-600' },
      'Phuket': { type: 'Plane', line: 'Domestic Flight', duration: '1.5 hr', fare: '฿1,500-3,000' },
      'Krabi': { type: 'Plane', line: 'Domestic Flight', duration: '1.5 hr', fare: '฿1,200-2,500' },
      'Pattaya': { type: 'Bus', line: 'Eastern Bus Terminal', duration: '2 hr', fare: '฿120' },
      
      // Shopping & Markets
      'Market': { type: 'BTS/MRT', line: 'Mo Chit / Chatuchak', duration: '15-30 min', fare: '฿30-50' },
      'Shopping': { type: 'BTS', line: 'Siam / Chit Lom', duration: '10-20 min', fare: '฿25-44' },
      'Mall': { type: 'BTS', line: 'Siam / Chit Lom', duration: '10-20 min', fare: '฿25-44' },
      'Night Market': { type: 'MRT', line: 'Various', duration: '15-25 min', fare: '฿20-42' },
      'Floating Market': { type: 'Van', line: 'Hotel Pickup', duration: '1.5 hr', fare: 'Included' },
      
      // Food & Dining
      'Restaurant': { type: 'Grab', line: 'On-demand', duration: '10-20 min', fare: '฿80-150' },
      'Street Food': { type: 'Walk', line: 'Nearby', duration: '5-10 min', fare: '฿0' },
      'Rooftop': { type: 'BTS', line: 'Silom / Sathorn', duration: '10-20 min', fare: '฿25-37' },
      'Cafe': { type: 'Walk', line: 'Nearby', duration: '5-10 min', fare: '฿0' },
      
      // Culture & Museums
      'Museum': { type: 'BTS', line: 'National Stadium / Siam', duration: '15-25 min', fare: '฿25-37' },
      'Art': { type: 'BTS', line: 'Siam', duration: '15-25 min', fare: '฿25-37' },
      'Gallery': { type: 'Walk', line: 'Nearby', duration: '5-15 min', fare: '฿0' },
      
      // Accommodation
      'Hotel': { type: 'Airport Rail', line: 'ARL to Phaya Thai', duration: '30 min', fare: '฿45' },
      'Resort': { type: 'Van', line: 'Hotel Transfer', duration: 'Varies', fare: '฿200-500' },
      'Check-in': { type: 'Taxi', line: 'From Airport', duration: '30-60 min', fare: '฿300-500' },
      
      // Transport & Transit
      'Airport': { type: 'Airport Rail', line: 'ARL Makkasan', duration: '25-35 min', fare: '฿45' },
      'Station': { type: 'Walk', line: 'Nearby', duration: '5 min', fare: '฿0' },
      'Transfer': { type: 'Taxi', line: 'Private', duration: 'Varies', fare: '฿200-400' },
      
      // Activities & Entertainment
      'Tour': { type: 'Van', line: 'Hotel Pickup', duration: 'Varies', fare: 'Included' },
      'Massage': { type: 'Walk', line: 'Nearby', duration: '5-15 min', fare: '฿0' },
      'Spa': { type: 'Grab', line: 'On-demand', duration: '10-20 min', fare: '฿80-150' },
      'Show': { type: 'BTS', line: 'Various', duration: '15-25 min', fare: '฿25-44' },
      'Nature': { type: 'Van', line: 'Hotel Pickup', duration: '1-2 hr', fare: '฿300-600' },
      'Park': { type: 'BTS/MRT', line: 'Various', duration: '15-30 min', fare: '฿25-50' },
      'Viewpoint': { type: 'Taxi', line: 'Private', duration: '30-45 min', fare: '฿200-350' },
      
      // Northern Thailand
      'Chiang Mai': { type: 'Plane', line: 'Domestic Flight', duration: '1.25 hr', fare: '฿1,200-2,800' },
      'Chiang Rai': { type: 'Plane', line: 'Domestic Flight', duration: '1.5 hr', fare: '฿1,500-3,200' },
      'Ayutthaya': { type: 'Train', line: 'Hualamphong Station', duration: '1.5 hr', fare: '฿15-350' },
    }
    const typeUpper = (type || '').toLowerCase()
    for (const [key, transport] of Object.entries(transports)) {
      if (typeUpper.includes(key.toLowerCase())) return transport
    }
    // Default fallback transport
    return { type: 'Grab', line: 'On-demand', duration: '15-30 min', fare: '฿100-200' }
  }
  
  // Use built itinerary if available, otherwise sample
  const builtActivities = getBuiltActivities()
  const displayActivities = builtActivities || sampleItinerary.activities
  const displayTitle = builtActivities ? `${itinerary.destination || 'Thailand'} Adventure` : sampleItinerary.title
  const displayDays = builtActivities ? Object.keys(builtActivities).length : sampleItinerary.days

  const handleCreateItinerary = () => {
    onVoiceIntent('create_itinerary', { days: selectedDays, destination })
  }

  const hasItinerary = itinerary.days.length > 0 && itinerary.days.some(day => 
    day && (day.morning || day.afternoon || day.evening)
  )

  // Use built data if available, or sample for demo
  const showSample = !hasItinerary && !builtActivities
  const currentActivities = displayActivities[selectedDay] || []
  const totalDays = builtActivities ? Object.keys(builtActivities).length : 3


  return (
    <div className="itinerary-screen">
      {/* Header */}
      <div className="itinerary-header">
        <button 
          className="back-chevron"
          onClick={() => onVoiceIntent('navigate_home')}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="header-title">Itinerary</span>
        <div className="header-spacer"></div>
      </div>

      {/* Building Mode - Dynamic Itinerary Creation */}
      {isBuilding && (
        <div className="building-mode">
          <div className="building-header">
            <div className="building-indicator">
              <span className="building-dot"></span>
              <span className="building-text">Building your itinerary...</span>
            </div>
            <span className="building-destination">{itinerary.destination || 'Thailand'}</span>
          </div>
          
          <div className="building-steps">
            {buildingSteps.map((step, idx) => (
              <div key={idx} className="building-step" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="step-number">{idx + 1}</div>
                <div className="step-content">
                  <span className="step-day">Day {(step.day || 0) + 1} • {step.slot}</span>
                  <span className="step-name">{step.activity?.name}</span>
                  <span className="step-desc">{step.activity?.description}</span>
                  {step.activity?.price && (
                    <span className="step-price">{step.activity.price}</span>
                  )}
                </div>
                <span className="step-check">✓</span>
              </div>
            ))}
            
            {buildingSteps.length === 0 && (
              <div className="building-empty">
                <span>Listening for your travel preferences...</span>
              </div>
            )}
          </div>
          
          {buildingSteps.length > 0 && (
            <div className="building-summary">
              <span>{buildingSteps.length} activities planned</span>
            </div>
          )}
        </div>
      )}

      {!isBuilding && (showSample || builtActivities) ? (
        <>
          {/* Trip Header */}
          <div className="trip-header">
            <h1 className="trip-title">{displayTitle} — {totalDays} Days Trip</h1>
            <p className="trip-desc">{builtActivities ? `Your personalized ${itinerary.destination || 'Thailand'} adventure awaits!` : sampleItinerary.description}</p>
          </div>

          {/* Trip Meta */}
          <div className="trip-meta">
            <span className="meta-pill">{itinerary.destination || 'Thailand'}</span>
            <span className="meta-pill">{totalDays} Days</span>
            <span className="meta-pill">2 Adults</span>
            <span className="meta-pill">{builtActivities ? 'Custom' : sampleItinerary.avgCost}</span>
          </div>

          {/* Day Selector - Glass Pills */}
          <div className="day-selector">
            <div className="day-pills">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  className={`day-pill-btn ${selectedDay === day ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  Day {day}
                </button>
              ))}
              <div 
                className="day-pill-slider" 
                style={{ 
                  transform: `translateX(${(selectedDay - 1) * 100}%)`,
                  width: `${100 / totalDays}%`
                }}
              />
            </div>
          </div>

          {/* Day Title */}
          <div className="day-header">
            <span className="day-label">Day {selectedDay}</span>
            <span className="day-theme">
              {selectedDay === 1 ? 'Arrival & Exploration' : selectedDay === totalDays ? 'Final Day' : 'Adventure Continues'}
            </span>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {currentActivities.map((activity, idx) => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-marker">
                  <span className="marker-dot">{idx + 1}</span>
                  {idx < currentActivities.length - 1 && <div className="marker-line"></div>}
                </div>
                
                <div className="activity-card">
                  <div className="activity-row">
                    <img className="activity-img" src={activity.image || getImageForType(activity.type || activity.title)} alt={activity.title} />
                    <div className="activity-info">
                      <span className="activity-time">{activity.time}</span>
                      <span className="activity-name">{activity.title}</span>
                      <span className="activity-loc">{activity.location}</span>
                    </div>
                    <div className="activity-right">
                      <span className="activity-cost">{activity.price}</span>
                      {activity.bookable && (
                        <button className="activity-btn">{activity.action}</button>
                      )}
                    </div>
                  </div>
                  {activity.transport && (
                    <div className="activity-transport">
                      <span className="transport-badge">{activity.transport.type}</span>
                      <span className="transport-meta">{activity.transport.duration} • {activity.transport.fare}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Book All / Generate New */}
          <div className="itinerary-actions">
            {builtActivities && (
              <button className="book-all-btn" onClick={() => alert('Booking all activities...')}>
                Book All Activities
              </button>
            )}
            <button className="generate-link" onClick={handleCreateItinerary}>
              {builtActivities ? 'Create New Plan' : 'Generate new itinerary'} →
            </button>
          </div>
        </>
      ) : !isBuilding ? (
        /* Create Section */
        <div className="create-section">
          <span className="create-label">Plan your trip</span>
          
          <div className="option-row">
            {destinations.map((dest) => (
              <button
                key={dest}
                className={`option-pill ${destination === dest ? 'active' : ''}`}
                onClick={() => setDestination(dest)}
              >
                {dest}
              </button>
            ))}
          </div>

          <div className="days-row">
            {dayOptions.map((days) => (
              <button
                key={days}
                className={`day-pill ${selectedDays === days ? 'active' : ''}`}
                onClick={() => setSelectedDays(days)}
              >
                {days} days
              </button>
            ))}
          </div>

          <button className="generate-btn" onClick={handleCreateItinerary}>
            Generate
          </button>
        </div>
      ) : null}
    </div>
  )
}
