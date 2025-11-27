import React, { useState, useEffect } from 'react'
import { getDirectionIcon, getLineColor } from './DirectionIcons'
import './WalkingDirections.css'

/**
 * Directions - Universal Visual Path Component
 * 
 * Handles ALL transport modes:
 * - walk: Walking directions
 * - bus: Bus routes
 * - train: BTS/MRT/ARL
 * - boat: Ferry/Express Boat
 * - taxi: Taxi/Grab/Bolt
 * 
 * Renders an animated path with dynamic icons stitched together
 */
export default function WalkingDirections({ 
  data = null,
  text = null, // Legacy fallback
}) {
  const [steps, setSteps] = useState([])
  const [animatedSteps, setAnimatedSteps] = useState([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [displayOrigin, setDisplayOrigin] = useState('')
  const [displayDestination, setDisplayDestination] = useState('')
  const [totalTime, setTotalTime] = useState(null)
  const [totalDistance, setTotalDistance] = useState(null)
  const [mode, setMode] = useState('walk')
  const [headerInfo, setHeaderInfo] = useState({})

  useEffect(() => {
    setAnimatedSteps([])
    
    if (data) {
      setSteps(data.steps || [])
      setDisplayOrigin(data.origin || 'Your Location')
      setDisplayDestination(data.destination || 'Destination')
      setTotalTime(data.totalTime)
      setTotalDistance(data.totalDistance)
      setMode(data.mode || 'walk')
      
      // Mode-specific header info
      setHeaderInfo({
        fare: data.fare || data.totalFare || data.estimatedFare,
        busNumber: data.busNumber,
        boatType: data.boatType,
        service: data.service,
        notes: data.notes,
      })
    } else if (text) {
      // Legacy text parsing fallback
      const parsed = parseDirectionsText(text)
      if (parsed) {
        setSteps(parsed.steps)
        setDisplayOrigin(parsed.origin || 'Your Location')
        setDisplayDestination(parsed.destination || 'Destination')
        setTotalTime(parsed.totalTime)
        setMode('walk')
      }
    }
  }, [data, text])

  // Animate steps appearing
  useEffect(() => {
    if (steps.length > 0) {
      steps.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatedSteps(prev => [...prev, idx])
        }, idx * 100 + 100)
      })
    }
  }, [steps])

  if (!steps.length) return null

  // Mode-specific styling
  const getModeColor = () => {
    const colors = {
      walk: { primary: 'rgba(0, 212, 255, 0.9)', bg: 'rgba(0, 212, 255, 0.08)' },
      bus: { primary: 'rgba(255, 149, 0, 0.9)', bg: 'rgba(255, 149, 0, 0.08)' },
      train: { primary: 'rgba(94, 196, 77, 0.9)', bg: 'rgba(94, 196, 77, 0.08)' },
      boat: { primary: 'rgba(0, 199, 190, 0.9)', bg: 'rgba(0, 199, 190, 0.08)' },
      taxi: { primary: 'rgba(255, 204, 0, 0.9)', bg: 'rgba(255, 204, 0, 0.08)' },
    }
    return colors[mode] || colors.walk
  }

  const getModeIcon = () => {
    const icons = {
      walk: '🚶',
      bus: '🚌',
      train: '🚇',
      boat: '⛴️',
      taxi: '🚕',
    }
    return icons[mode] || '🚶'
  }

  const modeColor = getModeColor()

  return (
    <div className={`walking-directions mode-${mode}`} style={{ '--mode-color': modeColor.primary, '--mode-bg': modeColor.bg }}>
      {/* Header */}
      <div className="wd-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="wd-route-summary">
          <span className="wd-mode-icon">{getModeIcon()}</span>
          <div className="wd-route-text">
            <span className="wd-origin">{displayOrigin}</span>
            <div className="wd-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <span className="wd-destination">{displayDestination}</span>
          </div>
        </div>
        <div className="wd-meta">
          {totalTime && <span className="wd-time">{totalTime}</span>}
          {totalDistance && <span className="wd-distance">{totalDistance}</span>}
          {headerInfo.fare && <span className="wd-fare">{headerInfo.fare}</span>}
          {headerInfo.busNumber && <span className="wd-bus-number">{headerInfo.busNumber}</span>}
          {headerInfo.service && <span className="wd-service">{headerInfo.service}</span>}
          <span className="wd-expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      {/* Mode-specific notes */}
      {headerInfo.notes && isExpanded && (
        <div className="wd-notes">
          <span className="wd-note-icon">💡</span>
          {headerInfo.notes}
        </div>
      )}

      {/* Steps Timeline */}
      {isExpanded && (
        <div className="wd-timeline">
          {steps.map((step, idx) => (
            <div 
              key={step.id ?? idx}
              className={`wd-step ${step.action || 'walk'} ${animatedSteps.includes(idx) ? 'visible' : ''}`}
            >
              {/* Timeline connector with dynamic icons */}
              <div className="wd-connector">
                <div 
                  className={`wd-icon-wrapper ${step.action || 'walk'}`}
                  style={step.lineColor ? { '--step-color': step.lineColor } : {}}
                >
                  {getDirectionIcon(step.action || mode, 22)}
                </div>
                {idx < steps.length - 1 && (
                  <div 
                    className="wd-line" 
                    style={{ background: step.lineColor || getLineColor(step.action, mode) }}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="wd-content">
                <p className="wd-instruction">{step.instruction}</p>
                
                {/* Context-specific details */}
                <div className="wd-step-details">
                  {/* Walking */}
                  {step.road && <span className="wd-road">{step.road}</span>}
                  {step.landmark && <span className="wd-landmark">📍 {step.landmark}</span>}
                  
                  {/* Bus */}
                  {step.busNumber && <span className="wd-bus-badge">🚌 {step.busNumber}</span>}
                  {step.stopName && <span className="wd-stop-name">{step.stopName}</span>}
                  
                  {/* Train */}
                  {step.line && (
                    <span 
                      className="wd-line-badge" 
                      style={{ background: step.lineColor || '#5EC24D' }}
                    >
                      {step.line}
                    </span>
                  )}
                  {step.station && <span className="wd-station">{step.station}</span>}
                  {step.direction && <span className="wd-direction">→ {step.direction}</span>}
                  
                  {/* Boat */}
                  {step.pierName && <span className="wd-pier">{step.pierCode ? `${step.pierCode}: ` : ''}{step.pierName}</span>}
                  {step.boatFlag && <span className="wd-boat-flag">{step.boatFlag} Flag</span>}
                  
                  {/* Taxi */}
                  {step.traffic && (
                    <span className={`wd-traffic traffic-${step.traffic}`}>
                      🚦 {step.traffic} traffic
                    </span>
                  )}
                  {step.tollCost && <span className="wd-toll">💰 Toll: {step.tollCost}</span>}
                </div>
                
                {/* Duration/distance/stops badges */}
                <div className="wd-step-meta">
                  {step.duration && <span className="wd-duration">{step.duration}</span>}
                  {step.distance && <span className="wd-step-distance">{step.distance}</span>}
                  {step.stopsCount && <span className="wd-stops">{step.stopsCount} stops</span>}
                  {step.waitTime && <span className="wd-wait">⏱️ Wait: {step.waitTime}</span>}
                  {step.fare && <span className="wd-step-fare">{step.fare}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * LEGACY: Parse free-text directions (fallback for walking only)
 */
function parseDirectionsText(text) {
  if (!text) return null

  const steps = []
  let detectedOrigin = null
  let detectedDestination = null

  const originMatch = text.match(/from\s+([^,.\n]+)/i)
  if (originMatch) detectedOrigin = originMatch[1].trim()

  const destMatch = text.match(/(7-Eleven|store|restaurant|station|temple|park|mall|hotel)/i)
  if (destMatch) detectedDestination = destMatch[1]

  const sentences = text.split(/[.!]\s+/).filter(s => s.trim())

  sentences.forEach((sentence, idx) => {
    const s = sentence.trim()
    if (!s || s.length < 10) return

    let action = 'walk'
    
    if (idx === 0 || /^(from|start|begin|head)/i.test(s)) action = 'start'
    else if (/arrive|destination|you('ll)?\s+(see|spot|find)|on\s+(the\s+)?(left|right)/i.test(s)) action = 'arrive'
    else if (/turn\s+left/i.test(s)) action = 'turn_left'
    else if (/turn\s+right/i.test(s)) action = 'turn_right'
    else if (/cross|crossing/i.test(s)) action = 'cross'
    else if (/follow|continue|along/i.test(s)) action = 'continue'

    let duration = null
    const timeMatch = s.match(/(\d+)\s*(min|minute)/i)
    if (timeMatch) duration = `${timeMatch[1]} min`

    steps.push({
      id: idx,
      instruction: s.replace(/^\s*(and\s+)?/i, '').trim(),
      action,
      duration,
    })
  })

  const totalMins = steps.reduce((acc, step) => {
    if (step.duration) return acc + (parseInt(step.duration) || 2)
    return acc + 1
  }, 0)

  return steps.length > 0 ? {
    steps,
    origin: detectedOrigin,
    destination: detectedDestination,
    totalTime: `${totalMins} min`,
  } : null
}

export function isWalkingDirections(text) {
  if (!text || text.length < 30) return false
  const keywords = ['head', 'walk', 'turn', 'follow', 'continue', 'cross', 'left', 'right', 'straight', 'minutes']
  return keywords.filter(kw => text.toLowerCase().includes(kw)).length >= 3
}
