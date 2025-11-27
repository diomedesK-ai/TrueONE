import React from 'react'

/**
 * Dynamic Direction Icons - Stitched together based on step type
 * Each icon is designed to work in a timeline/path visualization
 */

// Start location marker (pulsing cyan dot)
export const IconStart = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 212, 255, 0.15)" stroke="rgba(0, 212, 255, 0.6)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="rgba(0, 212, 255, 1)">
      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

// Destination marker (green checkmark in circle)
export const IconDestination = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 199, 89, 0.15)" stroke="rgba(52, 199, 89, 0.6)" strokeWidth="2"/>
    <path d="M8 12l3 3 5-6" stroke="rgba(52, 199, 89, 1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Walking person - clean minimal style
export const IconWalk = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5"/>
    <circle cx="12" cy="7" r="1.8" fill="rgba(255, 255, 255, 0.8)"/>
    <path d="M12 9v4.5M10 17l2-3.5 2 3.5M9.5 12.5l2.5 1M14.5 12.5l-2.5 1" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Continue straight arrow
export const IconContinue = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5"/>
    <path d="M12 16V8M9 10l3-3 3 3" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Turn left arrow
export const IconTurnLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 159, 10, 0.15)" stroke="rgba(255, 159, 10, 0.5)" strokeWidth="1.5"/>
    <path d="M15 16v-4a2 2 0 0 0-2-2H9M9 10l-3 2 3 2" stroke="rgba(255, 159, 10, 0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Turn right arrow
export const IconTurnRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 159, 10, 0.15)" stroke="rgba(255, 159, 10, 0.5)" strokeWidth="1.5"/>
    <path d="M9 16v-4a2 2 0 0 1 2-2h4M15 10l3 2-3 2" stroke="rgba(255, 159, 10, 0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Slight left
export const IconSlightLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 214, 10, 0.12)" stroke="rgba(255, 214, 10, 0.4)" strokeWidth="1.5"/>
    <path d="M15 16l-3-8M12 8l-4 3" stroke="rgba(255, 214, 10, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Slight right
export const IconSlightRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 214, 10, 0.12)" stroke="rgba(255, 214, 10, 0.4)" strokeWidth="1.5"/>
    <path d="M9 16l3-8M12 8l4 3" stroke="rgba(255, 214, 10, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// U-turn
export const IconUturn = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 69, 58, 0.12)" stroke="rgba(255, 69, 58, 0.4)" strokeWidth="1.5"/>
    <path d="M9 16v-5a3 3 0 0 1 6 0v5M15 14l-2 2-2-2" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Cross street / crosswalk
export const IconCross = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(94, 92, 230, 0.12)" stroke="rgba(94, 92, 230, 0.4)" strokeWidth="1.5"/>
    <path d="M6 12h12M12 6v12" stroke="rgba(94, 92, 230, 0.9)" strokeWidth="2" strokeLinecap="round"/>
    <rect x="10" y="10" width="4" height="4" fill="rgba(94, 92, 230, 0.4)"/>
  </svg>
)

// Stairs up
export const IconStairsUp = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(175, 82, 222, 0.12)" stroke="rgba(175, 82, 222, 0.4)" strokeWidth="1.5"/>
    <path d="M8 16h3v-3h3v-3h3" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 7l-2 3" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Stairs down
export const IconStairsDown = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(175, 82, 222, 0.12)" stroke="rgba(175, 82, 222, 0.4)" strokeWidth="1.5"/>
    <path d="M8 8h3v3h3v3h3" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 17l-2-3" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Elevator
export const IconElevator = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(100, 210, 255, 0.12)" stroke="rgba(100, 210, 255, 0.4)" strokeWidth="1.5"/>
    <rect x="8" y="7" width="8" height="10" rx="1" stroke="rgba(100, 210, 255, 0.9)" strokeWidth="1.5"/>
    <path d="M10 10l2-2 2 2M10 14l2 2 2-2" stroke="rgba(100, 210, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Escalator
export const IconEscalator = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(100, 210, 255, 0.12)" stroke="rgba(100, 210, 255, 0.4)" strokeWidth="1.5"/>
    <path d="M7 16l4-4h3l4-4" stroke="rgba(100, 210, 255, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="8" r="1.5" fill="rgba(100, 210, 255, 0.9)"/>
  </svg>
)

// Landmark / Point of Interest
export const IconLandmark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 159, 10, 0.12)" stroke="rgba(255, 159, 10, 0.4)" strokeWidth="1.5"/>
    <path d="M12 7v2M12 17v-4M8 17h8M9 13l3-4 3 4" stroke="rgba(255, 159, 10, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Store / 7-Eleven
export const IconStore = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 199, 89, 0.15)" stroke="rgba(52, 199, 89, 0.5)" strokeWidth="1.5"/>
    <path d="M7 10v7h10v-7M5 10l7-4 7 4" stroke="rgba(52, 199, 89, 0.95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="10" y="13" width="4" height="4" stroke="rgba(52, 199, 89, 0.95)" strokeWidth="1.5"/>
  </svg>
)

// Bus stop
export const IconBusStop = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 122, 255, 0.12)" stroke="rgba(0, 122, 255, 0.4)" strokeWidth="1.5"/>
    <rect x="8" y="7" width="8" height="9" rx="1.5" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1.5"/>
    <path d="M8 13h8M10 17v1M14 17v1" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="15" r="1" fill="rgba(0, 122, 255, 0.9)"/>
    <circle cx="14" cy="15" r="1" fill="rgba(0, 122, 255, 0.9)"/>
  </svg>
)

// Metro / BTS / MRT station
export const IconMetro = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(175, 82, 222, 0.12)" stroke="rgba(175, 82, 222, 0.5)" strokeWidth="1.5"/>
    <path d="M8 16l1-8h6l1 8" stroke="rgba(175, 82, 222, 0.95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12h6" stroke="rgba(175, 82, 222, 0.95)" strokeWidth="1.5"/>
    <circle cx="10" cy="14" r="1" fill="rgba(175, 82, 222, 0.95)"/>
    <circle cx="14" cy="14" r="1" fill="rgba(175, 82, 222, 0.95)"/>
  </svg>
)

// Pass by / reference point
export const IconPassBy = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="5" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeDasharray="3 2"/>
  </svg>
)

// Right side indicator
export const IconRightSide = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="rgba(52, 199, 89, 0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Left side indicator
export const IconLeftSide = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 6l-6 6 6 6" stroke="rgba(52, 199, 89, 0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ===== BUS ICONS =====
export const IconBus = ({ size = 20, color = 'rgba(255, 149, 0, 0.9)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 149, 0, 0.12)" stroke="rgba(255, 149, 0, 0.4)" strokeWidth="1.5"/>
    <rect x="6" y="6" width="12" height="10" rx="2" stroke={color} strokeWidth="1.5"/>
    <line x1="6" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5"/>
    <circle cx="8.5" cy="14" r="1.2" fill={color}/>
    <circle cx="15.5" cy="14" r="1.2" fill={color}/>
    <line x1="8" y1="17" x2="8" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="16" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const IconBusBoard = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 199, 89, 0.15)" stroke="rgba(52, 199, 89, 0.5)" strokeWidth="1.5"/>
    <rect x="7" y="7" width="10" height="8" rx="1.5" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5"/>
    <path d="M12 15v3M10 18h4" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 10h6" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const IconBusAlight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 69, 58, 0.12)" stroke="rgba(255, 69, 58, 0.4)" strokeWidth="1.5"/>
    <rect x="7" y="7" width="10" height="8" rx="1.5" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="1.5"/>
    <path d="M15 12l2 2-2 2" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="14" x2="17" y2="14" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// ===== TRAIN/BTS/MRT ICONS =====
export const IconTrain = ({ size = 20, color = 'rgba(94, 196, 77, 0.9)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(94, 196, 77, 0.12)" stroke="rgba(94, 196, 77, 0.4)" strokeWidth="1.5"/>
    <path d="M8 5h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke={color} strokeWidth="1.5"/>
    <line x1="6" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1.5"/>
    <circle cx="9" cy="14" r="1" fill={color}/>
    <circle cx="15" cy="14" r="1" fill={color}/>
    <path d="M9 18l-1 2M15 18l1 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const IconBTS = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(94, 196, 77, 0.15)" stroke="rgba(94, 196, 77, 0.5)" strokeWidth="1.5"/>
    <text x="12" y="16" textAnchor="middle" fill="rgba(94, 196, 77, 1)" fontSize="9" fontWeight="bold">BTS</text>
  </svg>
)

export const IconMRT = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 102, 179, 0.15)" stroke="rgba(0, 102, 179, 0.5)" strokeWidth="1.5"/>
    <text x="12" y="16" textAnchor="middle" fill="rgba(0, 102, 179, 1)" fontSize="8" fontWeight="bold">MRT</text>
  </svg>
)

export const IconARL = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(227, 25, 55, 0.15)" stroke="rgba(227, 25, 55, 0.5)" strokeWidth="1.5"/>
    <text x="12" y="16" textAnchor="middle" fill="rgba(227, 25, 55, 1)" fontSize="8" fontWeight="bold">ARL</text>
  </svg>
)

export const IconTrainBoard = ({ size = 20, color = 'rgba(94, 196, 77, 0.9)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 199, 89, 0.15)" stroke="rgba(52, 199, 89, 0.5)" strokeWidth="1.5"/>
    <rect x="7" y="6" width="10" height="8" rx="1.5" stroke={color} strokeWidth="1.5"/>
    <path d="M7 10h10" stroke={color} strokeWidth="1"/>
    <path d="M10 14v3l-2 1M14 14v3l2 1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="12" r="0.8" fill={color}/>
    <circle cx="15" cy="12" r="0.8" fill={color}/>
  </svg>
)

export const IconTrainAlight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 69, 58, 0.12)" stroke="rgba(255, 69, 58, 0.4)" strokeWidth="1.5"/>
    <rect x="5" y="6" width="10" height="8" rx="1.5" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="1.5"/>
    <path d="M16 10l3 2-3 2" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconTransfer = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(175, 82, 222, 0.12)" stroke="rgba(175, 82, 222, 0.4)" strokeWidth="1.5"/>
    <path d="M7 9h7l-2-2M17 15h-7l2 2" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ===== BOAT/FERRY ICONS =====
export const IconBoat = ({ size = 20, color = 'rgba(0, 199, 190, 0.9)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 199, 190, 0.12)" stroke="rgba(0, 199, 190, 0.4)" strokeWidth="1.5"/>
    <path d="M4 15c1.5 1.5 3 2 4 2s2.5-.5 4-2c1.5 1.5 3 2 4 2s2.5-.5 4-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 15V9l6-3 6 3v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="6" x2="12" y2="12" stroke={color} strokeWidth="1.5"/>
  </svg>
)

export const IconFerry = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 122, 255, 0.12)" stroke="rgba(0, 122, 255, 0.4)" strokeWidth="1.5"/>
    <path d="M5 16c2 1.5 4 2 7 2s5-.5 7-2" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 16V10l5-4 5 4v6" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="10" y="10" width="4" height="4" fill="rgba(0, 122, 255, 0.3)" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1"/>
  </svg>
)

export const IconBoatPier = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 199, 190, 0.15)" stroke="rgba(0, 199, 190, 0.5)" strokeWidth="1.5"/>
    <path d="M4 14h16" stroke="rgba(0, 199, 190, 0.9)" strokeWidth="2" strokeLinecap="round"/>
    <rect x="8" y="8" width="8" height="6" stroke="rgba(0, 199, 190, 0.9)" strokeWidth="1.5"/>
    <line x1="12" y1="14" x2="12" y2="18" stroke="rgba(0, 199, 190, 0.9)" strokeWidth="1.5"/>
  </svg>
)

export const IconBoatBoard = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 199, 89, 0.15)" stroke="rgba(52, 199, 89, 0.5)" strokeWidth="1.5"/>
    <path d="M5 14c2 1 4 1.5 7 1.5s5-.5 7-1.5" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14V9l4-3 4 3v5" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 17l2-2 2 2" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ===== CAR/TAXI ICONS =====
export const IconCar = ({ size = 20, color = 'rgba(255, 204, 0, 0.9)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 204, 0, 0.12)" stroke="rgba(255, 204, 0, 0.4)" strokeWidth="1.5"/>
    <path d="M5 14h14v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2z" stroke={color} strokeWidth="1.5"/>
    <path d="M6 14l1.5-4h9l1.5 4" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="7.5" cy="15" r="1" fill={color}/>
    <circle cx="16.5" cy="15" r="1" fill={color}/>
  </svg>
)

export const IconTaxi = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 204, 0, 0.15)" stroke="rgba(255, 204, 0, 0.5)" strokeWidth="1.5"/>
    <path d="M5 14h14v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2z" stroke="rgba(255, 204, 0, 1)" strokeWidth="1.5"/>
    <path d="M6 14l1.5-4h9l1.5 4" stroke="rgba(255, 204, 0, 1)" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="9" y="6" width="6" height="2" rx="0.5" fill="rgba(255, 204, 0, 1)"/>
    <text x="12" y="7.5" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold">TAXI</text>
    <circle cx="7.5" cy="15" r="1" fill="rgba(255, 204, 0, 1)"/>
    <circle cx="16.5" cy="15" r="1" fill="rgba(255, 204, 0, 1)"/>
  </svg>
)

export const IconGrab = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 176, 80, 0.15)" stroke="rgba(0, 176, 80, 0.5)" strokeWidth="1.5"/>
    <path d="M5 14h14v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2z" stroke="rgba(0, 176, 80, 1)" strokeWidth="1.5"/>
    <path d="M6 14l1.5-4h9l1.5 4" stroke="rgba(0, 176, 80, 1)" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="7.5" cy="15" r="1" fill="rgba(0, 176, 80, 1)"/>
    <circle cx="16.5" cy="15" r="1" fill="rgba(0, 176, 80, 1)"/>
  </svg>
)

export const IconBolt = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 211, 153, 0.15)" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1.5"/>
    <path d="M13 5l-5 7h4l-1 7 5-7h-4l1-7z" fill="rgba(52, 211, 153, 0.9)"/>
  </svg>
)

export const IconPickup = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(52, 199, 89, 0.15)" stroke="rgba(52, 199, 89, 0.5)" strokeWidth="1.5"/>
    <circle cx="12" cy="10" r="3" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5"/>
    <path d="M12 13v5M9 16l3 3 3-3" stroke="rgba(52, 199, 89, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconDropoff = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 69, 58, 0.12)" stroke="rgba(255, 69, 58, 0.4)" strokeWidth="1.5"/>
    <path d="M12 7v8M9 12l3 3 3-3" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="18" r="1.5" fill="rgba(255, 69, 58, 0.9)"/>
  </svg>
)

// ===== TRAFFIC/ROAD ICONS =====
export const IconTraffic = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 69, 58, 0.12)" stroke="rgba(255, 69, 58, 0.4)" strokeWidth="1.5"/>
    <rect x="9" y="5" width="6" height="14" rx="1" stroke="rgba(255, 69, 58, 0.9)" strokeWidth="1.5"/>
    <circle cx="12" cy="8" r="1.5" fill="rgba(255, 69, 58, 0.9)"/>
    <circle cx="12" cy="12" r="1.5" fill="rgba(255, 214, 10, 0.9)"/>
    <circle cx="12" cy="16" r="1.5" fill="rgba(52, 199, 89, 0.9)"/>
  </svg>
)

export const IconTollway = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(175, 82, 222, 0.12)" stroke="rgba(175, 82, 222, 0.4)" strokeWidth="1.5"/>
    <rect x="8" y="6" width="8" height="12" rx="1" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="1.5"/>
    <path d="M8 10h8M8 14h8" stroke="rgba(175, 82, 222, 0.9)" strokeWidth="1"/>
    <text x="12" y="13" textAnchor="middle" fill="rgba(175, 82, 222, 1)" fontSize="5" fontWeight="bold">฿</text>
  </svg>
)

export const IconHighway = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(0, 122, 255, 0.12)" stroke="rgba(0, 122, 255, 0.4)" strokeWidth="1.5"/>
    <path d="M6 18l2-12h8l2 12" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="6" x2="12" y2="18" stroke="rgba(0, 122, 255, 0.9)" strokeWidth="1.5" strokeDasharray="2 2"/>
  </svg>
)

// ===== WAIT/TIME ICONS =====
export const IconWait = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(255, 214, 10, 0.12)" stroke="rgba(255, 214, 10, 0.4)" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="5" stroke="rgba(255, 214, 10, 0.9)" strokeWidth="1.5"/>
    <path d="M12 9v3l2 2" stroke="rgba(255, 214, 10, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconFrequency = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="rgba(100, 210, 255, 0.12)" stroke="rgba(100, 210, 255, 0.4)" strokeWidth="1.5"/>
    <path d="M6 12h2l2-4 2 8 2-4h4" stroke="rgba(100, 210, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/**
 * Get icon component by action type
 */
export function getDirectionIcon(action, size = 20) {
  const icons = {
    // Walking
    'start': IconStart,
    'walk': IconWalk,
    'continue': IconContinue,
    'straight': IconContinue,
    'turn_left': IconTurnLeft,
    'turn_right': IconTurnRight,
    'slight_left': IconSlightLeft,
    'slight_right': IconSlightRight,
    'uturn': IconUturn,
    'cross': IconCross,
    'crosswalk': IconCross,
    'stairs_up': IconStairsUp,
    'stairs_down': IconStairsDown,
    'elevator': IconElevator,
    'escalator': IconEscalator,
    'landmark': IconLandmark,
    'poi': IconLandmark,
    'store': IconStore,
    'shop': IconStore,
    'arrive': IconDestination,
    'destination': IconDestination,
    'pass_by': IconPassBy,
    'reference': IconPassBy,
    
    // Bus
    'bus': IconBus,
    'bus_stop': IconBusStop,
    'bus_board': IconBusBoard,
    'bus_alight': IconBusAlight,
    'board_bus': IconBusBoard,
    'exit_bus': IconBusAlight,
    
    // Train/BTS/MRT
    'train': IconTrain,
    'metro': IconMetro,
    'bts': IconBTS,
    'mrt': IconMRT,
    'arl': IconARL,
    'airport_link': IconARL,
    'station': IconMetro,
    'train_board': IconTrainBoard,
    'train_alight': IconTrainAlight,
    'board_train': IconTrainBoard,
    'exit_train': IconTrainAlight,
    'board_bts': IconTrainBoard,
    'exit_bts': IconTrainAlight,
    'board_mrt': IconTrainBoard,
    'exit_mrt': IconTrainAlight,
    'transfer': IconTransfer,
    'change_line': IconTransfer,
    
    // Boat/Ferry
    'boat': IconBoat,
    'ferry': IconFerry,
    'pier': IconBoatPier,
    'boat_pier': IconBoatPier,
    'boat_board': IconBoatBoard,
    'board_boat': IconBoatBoard,
    'exit_boat': IconBusAlight,
    'river_taxi': IconBoat,
    'express_boat': IconBoat,
    
    // Car/Taxi
    'car': IconCar,
    'taxi': IconTaxi,
    'grab': IconGrab,
    'bolt': IconBolt,
    'rideshare': IconGrab,
    'pickup': IconPickup,
    'dropoff': IconDropoff,
    'get_in': IconPickup,
    'get_out': IconDropoff,
    
    // Traffic/Road
    'traffic': IconTraffic,
    'tollway': IconTollway,
    'toll': IconTollway,
    'highway': IconHighway,
    'expressway': IconHighway,
    
    // Wait/Time
    'wait': IconWait,
    'frequency': IconFrequency,
  }
  
  const IconComponent = icons[action] || IconPassBy
  return <IconComponent size={size} />
}

/**
 * Get line color based on step type / transport mode
 */
export function getLineColor(action, mode = null) {
  // If mode is specified, use mode-specific colors
  if (mode) {
    const modeColors = {
      'walk': 'rgba(255, 255, 255, 0.2)',
      'bus': 'rgba(255, 149, 0, 0.4)',
      'train': 'rgba(94, 196, 77, 0.4)',
      'bts': 'rgba(94, 196, 77, 0.4)',
      'mrt': 'rgba(0, 102, 179, 0.4)',
      'arl': 'rgba(227, 25, 55, 0.4)',
      'boat': 'rgba(0, 199, 190, 0.4)',
      'ferry': 'rgba(0, 122, 255, 0.4)',
      'taxi': 'rgba(255, 204, 0, 0.4)',
      'car': 'rgba(255, 204, 0, 0.4)',
      'grab': 'rgba(0, 176, 80, 0.4)',
    }
    return modeColors[mode] || 'rgba(255, 255, 255, 0.15)'
  }
  
  // Action-specific colors
  const colors = {
    'start': 'rgba(0, 212, 255, 0.4)',
    'arrive': 'rgba(52, 199, 89, 0.4)',
    'destination': 'rgba(52, 199, 89, 0.4)',
    
    // Walking
    'turn_left': 'rgba(255, 159, 10, 0.3)',
    'turn_right': 'rgba(255, 159, 10, 0.3)',
    'stairs_up': 'rgba(175, 82, 222, 0.3)',
    'stairs_down': 'rgba(175, 82, 222, 0.3)',
    
    // Bus
    'bus': 'rgba(255, 149, 0, 0.4)',
    'bus_board': 'rgba(52, 199, 89, 0.4)',
    'bus_alight': 'rgba(255, 69, 58, 0.3)',
    
    // Train
    'train': 'rgba(94, 196, 77, 0.4)',
    'bts': 'rgba(94, 196, 77, 0.4)',
    'mrt': 'rgba(0, 102, 179, 0.4)',
    'arl': 'rgba(227, 25, 55, 0.4)',
    'metro': 'rgba(175, 82, 222, 0.3)',
    'transfer': 'rgba(175, 82, 222, 0.4)',
    'train_board': 'rgba(52, 199, 89, 0.4)',
    'train_alight': 'rgba(255, 69, 58, 0.3)',
    
    // Boat
    'boat': 'rgba(0, 199, 190, 0.4)',
    'ferry': 'rgba(0, 122, 255, 0.4)',
    'pier': 'rgba(0, 199, 190, 0.3)',
    'boat_board': 'rgba(52, 199, 89, 0.4)',
    
    // Car/Taxi
    'taxi': 'rgba(255, 204, 0, 0.4)',
    'car': 'rgba(255, 204, 0, 0.4)',
    'grab': 'rgba(0, 176, 80, 0.4)',
    'pickup': 'rgba(52, 199, 89, 0.4)',
    'dropoff': 'rgba(255, 69, 58, 0.3)',
    
    // Traffic
    'traffic': 'rgba(255, 69, 58, 0.3)',
    'tollway': 'rgba(175, 82, 222, 0.3)',
    'highway': 'rgba(0, 122, 255, 0.3)',
  }
  
  return colors[action] || 'rgba(255, 255, 255, 0.15)'
}

export default {
  // Walking
  IconStart,
  IconDestination,
  IconWalk,
  IconContinue,
  IconTurnLeft,
  IconTurnRight,
  IconSlightLeft,
  IconSlightRight,
  IconUturn,
  IconCross,
  IconStairsUp,
  IconStairsDown,
  IconElevator,
  IconEscalator,
  IconLandmark,
  IconStore,
  IconPassBy,
  IconRightSide,
  IconLeftSide,
  
  // Bus
  IconBus,
  IconBusStop,
  IconBusBoard,
  IconBusAlight,
  
  // Train/BTS/MRT
  IconTrain,
  IconBTS,
  IconMRT,
  IconARL,
  IconMetro,
  IconTrainBoard,
  IconTrainAlight,
  IconTransfer,
  
  // Boat/Ferry
  IconBoat,
  IconFerry,
  IconBoatPier,
  IconBoatBoard,
  
  // Car/Taxi
  IconCar,
  IconTaxi,
  IconGrab,
  IconBolt,
  IconPickup,
  IconDropoff,
  
  // Traffic/Road
  IconTraffic,
  IconTollway,
  IconHighway,
  
  // Wait/Time
  IconWait,
  IconFrequency,
  
  // Functions
  getDirectionIcon,
  getLineColor,
}

