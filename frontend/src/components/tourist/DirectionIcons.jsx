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

// Walking person
export const IconWalk = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/>
    <path d="M10 22l2-7"/>
    <path d="M14 22l-2-7"/>
    <path d="M8 12l2-3 2 3"/>
    <path d="M16 12l-2-3"/>
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

/**
 * Get icon component by action type
 */
export function getDirectionIcon(action, size = 20) {
  const icons = {
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
    'bus_stop': IconBusStop,
    'bus': IconBusStop,
    'metro': IconMetro,
    'bts': IconMetro,
    'mrt': IconMetro,
    'station': IconMetro,
    'arrive': IconDestination,
    'destination': IconDestination,
    'pass_by': IconPassBy,
    'reference': IconPassBy,
  }
  
  const IconComponent = icons[action] || IconPassBy
  return <IconComponent size={size} />
}

/**
 * Get line color based on step type
 */
export function getLineColor(action) {
  const colors = {
    'start': 'rgba(0, 212, 255, 0.4)',
    'arrive': 'rgba(52, 199, 89, 0.4)',
    'destination': 'rgba(52, 199, 89, 0.4)',
    'turn_left': 'rgba(255, 159, 10, 0.3)',
    'turn_right': 'rgba(255, 159, 10, 0.3)',
    'stairs_up': 'rgba(175, 82, 222, 0.3)',
    'stairs_down': 'rgba(175, 82, 222, 0.3)',
    'metro': 'rgba(175, 82, 222, 0.3)',
    'bus': 'rgba(0, 122, 255, 0.3)',
  }
  
  return colors[action] || 'rgba(255, 255, 255, 0.15)'
}

export default {
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
  IconBusStop,
  IconMetro,
  IconPassBy,
  IconRightSide,
  IconLeftSide,
  getDirectionIcon,
  getLineColor,
}

