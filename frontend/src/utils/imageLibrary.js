/**
 * SMART IMAGE LIBRARY - Dynamic Asset Mapping for Thailand Tourist App
 * 
 * This utility provides automatic image assignment based on activity types/tags.
 * Images are mapped using keyword matching (case-insensitive, partial match).
 * 
 * Usage:
 *   import { getImageForType, getPlaceholderSVG } from '../utils/imageLibrary'
 *   const imageUrl = getImageForType('Temple')  // Returns temple image
 *   const imageUrl = getImageForType('Wat Arun') // Matches 'Wat' → temple image
 */

// Primary image library - curated realistic photos with silver/monochrome aesthetic
// Using Unsplash for reliable, beautiful Thailand-themed images
const IMAGE_LIBRARY = {
  // ============================================
  // TEMPLES & RELIGIOUS SITES
  // ============================================
  temple: {
    keywords: ['temple', 'wat', 'palace', 'shrine', 'buddha', 'pagoda', 'monastery', 'grand palace', 'emerald'],
    color: '#D4AF37',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)',
    // Thai temple - golden spires
    images: [
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // BEACHES & ISLANDS
  // ============================================
  beach: {
    keywords: ['beach', 'island', 'sea', 'ocean', 'coast', 'bay', 'phi phi', 'phuket', 'krabi', 'koh', 'samui', 'coral', 'sand'],
    color: '#00CED1',
    gradient: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
    // Thai beaches - crystal clear waters
    images: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // FOOD & DINING
  // ============================================
  food: {
    keywords: ['restaurant', 'food', 'dining', 'lunch', 'dinner', 'breakfast', 'cafe', 'coffee', 'street food', 'rooftop', 'bar', 'thai food', 'pad thai', 'tom yum'],
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #CC4400 100%)',
    // Thai food - street food and cuisine
    images: [
      'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // SHOPPING & MARKETS
  // ============================================
  shopping: {
    keywords: ['market', 'shopping', 'mall', 'bazaar', 'chatuchak', 'night market', 'floating market', 'weekend market', 'store', 'shop'],
    color: '#9B59B6',
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #6C3483 100%)',
    // Thai markets - vibrant stalls
    images: [
      'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // NATURE & OUTDOORS
  // ============================================
  nature: {
    keywords: ['nature', 'park', 'garden', 'mountain', 'waterfall', 'jungle', 'forest', 'national park', 'doi', 'hill', 'viewpoint', 'sunset', 'sunrise', 'trek', 'hike'],
    color: '#27AE60',
    gradient: 'linear-gradient(135deg, #27AE60 0%, #1E8449 100%)',
    // Thai nature - lush greenery
    images: [
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // ACCOMMODATION
  // ============================================
  hotel: {
    keywords: ['hotel', 'resort', 'hostel', 'accommodation', 'check-in', 'check-out', 'stay', 'room', 'villa', 'guesthouse'],
    color: '#3498DB',
    gradient: 'linear-gradient(135deg, #3498DB 0%, #2471A3 100%)',
    // Luxury Thai hotels
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // TRANSPORT & TRANSIT
  // ============================================
  transport: {
    keywords: ['airport', 'station', 'transfer', 'train', 'metro', 'bts', 'mrt', 'taxi', 'boat', 'ferry', 'bus', 'van', 'flight', 'departure', 'arrival'],
    color: '#34495E',
    gradient: 'linear-gradient(135deg, #34495E 0%, #1C2833 100%)',
    // Transport in Thailand
    images: [
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // CULTURE & MUSEUMS
  // ============================================
  culture: {
    keywords: ['museum', 'art', 'gallery', 'culture', 'history', 'heritage', 'traditional', 'exhibition', 'jim thompson'],
    color: '#8E44AD',
    gradient: 'linear-gradient(135deg, #8E44AD 0%, #5B2C6F 100%)',
    // Thai culture and museums
    images: [
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583225214464-9296029427aa?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // WELLNESS & SPA
  // ============================================
  wellness: {
    keywords: ['massage', 'spa', 'wellness', 'relax', 'thai massage', 'yoga', 'meditation', 'health'],
    color: '#1ABC9C',
    gradient: 'linear-gradient(135deg, #1ABC9C 0%, #148F77 100%)',
    // Thai massage and spa
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // ENTERTAINMENT & NIGHTLIFE
  // ============================================
  entertainment: {
    keywords: ['show', 'entertainment', 'performance', 'nightlife', 'club', 'cabaret', 'muay thai', 'boxing', 'concert', 'cinema'],
    color: '#E74C3C',
    gradient: 'linear-gradient(135deg, #E74C3C 0%, #922B21 100%)',
    // Thai entertainment
    images: [
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // WATER ACTIVITIES
  // ============================================
  water: {
    keywords: ['snorkel', 'diving', 'kayak', 'cruise', 'swimming', 'pool', 'waterpark', 'speedboat', 'longtail'],
    color: '#2980B9',
    gradient: 'linear-gradient(135deg, #2980B9 0%, #1A5276 100%)',
    // Water activities in Thailand
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // WILDLIFE & ANIMALS
  // ============================================
  wildlife: {
    keywords: ['elephant', 'safari', 'wildlife', 'zoo', 'animal', 'sanctuary', 'aquarium', 'tiger'],
    color: '#D35400',
    gradient: 'linear-gradient(135deg, #D35400 0%, #873600 100%)',
    // Thai elephants and wildlife
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=400&h=300&fit=crop&auto=format',
    ],
  },
  
  // ============================================
  // TOURS & ACTIVITIES
  // ============================================
  tour: {
    keywords: ['tour', 'excursion', 'day trip', 'adventure', 'activity', 'experience', 'guided'],
    color: '#16A085',
    gradient: 'linear-gradient(135deg, #16A085 0%, #0E6655 100%)',
    // Tour activities
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1476673160081-cf065bc4cf87?w=400&h=300&fit=crop&auto=format',
    ],
  },
}

// SVG placeholder generators for each category
const SVG_ICONS = {
  temple: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#temple)"/>
    <defs><linearGradient id="temple" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#D4AF37"/><stop offset="1" stop-color="#8B6914"/></linearGradient></defs>
    <path d="M60 20L30 50H90L60 20Z" fill="rgba(255,255,255,0.9)"/>
    <path d="M60 35L40 55H80L60 35Z" fill="rgba(255,255,255,0.7)"/>
    <rect x="35" y="50" width="50" height="50" fill="rgba(255,255,255,0.8)"/>
    <rect x="50" y="70" width="20" height="30" fill="rgba(139,105,20,0.6)"/>
  </svg>`,
  
  beach: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#beach)"/>
    <defs><linearGradient id="beach" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#00CED1"/><stop offset="1" stop-color="#008B8B"/></linearGradient></defs>
    <circle cx="90" cy="30" r="15" fill="rgba(255,220,100,0.9)"/>
    <path d="M0 70Q30 60 60 70T120 70V120H0Z" fill="rgba(255,255,255,0.3)"/>
    <path d="M0 80Q30 70 60 80T120 80V120H0Z" fill="rgba(255,220,150,0.8)"/>
    <ellipse cx="80" cy="50" rx="15" ry="8" fill="rgba(255,255,255,0.4)"/>
  </svg>`,
  
  food: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#food)"/>
    <defs><linearGradient id="food" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#FF6B35"/><stop offset="1" stop-color="#CC4400"/></linearGradient></defs>
    <ellipse cx="60" cy="70" rx="35" ry="20" fill="rgba(255,255,255,0.9)"/>
    <ellipse cx="60" cy="65" rx="30" ry="15" fill="rgba(255,255,255,0.7)"/>
    <circle cx="50" cy="60" r="8" fill="rgba(200,80,50,0.7)"/>
    <circle cx="70" cy="58" r="6" fill="rgba(100,180,100,0.7)"/>
    <circle cx="60" cy="68" r="5" fill="rgba(255,200,100,0.7)"/>
  </svg>`,
  
  shopping: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#shopping)"/>
    <defs><linearGradient id="shopping" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#9B59B6"/><stop offset="1" stop-color="#6C3483"/></linearGradient></defs>
    <path d="M40 45H80L85 95H35L40 45Z" fill="rgba(255,255,255,0.9)"/>
    <path d="M45 45V35C45 27 52 20 60 20C68 20 75 27 75 35V45" stroke="rgba(255,255,255,0.7)" stroke-width="4" fill="none"/>
    <circle cx="50" cy="65" r="5" fill="rgba(155,89,182,0.5)"/>
    <circle cx="70" cy="70" r="4" fill="rgba(155,89,182,0.4)"/>
  </svg>`,
  
  nature: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#nature)"/>
    <defs><linearGradient id="nature" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#27AE60"/><stop offset="1" stop-color="#1E8449"/></linearGradient></defs>
    <path d="M60 25L30 70H90L60 25Z" fill="rgba(255,255,255,0.8)"/>
    <path d="M60 40L40 75H80L60 40Z" fill="rgba(255,255,255,0.6)"/>
    <rect x="55" y="70" width="10" height="25" fill="rgba(139,90,43,0.7)"/>
    <path d="M20 100L40 60L60 85L80 55L100 100Z" fill="rgba(255,255,255,0.3)"/>
  </svg>`,
  
  hotel: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#hotel)"/>
    <defs><linearGradient id="hotel" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#3498DB"/><stop offset="1" stop-color="#2471A3"/></linearGradient></defs>
    <rect x="30" y="40" width="60" height="55" fill="rgba(255,255,255,0.9)"/>
    <rect x="50" y="75" width="20" height="20" fill="rgba(52,152,219,0.5)"/>
    <rect x="35" y="50" width="15" height="12" fill="rgba(255,220,100,0.6)"/>
    <rect x="55" y="50" width="15" height="12" fill="rgba(255,220,100,0.6)"/>
    <rect x="70" y="50" width="15" height="12" fill="rgba(255,220,100,0.6)"/>
    <rect x="35" y="65" width="15" height="12" fill="rgba(255,220,100,0.4)"/>
    <rect x="70" y="65" width="15" height="12" fill="rgba(255,220,100,0.4)"/>
  </svg>`,
  
  transport: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#transport)"/>
    <defs><linearGradient id="transport" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#34495E"/><stop offset="1" stop-color="#1C2833"/></linearGradient></defs>
    <ellipse cx="60" cy="75" rx="40" ry="15" fill="rgba(255,255,255,0.2)"/>
    <path d="M30 55L60 30L90 55V70H30V55Z" fill="rgba(255,255,255,0.9)"/>
    <rect x="40" y="70" width="40" height="15" fill="rgba(255,255,255,0.8)"/>
    <circle cx="45" cy="85" r="8" fill="rgba(50,50,50,0.8)"/>
    <circle cx="75" cy="85" r="8" fill="rgba(50,50,50,0.8)"/>
  </svg>`,
  
  culture: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#culture)"/>
    <defs><linearGradient id="culture" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#8E44AD"/><stop offset="1" stop-color="#5B2C6F"/></linearGradient></defs>
    <rect x="25" y="40" width="70" height="50" fill="rgba(255,255,255,0.9)"/>
    <rect x="35" y="50" width="20" height="25" fill="rgba(142,68,173,0.4)"/>
    <rect x="65" y="50" width="20" height="25" fill="rgba(142,68,173,0.3)"/>
    <path d="M25 40L60 25L95 40" stroke="rgba(255,255,255,0.7)" stroke-width="4"/>
  </svg>`,
  
  wellness: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#wellness)"/>
    <defs><linearGradient id="wellness" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#1ABC9C"/><stop offset="1" stop-color="#148F77"/></linearGradient></defs>
    <circle cx="60" cy="55" r="25" fill="rgba(255,255,255,0.9)"/>
    <path d="M50 50C50 45 55 40 60 40C65 40 70 45 70 50" stroke="rgba(26,188,156,0.6)" stroke-width="3" fill="none"/>
    <path d="M45 60C45 70 52 80 60 80C68 80 75 70 75 60" stroke="rgba(26,188,156,0.6)" stroke-width="3" fill="none"/>
    <ellipse cx="60" cy="90" rx="20" ry="8" fill="rgba(255,255,255,0.4)"/>
  </svg>`,
  
  entertainment: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#entertainment)"/>
    <defs><linearGradient id="entertainment" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#E74C3C"/><stop offset="1" stop-color="#922B21"/></linearGradient></defs>
    <circle cx="60" cy="60" r="30" fill="rgba(255,255,255,0.9)"/>
    <path d="M50 45L75 60L50 75Z" fill="rgba(231,76,60,0.8)"/>
  </svg>`,
  
  water: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#water)"/>
    <defs><linearGradient id="water" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#2980B9"/><stop offset="1" stop-color="#1A5276"/></linearGradient></defs>
    <path d="M20 60Q40 50 60 60T100 60" stroke="rgba(255,255,255,0.8)" stroke-width="4" fill="none"/>
    <path d="M20 75Q40 65 60 75T100 75" stroke="rgba(255,255,255,0.6)" stroke-width="3" fill="none"/>
    <path d="M20 88Q40 78 60 88T100 88" stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="none"/>
    <circle cx="60" cy="40" r="12" fill="rgba(255,255,255,0.7)"/>
  </svg>`,
  
  wildlife: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#wildlife)"/>
    <defs><linearGradient id="wildlife" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#D35400"/><stop offset="1" stop-color="#873600"/></linearGradient></defs>
    <ellipse cx="60" cy="60" rx="35" ry="25" fill="rgba(255,255,255,0.9)"/>
    <circle cx="45" cy="55" r="5" fill="rgba(50,50,50,0.7)"/>
    <circle cx="75" cy="55" r="5" fill="rgba(50,50,50,0.7)"/>
    <ellipse cx="60" cy="70" rx="8" ry="5" fill="rgba(211,84,0,0.5)"/>
    <path d="M30 45Q35 30 45 35" stroke="rgba(255,255,255,0.7)" stroke-width="6" fill="none"/>
    <path d="M90 45Q85 30 75 35" stroke="rgba(255,255,255,0.7)" stroke-width="6" fill="none"/>
  </svg>`,
  
  tour: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#tour)"/>
    <defs><linearGradient id="tour" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#16A085"/><stop offset="1" stop-color="#0E6655"/></linearGradient></defs>
    <circle cx="60" cy="50" r="20" fill="rgba(255,255,255,0.9)"/>
    <path d="M60 35V50L70 55" stroke="rgba(22,160,133,0.7)" stroke-width="3" fill="none"/>
    <path d="M40 80L60 70L80 80L60 95Z" fill="rgba(255,255,255,0.8)"/>
  </svg>`,
  
  default: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="url(#default)"/>
    <defs><linearGradient id="default" x1="0" y1="0" x2="120" y2="120"><stop stop-color="#95A5A6"/><stop offset="1" stop-color="#7F8C8D"/></linearGradient></defs>
    <circle cx="60" cy="50" r="20" fill="rgba(255,255,255,0.8)"/>
    <path d="M40 85H80" stroke="rgba(255,255,255,0.6)" stroke-width="4"/>
    <path d="M35 95H85" stroke="rgba(255,255,255,0.4)" stroke-width="3"/>
  </svg>`,
}

/**
 * Get the category key for a given type string
 * @param {string} type - Activity type or name (e.g., "Temple", "Wat Arun", "Beach Day")
 * @returns {string} - Category key (e.g., "temple", "beach")
 */
export function getCategoryForType(type) {
  if (!type) return 'default'
  
  const typeLower = type.toLowerCase()
  
  for (const [category, config] of Object.entries(IMAGE_LIBRARY)) {
    for (const keyword of config.keywords) {
      if (typeLower.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }
  
  return 'default'
}

/**
 * Get a placeholder SVG data URL for a given type
 * @param {string} type - Activity type or name
 * @returns {string} - Data URL for SVG placeholder
 */
export function getPlaceholderSVG(type) {
  const category = getCategoryForType(type)
  const svg = SVG_ICONS[category] || SVG_ICONS.default
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Get the gradient for a given type
 * @param {string} type - Activity type or name
 * @returns {string} - CSS gradient string
 */
export function getGradientForType(type) {
  const category = getCategoryForType(type)
  return IMAGE_LIBRARY[category]?.gradient || IMAGE_LIBRARY.default?.gradient || 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)'
}

/**
 * Get the primary color for a given type
 * @param {string} type - Activity type or name
 * @returns {string} - Hex color string
 */
export function getColorForType(type) {
  const category = getCategoryForType(type)
  return IMAGE_LIBRARY[category]?.color || '#95A5A6'
}

/**
 * MAIN FUNCTION: Get image URL for a given type
 * Returns a realistic photo URL that matches the activity type
 * Falls back to SVG placeholder if no image available
 * 
 * @param {string} type - Activity type or name (e.g., "Temple", "Wat Arun", "Beach")
 * @returns {string} - Image URL (Unsplash photo or SVG data URL)
 */
export function getImageForType(type) {
  const category = getCategoryForType(type)
  const config = IMAGE_LIBRARY[category]
  
  // Return a random image from the category's image array
  if (config?.images && config.images.length > 0) {
    // Use a deterministic selection based on the type string for consistency
    const hash = type ? type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0
    const index = hash % config.images.length
    return config.images[index]
  }
  
  // Fallback to SVG placeholder
  return getPlaceholderSVG(type)
}

/**
 * Export the full library config for advanced usage
 */
export const IMAGE_CATEGORIES = Object.keys(IMAGE_LIBRARY)

export default {
  getImageForType,
  getPlaceholderSVG,
  getGradientForType,
  getColorForType,
  getCategoryForType,
  IMAGE_CATEGORIES,
}


