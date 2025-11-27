import React, { useState, useEffect } from 'react'
import './WalkingDirections.css'

/**
 * Parses navigation text and extracts walking steps
 * Looks for patterns like directions, landmarks, distances
 */
function parseDirectionsText(text) {
  if (!text) return null
  
  const steps = []
  
  // Common direction patterns to detect
  const directionPatterns = [
    /head\s+(out\s+)?(toward|to|towards)\s+([^,.]+)/gi,
    /follow\s+([^,.]+)/gi,
    /turn\s+(left|right)\s+([^,.]+)?/gi,
    /continue\s+(along|on|straight)\s*([^,.]*)/gi,
    /cross\s+([^,.]+)/gi,
    /walk\s+(along|down|up|through)\s+([^,.]+)/gi,
    /you('ll|'ll|\s+will)\s+(see|spot|find|reach)\s+([^,.]+)/gi,
    /on\s+the\s+(left|right)(-hand)?\s+side/gi,
    /it's\s+(just\s+)?(a\s+few\s+)?(minutes?|meters?|steps?)/gi,
  ]
  
  // Try to split by sentences and extract meaningful steps
  const sentences = text.split(/[.!]\s+/).filter(s => s.trim())
  
  sentences.forEach((sentence, idx) => {
    const s = sentence.trim()
    if (!s) return
    
    // Determine step type based on content
    let type = 'walk'
    let icon = 'walk'
    
    if (/head|start|from|begin/i.test(s)) {
      type = 'start'
      icon = 'start'
    } else if (/arrive|destination|you('ll|'ll|\s+will)\s+(see|spot|find|reach)|on\s+the\s+(left|right)/i.test(s)) {
      type = 'destination'
      icon = 'destination'
    } else if (/turn\s+(left|right)/i.test(s)) {
      type = 'turn'
      icon = /left/i.test(s) ? 'turn-left' : 'turn-right'
    } else if (/cross|crossing/i.test(s)) {
      type = 'cross'
      icon = 'cross'
    } else if (/follow|continue|along/i.test(s)) {
      type = 'continue'
      icon = 'straight'
    }
    
    // Extract time/distance if present
    let duration = null
    const timeMatch = s.match(/(\d+)\s*(min|minute|minutes|m)/i)
    const distMatch = s.match(/(\d+)\s*(meter|meters|m|km)/i)
    const fewMinMatch = s.match(/(few|couple)\s+minutes?/i)
    
    if (timeMatch) {
      duration = `${timeMatch[1]} min`
    } else if (fewMinMatch) {
      duration = '2-3 min'
    } else if (distMatch) {
      duration = `${distMatch[1]}${distMatch[2].toLowerCase()}`
    }
    
    steps.push({
      id: idx,
      text: s.replace(/^\s*and\s+/i, '').trim(),
      type,
      icon,
      duration,
    })
  })
  
  return steps.length > 0 ? steps : null
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
    'you\'ll see', 'you\'ll spot', 'you\'ll find', 'on the right', 'on the left'
  ]
  
  const matchCount = directionKeywords.filter(kw => 
    text.toLowerCase().includes(kw)
  ).length
  
  return matchCount >= 3
}

export default function WalkingDirections({ text, origin, destination }) {
  const [steps, setSteps] = useState([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [animatedSteps, setAnimatedSteps] = useState([])
  
  useEffect(() => {
    const parsed = parseDirectionsText(text)
    if (parsed) {
      setSteps(parsed)
      // Animate steps appearing one by one
      parsed.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatedSteps(prev => [...prev, idx])
        }, idx * 150)
      })
    }
  }, [text])
  
  if (!steps.length) return null
  
  // Extract origin/destination from first/last steps if not provided
  const displayOrigin = origin || (steps[0]?.text.match(/from\s+([^,]+)/i)?.[1] || 'Your Location')
  const displayDestination = destination || '7-Eleven'
  
  // Calculate total time
  const totalTime = steps.reduce((acc, step) => {
    if (step.duration) {
      const mins = parseInt(step.duration) || 2
      return acc + mins
    }
    return acc + 1
  }, 0)
  
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
          <span className="wd-time">{totalTime} min walk</span>
          <span className="wd-expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>
      
      {/* Steps Timeline */}
      {isExpanded && (
        <div className="wd-timeline">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`wd-step ${step.type} ${animatedSteps.includes(idx) ? 'visible' : ''}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Timeline connector */}
              <div className="wd-connector">
                <div className={`wd-dot ${step.type}`}>
                  {step.type === 'start' && (
                    <div className="wd-dot-inner start"></div>
                  )}
                  {step.type === 'destination' && (
                    <div className="wd-dot-inner destination"></div>
                  )}
                  {step.type === 'turn' && (
                    <svg className="wd-turn-icon" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      {step.icon === 'turn-left' ? (
                        <path d="M14 6l-6 6 6 6V6z"/>
                      ) : (
                        <path d="M10 6l6 6-6 6V6z"/>
                      )}
                    </svg>
                  )}
                </div>
                {idx < steps.length - 1 && <div className="wd-line"></div>}
              </div>
              
              {/* Step content */}
              <div className="wd-content">
                <p className="wd-instruction">{step.text}</p>
                {step.duration && (
                  <span className="wd-duration">{step.duration}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

