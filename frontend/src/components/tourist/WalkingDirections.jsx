import React, { useState, useEffect } from 'react'
import { getDirectionIcon, getLineColor, IconRightSide, IconLeftSide } from './DirectionIcons'
import './WalkingDirections.css'

/**
 * WalkingDirections - Dynamic Visual Path Component
 * 
 * Accepts EITHER:
 * 1. Structured data (from Realtime API tool call) - preferred
 * 2. Raw text (legacy fallback with parsing)
 * 
 * Renders an animated path with dynamic icons stitched together
 */
export default function WalkingDirections({ 
  // Structured data props (from tool call)
  data = null,
  
  // Legacy text props (fallback)
  text = null,
  origin: textOrigin = null,
  destination: textDestination = null,
}) {
  const [steps, setSteps] = useState([])
  const [animatedSteps, setAnimatedSteps] = useState([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [displayOrigin, setDisplayOrigin] = useState('')
  const [displayDestination, setDisplayDestination] = useState('')
  const [totalTime, setTotalTime] = useState(null)
  const [totalDistance, setTotalDistance] = useState(null)

  useEffect(() => {
    // Reset animation state
    setAnimatedSteps([])
    
    if (data) {
      // === STRUCTURED DATA MODE ===
      setSteps(data.steps || [])
      setDisplayOrigin(data.origin || 'Your Location')
      setDisplayDestination(data.destination || 'Destination')
      setTotalTime(data.totalTime)
      setTotalDistance(data.totalDistance)
    } else if (text) {
      // === TEXT PARSING FALLBACK ===
      const parsed = parseDirectionsText(text)
      if (parsed) {
        setSteps(parsed.steps)
        setDisplayOrigin(textOrigin || parsed.origin || 'Your Location')
        setDisplayDestination(textDestination || parsed.destination || 'Destination')
        setTotalTime(parsed.totalTime)
      }
    }
  }, [data, text, textOrigin, textDestination])

  // Animate steps appearing one by one
  useEffect(() => {
    if (steps.length > 0) {
      steps.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatedSteps(prev => [...prev, idx])
        }, idx * 120 + 100)
      })
    }
  }, [steps])

  if (!steps.length) return null

  return (
    <div className="walking-directions">
      {/* Header */}
      <div className="wd-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="wd-route-summary">
          <span className="wd-origin">{displayOrigin}</span>
          <div className="wd-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <span className="wd-destination">{displayDestination}</span>
        </div>
        <div className="wd-meta">
          {totalTime && <span className="wd-time">{totalTime}</span>}
          {totalDistance && <span className="wd-distance">{totalDistance}</span>}
          <span className="wd-expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

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
                <div className={`wd-icon-wrapper ${step.action || 'walk'}`}>
                  {getDirectionIcon(step.action || 'walk', 22)}
                </div>
                {idx < steps.length - 1 && (
                  <div 
                    className="wd-line" 
                    style={{ background: getLineColor(step.action) }}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="wd-content">
                <p className="wd-instruction">
                  {step.instruction}
                  {step.side && (
                    <span className={`wd-side-indicator ${step.side}`}>
                      {step.side === 'right' ? <IconRightSide size={14} /> : <IconLeftSide size={14} />}
                    </span>
                  )}
                </p>
                
                {/* Road/landmark info */}
                {(step.road || step.landmark) && (
                  <span className="wd-road">
                    {step.road || step.landmark}
                  </span>
                )}
                
                {/* Duration/distance badges */}
                <div className="wd-step-meta">
                  {step.duration && (
                    <span className="wd-duration">{step.duration}</span>
                  )}
                  {step.distance && (
                    <span className="wd-step-distance">{step.distance}</span>
                  )}
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
 * LEGACY: Parse free-text directions into structured steps
 * Used as fallback when API returns text instead of structured data
 */
function parseDirectionsText(text) {
  if (!text) return null

  const steps = []
  let detectedOrigin = null
  let detectedDestination = null

  // Try to extract origin from text
  const originMatch = text.match(/from\s+([^,.\n]+)/i)
  if (originMatch) detectedOrigin = originMatch[1].trim()

  // Try to extract destination
  const destMatch = text.match(/(7-Eleven|seven.?eleven|store|restaurant|station|temple|park|mall|hotel|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)
  if (destMatch) detectedDestination = destMatch[1]

  // Split by sentences
  const sentences = text.split(/[.!]\s+/).filter(s => s.trim())

  sentences.forEach((sentence, idx) => {
    const s = sentence.trim()
    if (!s || s.length < 10) return

    // Determine action type
    let action = 'walk'
    
    if (idx === 0 || /^(from|start|begin|head\s+out|exit)/i.test(s)) {
      action = 'start'
    } else if (/arrive|destination|you('ll|'ll|\s+will)\s+(see|spot|find|reach)|on\s+(your\s+)?(the\s+)?(left|right)/i.test(s)) {
      action = 'arrive'
    } else if (/turn\s+(left|sharp\s+left)/i.test(s)) {
      action = 'turn_left'
    } else if (/turn\s+(right|sharp\s+right)/i.test(s)) {
      action = 'turn_right'
    } else if (/bear\s+left|slight(ly)?\s+left|veer\s+left/i.test(s)) {
      action = 'slight_left'
    } else if (/bear\s+right|slight(ly)?\s+right|veer\s+right/i.test(s)) {
      action = 'slight_right'
    } else if (/cross|crossing|crosswalk/i.test(s)) {
      action = 'cross'
    } else if (/stair.*up|upstairs|go\s+up/i.test(s)) {
      action = 'stairs_up'
    } else if (/stair.*down|downstairs|go\s+down/i.test(s)) {
      action = 'stairs_down'
    } else if (/elevator|lift/i.test(s)) {
      action = 'elevator'
    } else if (/escalator/i.test(s)) {
      action = 'escalator'
    } else if (/bts|mrt|metro|station|skytrain/i.test(s)) {
      action = 'metro'
    } else if (/bus\s+stop|bus\s+station/i.test(s)) {
      action = 'bus_stop'
    } else if (/follow|continue|along|straight/i.test(s)) {
      action = 'continue'
    }

    // Extract side indicator
    let side = null
    if (/on\s+(your\s+)?(the\s+)?right/i.test(s)) side = 'right'
    if (/on\s+(your\s+)?(the\s+)?left/i.test(s)) side = 'left'

    // Extract road name
    let road = null
    const roadMatch = s.match(/(along|on|onto)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*(Road|Street|Soi|Avenue|Blvd|Lane)?)/i)
    if (roadMatch) road = roadMatch[2]

    // Extract duration
    let duration = null
    const timeMatch = s.match(/(\d+)\s*(min|minute|minutes)/i)
    const fewMinMatch = s.match(/(few|couple)\s+minutes?/i)
    if (timeMatch) duration = `${timeMatch[1]} min`
    else if (fewMinMatch) duration = '2-3 min'

    // Extract distance
    let distance = null
    const distMatch = s.match(/(\d+)\s*(m|meters?|km)/i)
    if (distMatch) distance = `${distMatch[1]}${distMatch[2].toLowerCase()}`

    steps.push({
      id: idx,
      instruction: s.replace(/^\s*(and\s+)?/i, '').trim(),
      action,
      road,
      side,
      duration,
      distance,
      landmark: null,
    })
  })

  // Calculate total time
  let totalTime = null
  const totalMins = steps.reduce((acc, step) => {
    if (step.duration) {
      const mins = parseInt(step.duration) || 2
      return acc + mins
    }
    return acc + 1
  }, 0)
  if (totalMins > 0) totalTime = `${totalMins} min`

  return steps.length > 0 ? {
    steps,
    origin: detectedOrigin,
    destination: detectedDestination,
    totalTime,
  } : null
}

/**
 * Check if text looks like walking directions
 */
export function isWalkingDirections(text) {
  if (!text || text.length < 30) return false

  const directionKeywords = [
    'head', 'walk', 'turn', 'follow', 'continue', 'cross',
    'left', 'right', 'straight', 'along', 'toward', 'towards',
    'minutes', 'meters', 'steps', 'sidewalk', 'road', 'street',
    "you'll see", "you'll spot", "you'll find", 'on the right', 'on the left',
    'exit', 'gate', 'entrance'
  ]

  const matchCount = directionKeywords.filter(kw =>
    text.toLowerCase().includes(kw)
  ).length

  return matchCount >= 3
}
