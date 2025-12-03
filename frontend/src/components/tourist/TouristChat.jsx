import React, { useState, useEffect, useRef } from 'react'
import { useTouristApp } from '../../contexts/TouristAppContext'
import WalkingDirections from './WalkingDirections'
import './TouristChat.css'

// Available offers - CP Group brands only (Thailand)
// CP Group: 7-Eleven, Chester's, True, Five Star, CP Fresh, Lotus's, All Cafe
const OFFERS = {
  '7eleven-coffee': {
    id: '7eleven-coffee',
    brand: '7-Eleven',
    title: 'Free All Cafe Coffee',
    description: 'Any Americano, Latte or Cappuccino - hot or iced! Free with ฿50+ spend',
    cost: 30,
    type: 'coins',
    color: '#00843D',
    gradient: 'linear-gradient(135deg, #00843D 0%, #005A2B 100%)',
    locations: '13,000+ stores across Thailand'
  },
  '7eleven-snack': {
    id: '7eleven-snack',
    brand: '7-Eleven',
    title: 'Snack Bundle',
    description: 'Free drink + snack combo. Perfect for day trips!',
    cost: 0,
    type: 'free',
    color: '#00843D',
    gradient: 'linear-gradient(135deg, #00995C 0%, #006B3F 100%)',
    locations: 'Every corner in Bangkok'
  },
  '7eleven-readymeals': {
    id: '7eleven-readymeals',
    brand: '7-Eleven',
    title: 'Ready Meal Deal',
    description: 'Buy 2 CP ready meals, get 1 free. Fresh & delicious!',
    cost: 20,
    type: 'coins',
    color: '#00843D',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
    locations: '24/7 availability'
  },
  'chesters': {
    id: 'chesters',
    brand: "Chester's Grill",
    title: 'Free Meal Upgrade',
    description: 'Upgrade to large set with extra chicken - free!',
    cost: 0,
    type: 'free',
    color: '#FF6B00',
    gradient: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
    locations: '500+ locations including malls & airports'
  },
  'fivestar': {
    id: 'fivestar',
    brand: 'Five Star Chicken',
    title: 'Family Bucket Deal',
    description: '8pc chicken bucket + 2 sides for price of 6pc',
    cost: 50,
    type: 'coins',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
    locations: 'Major malls & transit hubs'
  },
  'cpfresh': {
    id: 'cpfresh',
    brand: 'CP Fresh Mart',
    title: '20% Off Fresh Produce',
    description: 'Discount on fruits, vegetables & CP meats',
    cost: 35,
    type: 'coins',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    locations: 'Premium supermarket chain'
  },
  'lotus': {
    id: 'lotus',
    brand: "Lotus's",
    title: '฿100 Shopping Voucher',
    description: 'Spend ฿500+, get ฿100 off. Thailand\'s largest hypermarket',
    cost: 60,
    type: 'coins',
    color: '#00BCD4',
    gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
    locations: '2,000+ stores nationwide'
  },
  'true-data': {
    id: 'true-data',
    brand: 'True Mobile',
    title: '1GB Data Bonus',
    description: 'Extra 1GB 5G data for 24 hours. Stream & navigate freely!',
    cost: 25,
    type: 'coins',
    color: '#E31937',
    gradient: 'linear-gradient(135deg, #E31937 0%, #B31429 100%)',
    locations: 'Works everywhere with True coverage'
  },
  'truemoney': {
    id: 'truemoney',
    brand: 'True Money',
    title: '฿50 Cashback',
    description: '฿50 back on first payment. Use at street vendors & markets!',
    cost: 0,
    type: 'free',
    color: '#FF6F00',
    gradient: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
    locations: 'Accepted at 100,000+ merchants'
  },
  'truevisions': {
    id: 'truevisions',
    brand: 'True ID',
    title: 'Free Premium Content',
    description: '7 days of True ID Premium - movies, series, live sports',
    cost: 40,
    type: 'coins',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
    locations: 'Stream anywhere in Thailand'
  },
  'airport-fasttrack': {
    id: 'airport-fasttrack',
    brand: 'True Tourist',
    title: 'Airport Fast Track',
    description: 'Skip immigration queues at BKK & DMK. True SIM exclusive!',
    cost: 100,
    type: 'coins',
    color: '#003D7C',
    gradient: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
    locations: 'Suvarnabhumi & Don Mueang airports'
  }
}

function TouristChat({ 
  onEnd, 
  peerConnectionRef, 
  dataChannelRef, 
  audioElementRef,
  isAgentConnected,
  setIsAgentConnected,
  isRecording,
  setIsRecording
}) {
  const { state, onVoiceIntent } = useTouristApp()
  const [messages, setMessages] = useState([])
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const pendingUserTranscript = useRef(null)
  const pendingAIResponse = useRef(null)
  const pendingVisuals = useRef([]) // Queue for offers, maps, directions - shown AFTER AI response
  const handleRealtimeEventRef = useRef(null)
  const messagesEndRef = useRef(null)
  const videoRef = useRef(null)
  
  const isConnected = isAgentConnected

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Sync camera stream
  useEffect(() => {
    if (showCameraPreview && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(console.error)
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }
    }
  }, [showCameraPreview, cameraStream])

  // Re-attach dataChannel listener
  useEffect(() => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      const messageHandler = (e) => {
        const event = JSON.parse(e.data)
        if (handleRealtimeEventRef.current) {
          handleRealtimeEventRef.current(event)
        }
      }
      dataChannelRef.current.addEventListener('message', messageHandler)
      return () => {
        if (dataChannelRef.current) {
          dataChannelRef.current.removeEventListener('message', messageHandler)
        }
      }
    }
  }, [])

  const initializeVoiceConnection = async () => {
    // Guard against double initialization
    if (peerConnectionRef.current && 
        (peerConnectionRef.current.connectionState === 'connected' || 
         peerConnectionRef.current.connectionState === 'connecting')) {
      console.log('⚠️ Voice connection already active, skipping initialization')
      return
    }
    
    try {
      console.log('🎤 Initializing Tourist Voice Assistant...')
      
      const tokenRes = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Tourist ONE, a friendly and helpful voice assistant for tourists visiting Thailand.

**Your Personality:**
- Warm, welcoming, enthusiastic about Thailand
- Quick and helpful - tourists are exploring
- Knowledgeable about Thai culture, places, food

**What you can help with:**
1. **Navigation** - Help users navigate the app screens
2. **Translation** - Translate between English and Thai
3. **Recommendations** - Suggest places, food, experiences
4. **Itinerary Building** - Create step-by-step travel plans
5. **Camera/Photos** - Take photos and analyze what they see

**FUNCTION CALLING - Use these functions:**

Navigation:
- "go home" → navigate_home()
- "explore", "offers" → navigate_explore()
- "itinerary", "my plan" → navigate_itinerary()
- "translate" → navigate_translate()
- "stores", "7-eleven" → navigate_stores()
- "coins", "rewards" → navigate_loyalty()

Voice Control:
- "pause", "stop talking", "be quiet", "mute" → pause_voice() - IMMEDIATELY pause and stop talking
- When user says pause, STOP talking immediately and call pause_voice()

Photos & Visual Recognition:
- "what is this", "take a photo", "look at this", "where am I" → take_photo()
- When analyzing photos, IDENTIFY landmarks, buildings, temples, signs
- If you recognize a famous place (temple, palace, market), tell user WHERE it is and offer to show directions
- If photo shows Thai text/signs, translate them
- If photo shows a product, explain what it is and where to buy it

**ITINERARY BUILDING - IMPORTANT:**
When user asks to "plan my trip", "create an itinerary", "what should I do in Bangkok":

1. **USE WEB SEARCH** to find REAL, current information about:
   - Actual places with real prices, opening hours
   - Current transport options (BTS, MRT, boat, bus routes)
   - Real restaurant recommendations
   - Actual hotel prices

2. Call start_building_itinerary() FIRST
3. For EACH activity, call add_itinerary_step() with REAL data from your search:
   - name: Real place name (e.g., "Grand Palace", "Chatuchak Market")
   - description: Actual description from web
   - type: Category (Temple, Beach, Market, Restaurant, Museum, Hotel, Airport, Massage, Tour, etc.)
   - duration: Real estimated time
   - price: Actual current price in THB
4. Call finish_building_itinerary() when done
5. Ask: "Would you like me to book any of these?"

**TYPES for images** (use these exact types):
Temple, Beach, Island, Restaurant, Street Food, Cafe, Market, Night Market, Mall, Museum, Art, Hotel, Resort, Airport, Tour, Floating Market, Massage, Spa, Park, Show

Example with REAL web search data:
User: "Plan a 2-day trip to Bangkok"
→ Search web for "best things to do Bangkok 2024", "Bangkok temple prices", "BTS routes"
→ start_building_itinerary(destination: "Bangkok", days: 2)
→ add_itinerary_step(day: 0, slot: "morning", name: "Grand Palace", description: "Former royal residence featuring Wat Phra Kaew", type: "Temple", duration: "3 hours", price: "500 THB")
→ add_itinerary_step(day: 0, slot: "afternoon", name: "Wat Pho", description: "Temple of the Reclining Buddha, 46 meters long", type: "Temple", duration: "2 hours", price: "200 THB")
→ ... more REAL activities
→ finish_building_itinerary()

**CONTEXTUAL OFFERS - CP Group Benefits - CRITICAL:**
The tourist has offers from CP Group (Thailand's largest conglomerate).

⚠️ MANDATORY RULE: When user mentions ANY of these keywords, you MUST:
1. Suggest a nearby 7-Eleven or CP Group store
2. IMMEDIATELY call show_offer() with the relevant offer ID
3. Say something like "By the way, here's a voucher for you!"

TRIGGER KEYWORDS → OFFER:
- water, drink, thirsty, hot → show_offer("7eleven-coffee") - includes water & drinks
- coffee, caffeine, tired, wake up → show_offer("7eleven-coffee")
- snack, hungry, walking, day trip → show_offer("7eleven-snack")
- lunch, dinner, meal, eat, food → show_offer("chesters") or show_offer("7eleven-readymeals")
- chicken, fried → show_offer("fivestar")
- groceries, supermarket, shopping → show_offer("lotus")
- fresh, produce, meat → show_offer("cpfresh")
- data, internet, wifi, maps, navigate → show_offer("true-data")
- pay, payment, street food, vendor → show_offer("truemoney")
- movie, stream, entertainment, bored → show_offer("truevisions")
- airport, flight, leaving, immigration → show_offer("airport-fasttrack")

CP GROUP BRANDS & OFFER IDS:
📍 7-ELEVEN (CP ALL - 13,000+ stores):
- "7eleven-coffee" - Free All Cafe Coffee (30 coins) - ANY drink including water, coffee, tea
- "7eleven-snack" - Snack Bundle (FREE) - day trips, walking
- "7eleven-readymeals" - Ready Meal Deal (20 coins) - quick lunch/dinner

🍗 CHESTER'S GRILL (CP Foods):
- "chesters" - Free Meal Upgrade (FREE) - Thai-style grilled chicken

🐔 FIVE STAR CHICKEN (CP Foods):
- "fivestar" - Family Bucket Deal (50 coins) - fried chicken, groups

🛒 RETAIL:
- "cpfresh" - CP Fresh Mart 20% Off (35 coins) - fresh food, groceries
- "lotus" - Lotus's ฿100 Voucher (60 coins) - hypermarket shopping

📱 TRUE CORPORATION:
- "true-data" - 1GB Data Bonus (25 coins) - streaming, maps, navigation
- "truemoney" - ฿50 Cashback (FREE) - street food, markets, vendors
- "truevisions" - True ID Premium (40 coins) - streaming entertainment

✈️ TRAVEL:
- "airport-fasttrack" - Airport Fast Track (100 coins) - skip immigration

**⚠️ NEVER FORGET:** When ANY trigger keyword is mentioned, ALWAYS call show_offer() FIRST, then provide your helpful response. The voucher card MUST appear!

Example responses:
User: "I need water" → "There's a 7-Eleven just 50 meters away! And hey, here's a voucher for you!" + show_offer("7eleven-coffee")
User: "I want coffee" → "Perfect! 7-Eleven has great All Cafe coffee. Here's a free voucher!" + show_offer("7eleven-coffee")
User: "I'm hungry" → "Chester's Grill is nearby - delicious Thai grilled chicken! Here's a special offer:" + show_offer("chesters")
User: "Need something to eat" → "Let me show you a great deal at 7-Eleven!" + show_offer("7eleven-readymeals")
User: "Going to the market" → "For street food payments, use TrueMoney! Here's cashback for you:" + show_offer("truemoney")

**VISUAL DIRECTIONS - USE THESE TOOLS:**
Always use these tools for step-by-step directions - visual paths are better than text!

**1. WALKING (show_walking_directions):**
For walks under 10-15 min. Actions: start, walk, continue, turn_left, turn_right, cross, stairs_up, stairs_down, elevator, landmark, arrive
Example: { instruction: "Turn right onto Rama IV", action: "turn_right", road: "Rama IV Road", duration: "3 min" }

**2. BUS (show_bus_directions):**
For bus routes. Include bus_number and fare. Actions: start, walk, bus_stop, bus_board, bus, bus_alight, transfer, arrive
Bangkok buses: A1/A2 (Airport-Mo Chit), 73 (Silom-Khao San), 507 (Victory Monument loop)
Example: { instruction: "Board Bus A1 to Mo Chit", action: "bus_board", bus_number: "A1", stops_count: 5, duration: "25 min" }

**3. TRAIN (show_train_directions):**
For BTS/MRT/ARL. Actions: start, walk, bts, mrt, arl, train_board, train_alight, transfer, arrive
BTS lines (green #5EC24D): Sukhumvit (Mo Chit↔Kheha), Silom (National Stadium↔Bang Wa)
MRT Blue (#0066B3): Hua Lamphong↔Tao Poon (loop via Chatuchak)
Airport Rail Link (#E31937): Phaya Thai↔Suvarnabhumi
Example: { instruction: "Board BTS towards Kheha", action: "train_board", line: "BTS Sukhumvit", line_color: "#5EC24D", direction: "Kheha", station: "Siam" }

**4. BOAT (show_boat_directions):**
For Chao Phraya boats/ferries. Actions: start, walk, pier, boat_board, boat, exit_boat, ferry, arrive
Piers: Sathorn (S), Tha Tien (N8), Wat Arun, Phra Arthit (N13), Nonthaburi
Flags: Orange (all stops ฿15), Yellow (express ฿29), Green (limited), Tourist Blue (฿60)
Example: { instruction: "Take Orange Flag boat north", action: "boat_board", pier_name: "Sathorn", pier_code: "S", boat_flag: "Orange", duration: "30 min" }

**5. TAXI/GRAB (show_taxi_directions):**
For taxi/rideshare. Actions: start, walk, pickup, taxi, grab, traffic, tollway, highway, dropoff, arrive
Include estimated_fare and traffic notes. Tollways cost extra (฿25-75 per toll).
Example: { instruction: "Take expressway via Chalerm Maha Nakhon", action: "tollway", toll_cost: "฿50", duration: "15 min" }

**MAPS & COORDINATES:**
For overview maps, use show_map(). Common locations:
- Lumpini Park: 13.7309, 100.5415
- Grand Palace: 13.7500, 100.4914
- Wat Arun: 13.7437, 100.4888
- Chatuchak Market: 13.7999, 100.5503
- Siam Paragon: 13.7462, 100.5347
- MBK Center: 13.7449, 100.5297
- Khao San Road: 13.7588, 100.4974
- MBK Center: 13.7449, 100.5297
- Chinatown (Yaowarat): 13.7394, 100.5095

Example: User asks "How do I get from Siam to Grand Palace?"
   → show_map(origin_lat: 13.7462, origin_lng: 100.5347, origin_name: "Siam Paragon", dest_lat: 13.7500, dest_lng: 100.4914, dest_name: "Grand Palace", transport: "transit")

**CURRENCY CONVERSION:**
When user asks "how much is X baht", "convert THB to USD", or any currency question:
Call show_currency() with CURRENT exchange rates (look them up!):

Common rates (approximate - USE WEB SEARCH for current rates):
- 1 THB ≈ 0.028 USD, 0.026 EUR, 0.022 GBP, 0.038 SGD, 0.025 CHF, 4.2 JPY, 0.20 CNY

Example: User asks "How much is 1000 baht in Swiss Francs?"
→ show_currency(amount: 1000, from_currency: "THB", to_currency: "CHF", rate: 0.025)

**BTS/MRT TRAIN ROUTES:**
When user asks about trains, metro, BTS, MRT, or getting somewhere by train:
Call show_transport() with route info:

BTS Lines (green #5EC24D):
- Sukhumvit Line: Mo Chit ↔ Kheha (via Siam, Asok, Phrom Phong)
- Silom Line: National Stadium ↔ Bang Wa (via Siam, Sala Daeng, Saphan Taksin)

MRT Lines:
- Blue Line (#0066B3): Hua Lamphong ↔ Tao Poon (loop via Sukhumvit, Silom, Chinatown)
- Purple Line (#800080): Tao Poon ↔ Khlong Bang Phai

Airport Rail Link (red #E31937):
- Phaya Thai ↔ Suvarnabhumi Airport (via Makkasan)

Example: User asks "How do I get from Siam to the airport?"
→ show_transport(line: "Airport Rail Link", line_color: "#E31937", from_station: "Phaya Thai", to_station: "Suvarnabhumi Airport", stations_count: 6, duration: "30 mins", fare: "฿45", direction: "Suvarnabhumi")

**ATM FINDER:**
When user asks about ATMs, cash, or withdrawing money:
Call show_atm() with bank info:

Thai Banks (all charge ฿220 for foreign cards):
- Bangkok Bank (blue #1a5f9e) - most widespread
- Kasikorn Bank (green #138f2d) - good for tourists
- SCB (purple #4e2a84) - many locations
- Krungsri (yellow #ffc20e) - Ayutthaya Bank

Tips to include:
- "Decline 'conversion' option to get better rate"
- "Choose 'credit' for debit cards"
- "Max withdrawal usually ฿20,000-30,000"

Example: User asks "Where can I get cash near MBK?"
→ show_atm(bank_name: "Bangkok Bank", bank_color: "#1a5f9e", location: "MBK Center, Ground Floor", fee: "฿220", latitude: 13.7449, longitude: 100.5297, has_exchange: true, tip: "Decline conversion option for best rate!")

Be conversational, enthusiastic about Thailand, and always helpful!`,
          tools: [
            {
              type: 'function',
              name: 'pause_voice',
              description: 'Pause the voice assistant immediately. Use when user says "pause", "stop", "mute", "be quiet", or wants you to stop talking.',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_home',
              description: 'Navigate to the home screen',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_explore',
              description: 'Navigate to explore Thailand screen to find places and attractions',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_itinerary',
              description: 'Navigate to the itinerary/trip planning screen',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_translate',
              description: 'Navigate to the live translation screen',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_stores',
              description: 'Navigate to stores and offers screen',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'navigate_loyalty',
              description: 'Navigate to TrueCoins loyalty hub',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'take_photo',
              description: 'Take a photo and analyze what the camera sees. Use for: "what is this", "where am I", "take a photo", "look at this", "translate this sign", "identify this building". Will identify landmarks, translate Thai text, and provide location info.',
              parameters: { 
                type: 'object', 
                properties: {
                  prompt: {
                    type: 'string',
                    description: 'What to analyze (e.g., "identify this landmark and tell me where it is", "translate the Thai text", "what food is this")'
                  }
                }
              }
            },
            {
              type: 'function',
              name: 'translate_text',
              description: 'Translate text between English and Thai',
              parameters: {
                type: 'object',
                properties: {
                  text: { type: 'string', description: 'Text to translate' },
                  from_lang: { type: 'string', description: 'Source language (en or th)' },
                  to_lang: { type: 'string', description: 'Target language (en or th)' }
                },
                required: ['text']
              }
            },
            {
              type: 'function',
              name: 'open_camera',
              description: 'Open camera preview for live view',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'start_building_itinerary',
              description: 'Start building a new itinerary. Call this FIRST when user asks to plan a trip.',
              parameters: { 
                type: 'object', 
                properties: {
                  destination: { type: 'string', description: 'City or area (e.g., Bangkok, Phuket)' },
                  days: { type: 'number', description: 'Number of days for the trip' }
                }
              }
            },
            {
              type: 'function',
              name: 'add_itinerary_step',
              description: 'Add one activity/place to the itinerary. Call this for EACH activity after start_building_itinerary.',
              parameters: { 
                type: 'object', 
                properties: {
                  day: { type: 'number', description: 'Day number (0 = Day 1, 1 = Day 2, etc.)' },
                  slot: { type: 'string', description: 'Time slot: morning, afternoon, or evening' },
                  name: { type: 'string', description: 'Name of the place or activity' },
                  description: { type: 'string', description: 'Brief description' },
                  type: { type: 'string', description: 'Type: Temple, Beach, Market, Restaurant, etc.' },
                  duration: { type: 'string', description: 'Estimated duration (e.g., 2 hours)' },
                  price: { type: 'string', description: 'Approximate cost (e.g., 500 THB or Free)' }
                },
                required: ['day', 'slot', 'name']
              }
            },
            {
              type: 'function',
              name: 'finish_building_itinerary',
              description: 'Complete the itinerary building. Call this AFTER adding all steps.',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'clear_itinerary',
              description: 'Clear the current itinerary to start fresh',
              parameters: { type: 'object', properties: {} }
            },
            {
              type: 'function',
              name: 'show_offer',
              description: 'ALWAYS display offer card when mentioning CP Group brands (7-Eleven, Chester\'s, Five Star, True, Lotus\'s). Call this immediately after mentioning any offer!',
              parameters: { 
                type: 'object', 
                properties: {
                  offer_id: { 
                    type: 'string', 
                    description: 'CP Group offer IDs: 7eleven-coffee, 7eleven-snack, 7eleven-readymeals, chesters, fivestar, cpfresh, lotus, true-data, truemoney, truevisions, airport-fasttrack'
                  }
                },
                required: ['offer_id']
              }
            },
            {
              type: 'function',
              name: 'show_map',
              description: 'Display an interactive map with directions from origin to destination. Always use when giving directions or showing how to get somewhere.',
              parameters: { 
                type: 'object', 
                properties: {
                  origin_lat: { type: 'number', description: 'Latitude of starting point (user location or current place)' },
                  origin_lng: { type: 'number', description: 'Longitude of starting point' },
                  origin_name: { type: 'string', description: 'Name of starting point (e.g., "Your location", "Lumpini Park")' },
                  dest_lat: { type: 'number', description: 'Latitude of destination' },
                  dest_lng: { type: 'number', description: 'Longitude of destination' },
                  dest_name: { type: 'string', description: 'Name of destination' },
                  transport: { type: 'string', description: 'Transport mode: walk, transit, drive. Default walk.' }
                },
                required: ['origin_lat', 'origin_lng', 'dest_lat', 'dest_lng', 'dest_name']
              }
            },
            {
              type: 'function',
              name: 'show_currency',
              description: 'Display currency conversion card. Use when user asks about money exchange, prices in their currency, or "how much is X baht".',
              parameters: { 
                type: 'object', 
                properties: {
                  amount: { type: 'number', description: 'Amount to convert' },
                  from_currency: { type: 'string', description: 'Source currency code (THB, USD, EUR, GBP, SGD, CHF, JPY, CNY, AUD)' },
                  to_currency: { type: 'string', description: 'Target currency code' },
                  rate: { type: 'number', description: 'Exchange rate (1 from_currency = X to_currency)' }
                },
                required: ['amount', 'from_currency', 'to_currency', 'rate']
              }
            },
            {
              type: 'function',
              name: 'show_transport',
              description: 'Display BTS/MRT train route card. Use when user asks about trains, metro, BTS, MRT, or how to get somewhere by train.',
              parameters: { 
                type: 'object', 
                properties: {
                  line: { type: 'string', description: 'Line name: BTS Sukhumvit (green), BTS Silom (green), MRT Blue, MRT Purple, Airport Rail Link (red)' },
                  line_color: { type: 'string', description: 'Color code: #5EC24D (BTS green), #0066B3 (MRT blue), #800080 (MRT purple), #E31937 (Airport red)' },
                  from_station: { type: 'string', description: 'Departure station name' },
                  to_station: { type: 'string', description: 'Arrival station name' },
                  stations_count: { type: 'number', description: 'Number of stations' },
                  duration: { type: 'string', description: 'Estimated travel time (e.g., "15 mins")' },
                  fare: { type: 'string', description: 'Fare in THB (e.g., "฿44")' },
                  direction: { type: 'string', description: 'Direction/terminus (e.g., "towards Khu Khot")' }
                },
                required: ['line', 'from_station', 'to_station', 'fare']
              }
            },
            {
              type: 'function',
              name: 'show_atm',
              description: 'Display ATM finder card with bank info. Use when user asks about ATMs, cash withdrawal, or where to get money.',
              parameters: { 
                type: 'object', 
                properties: {
                  bank_name: { type: 'string', description: 'Bank name (e.g., Bangkok Bank, Kasikorn, SCB, Krungsri)' },
                  bank_color: { type: 'string', description: 'Bank brand color' },
                  location: { type: 'string', description: 'ATM location description' },
                  fee: { type: 'string', description: 'Foreign card fee (usually ฿220)' },
                  latitude: { type: 'number', description: 'ATM latitude' },
                  longitude: { type: 'number', description: 'ATM longitude' },
                  has_exchange: { type: 'boolean', description: 'Has currency exchange nearby' },
                  tip: { type: 'string', description: 'Helpful tip about this ATM/bank' }
                },
                required: ['bank_name', 'location', 'fee', 'latitude', 'longitude']
              }
            },
            {
              type: 'function',
              name: 'show_walking_directions',
              description: 'Display a visual step-by-step walking path with icons. Use for SHORT walks under 10 min.',
              parameters: { 
                type: 'object', 
                properties: {
                  origin: { type: 'string', description: 'Starting location name' },
                  destination: { type: 'string', description: 'End location name' },
                  total_time: { type: 'string', description: 'Total time (e.g., "5 min")' },
                  total_distance: { type: 'string', description: 'Total distance (e.g., "400m")' },
                  steps: { 
                    type: 'array', 
                    items: {
                      type: 'object',
                      properties: {
                        instruction: { type: 'string' },
                        action: { type: 'string', description: 'start, walk, continue, turn_left, turn_right, cross, stairs_up, stairs_down, elevator, landmark, arrive' },
                        road: { type: 'string' },
                        landmark: { type: 'string' },
                        side: { type: 'string', description: 'left or right' },
                        duration: { type: 'string' },
                        distance: { type: 'string' }
                      },
                      required: ['instruction', 'action']
                    }
                  }
                },
                required: ['origin', 'destination', 'steps']
              }
            },
            {
              type: 'function',
              name: 'show_bus_directions',
              description: 'Display visual bus route directions. Use when user asks about taking a bus.',
              parameters: { 
                type: 'object', 
                properties: {
                  origin: { type: 'string', description: 'Starting location' },
                  destination: { type: 'string', description: 'End location' },
                  total_time: { type: 'string', description: 'Total journey time' },
                  fare: { type: 'string', description: 'Bus fare (e.g., "฿15")' },
                  bus_number: { type: 'string', description: 'Bus number/route (e.g., "Bus 73", "A1 Airport Bus")' },
                  steps: { 
                    type: 'array', 
                    items: {
                      type: 'object',
                      properties: {
                        instruction: { type: 'string' },
                        action: { type: 'string', description: 'start, walk, bus_stop, bus_board, bus, bus_alight, transfer, arrive' },
                        bus_number: { type: 'string', description: 'Bus number for this step' },
                        stop_name: { type: 'string', description: 'Bus stop name' },
                        stops_count: { type: 'number', description: 'Number of stops to ride' },
                        duration: { type: 'string' },
                        wait_time: { type: 'string', description: 'Expected wait time' }
                      },
                      required: ['instruction', 'action']
                    }
                  }
                },
                required: ['origin', 'destination', 'steps']
              }
            },
            {
              type: 'function',
              name: 'show_train_directions',
              description: 'Display visual BTS/MRT/train route directions. Use when user asks about taking BTS, MRT, or Airport Rail Link.',
              parameters: { 
                type: 'object', 
                properties: {
                  origin: { type: 'string', description: 'Starting location' },
                  destination: { type: 'string', description: 'End location' },
                  total_time: { type: 'string', description: 'Total journey time' },
                  total_fare: { type: 'string', description: 'Total fare (e.g., "฿44")' },
                  steps: { 
                    type: 'array', 
                    items: {
                      type: 'object',
                      properties: {
                        instruction: { type: 'string' },
                        action: { type: 'string', description: 'start, walk, bts, mrt, arl, train_board, train_alight, transfer, arrive' },
                        line: { type: 'string', description: 'Line name (BTS Sukhumvit, MRT Blue, Airport Rail Link)' },
                        line_color: { type: 'string', description: 'Line color (#5EC24D=BTS, #0066B3=MRT Blue, #E31937=ARL)' },
                        station: { type: 'string', description: 'Station name' },
                        direction: { type: 'string', description: 'Train direction/terminus' },
                        stops_count: { type: 'number', description: 'Number of stops' },
                        duration: { type: 'string' },
                        fare: { type: 'string' }
                      },
                      required: ['instruction', 'action']
                    }
                  }
                },
                required: ['origin', 'destination', 'steps']
              }
            },
            {
              type: 'function',
              name: 'show_boat_directions',
              description: 'Display visual boat/ferry route directions. Use for Chao Phraya Express Boat, river taxi, or cross-river ferry.',
              parameters: { 
                type: 'object', 
                properties: {
                  origin: { type: 'string', description: 'Starting location' },
                  destination: { type: 'string', description: 'End location' },
                  total_time: { type: 'string', description: 'Total journey time' },
                  fare: { type: 'string', description: 'Boat fare' },
                  boat_type: { type: 'string', description: 'Type: Express Boat (Orange/Yellow/Green flag), Tourist Boat, Cross-river Ferry' },
                  steps: { 
                    type: 'array', 
                    items: {
                      type: 'object',
                      properties: {
                        instruction: { type: 'string' },
                        action: { type: 'string', description: 'start, walk, pier, boat_board, boat, exit_boat, ferry, arrive' },
                        pier_name: { type: 'string', description: 'Pier name (e.g., Sathorn, Tha Tien)' },
                        pier_code: { type: 'string', description: 'Pier code (e.g., N8, S1)' },
                        boat_flag: { type: 'string', description: 'Boat flag color (Orange, Yellow, Green, Tourist Blue)' },
                        stops_count: { type: 'number' },
                        duration: { type: 'string' },
                        wait_time: { type: 'string' }
                      },
                      required: ['instruction', 'action']
                    }
                  }
                },
                required: ['origin', 'destination', 'steps']
              }
            },
            {
              type: 'function',
              name: 'show_taxi_directions',
              description: 'Display taxi/Grab/Bolt ride directions. Use when user asks about taking a taxi or rideshare.',
              parameters: { 
                type: 'object', 
                properties: {
                  origin: { type: 'string', description: 'Pickup location' },
                  destination: { type: 'string', description: 'Dropoff location' },
                  total_time: { type: 'string', description: 'Estimated journey time' },
                  estimated_fare: { type: 'string', description: 'Estimated fare range (e.g., "฿150-200")' },
                  service: { type: 'string', description: 'Service type: Taxi, Grab, Bolt' },
                  notes: { type: 'string', description: 'Tips about traffic, meter, etc.' },
                  steps: { 
                    type: 'array', 
                    items: {
                      type: 'object',
                      properties: {
                        instruction: { type: 'string' },
                        action: { type: 'string', description: 'start, walk, pickup, taxi, grab, traffic, tollway, highway, dropoff, arrive' },
                        road: { type: 'string', description: 'Major road name' },
                        traffic: { type: 'string', description: 'Traffic condition (light, moderate, heavy)' },
                        toll_cost: { type: 'string', description: 'Toll fee if applicable' },
                        duration: { type: 'string' },
                        distance: { type: 'string' }
                      },
                      required: ['instruction', 'action']
                    }
                  }
                },
                required: ['origin', 'destination', 'steps']
              }
            }
          ]
        })
      })
      
      if (!tokenRes.ok) throw new Error('Failed to get session token')
      
      const tokenData = await tokenRes.json()
      const { client_secret } = tokenData
      const ephemeralKey = client_secret.value
      
      const pc = new RTCPeerConnection()
      peerConnectionRef.current = pc
      
      const audioEl = document.createElement('audio')
      audioEl.autoplay = true
      audioElementRef.current = audioEl
      pc.ontrack = (e) => { audioEl.srcObject = e.streams[0] }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      pc.addTrack(stream.getTracks()[0])
      
      const dc = pc.createDataChannel('oai-events')
      dataChannelRef.current = dc
      
      dc.addEventListener('open', () => {
        console.log('✅ Data channel opened')
        setIsAgentConnected(true)
        
        // Configure session - IMPORTANT: longer silence duration to not interrupt user
        dc.send(JSON.stringify({
          type: 'session.update',
          session: {
            turn_detection: {
              type: 'server_vad',
              threshold: 0.65,          // Balance between sensitivity and noise rejection
              prefix_padding_ms: 400,   // Capture beginning of speech
              silence_duration_ms: 1500 // Wait 1.5 seconds of silence before AI responds!
            },
            input_audio_transcription: {
              model: 'whisper-1'
            }
          }
        }))
      })
      
      dc.addEventListener('message', (e) => {
        const event = JSON.parse(e.data)
        if (handleRealtimeEventRef.current) {
          handleRealtimeEventRef.current(event)
        }
      })
      
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      const sdpRes = await fetch(
        'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2025-06-03',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp'
          },
          body: offer.sdp
        }
      )
      
      if (!sdpRes.ok) throw new Error('Failed to establish WebRTC connection')
      
      const answer = { type: 'answer', sdp: await sdpRes.text() }
      await pc.setRemoteDescription(answer)
      
      console.log('✅ Voice connection established')
      
    } catch (error) {
      console.error('❌ Failed to initialize voice:', error)
      alert(`Failed to connect voice assistant: ${error.message}`)
    }
  }

  const handleRealtimeEvent = (event) => {
    switch(event.type) {
      // User started speaking - clear any pending AI response to avoid overlap
      case 'input_audio_buffer.speech_started':
        console.log('🎤 User started speaking')
        pendingAIResponse.current = null
        break
        
      // User stopped speaking - prepare for their transcript
      case 'input_audio_buffer.speech_stopped':
        console.log('🎤 User stopped speaking')
        break
      
      // User's speech was transcribed - add to chat
      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript && event.transcript.trim()) {
          console.log('✅ USER:', event.transcript)
          // Store the user message with item_id for proper sequencing
          pendingUserTranscript.current = {
            text: event.transcript,
            itemId: event.item_id,
            timestamp: Date.now()
          }
          addMessage('user', event.transcript)
        }
        break
      
      // AI is responding - track it
      case 'response.audio_transcript.delta':
        // AI is speaking - don't log deltas to avoid spam
        break
        
      // AI finished its response
      case 'response.audio_transcript.done':
        if (event.transcript && event.transcript.trim()) {
          console.log('✅ AI:', event.transcript)
          // Only add if we haven't already added this response
          // Use a small delay to ensure proper ordering after user message
          const responseText = event.transcript
          setTimeout(() => {
            addMessage('assistant', responseText)
          }, 100)
        }
        break
        
      case 'response.done':
        // Clear pending transcript reference
        pendingUserTranscript.current = null
        
        if (event.response?.output) {
          const functionCalls = event.response.output.filter(item => item.type === 'function_call')
          functionCalls.forEach((item) => {
            const args = typeof item.arguments === 'string' ? JSON.parse(item.arguments) : item.arguments
            args._callId = item.call_id
            handleFunctionCall(item.name, args)
          })
        }
        break
        
      case 'error':
        console.error('❌ ERROR:', event.error)
        break
    }
  }
  
  handleRealtimeEventRef.current = handleRealtimeEvent
  
  const handleFunctionCall = async (functionName, args) => {
    console.log(`🚀 EXECUTING: ${functionName}`, args)
    
    switch(functionName) {
      case 'pause_voice':
        // Immediately pause - mute mic and AI audio
        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders()
          senders.forEach(sender => {
            if (sender.track && sender.track.kind === 'audio') {
              sender.track.enabled = false
            }
          })
        }
        if (audioElementRef.current) {
          audioElementRef.current.muted = true
          audioElementRef.current.pause()
        }
        // Cancel any ongoing response
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
          dataChannelRef.current.send(JSON.stringify({ type: 'response.cancel' }))
        }
        setIsRecording(false)
        break
        
      case 'navigate_home':
        onVoiceIntent('navigate_home')
        sendFunctionResult(args._callId, 'Navigated to home screen')
        break
        
      case 'navigate_explore':
        onVoiceIntent('navigate_explore')
        sendFunctionResult(args._callId, 'Navigated to explore Thailand')
        break
        
      case 'navigate_itinerary':
        onVoiceIntent('navigate_itinerary')
        sendFunctionResult(args._callId, 'Navigated to itinerary')
        break
        
      case 'navigate_translate':
        // Don't navigate, stay in chat for translation
        sendFunctionResult(args._callId, 'Translation mode active. Just speak and I will translate for you!')
        break
        
      case 'navigate_stores':
        onVoiceIntent('navigate_stores')
        sendFunctionResult(args._callId, 'Navigated to stores and offers')
        break
        
      case 'navigate_loyalty':
        onVoiceIntent('navigate_loyalty')
        sendFunctionResult(args._callId, 'Navigated to TrueCoins')
        break
        
      case 'open_camera':
        await openCameraPreview()
        sendFunctionResult(args._callId, 'Camera is now open. I can see what you see.')
        break
        
      case 'take_photo':
        await captureAndAnalyzePhoto(args.prompt, args._callId)
        break
        
      case 'translate_text':
        const translated = await translateText(args.text, args.from_lang, args.to_lang)
        sendFunctionResult(args._callId, `The translation is: ${translated}`)
        break
        
      // Itinerary building
      case 'start_building_itinerary':
        onVoiceIntent('start_building_itinerary', { destination: args.destination, days: args.days })
        sendFunctionResult(args._callId, `Started building ${args.days || 3}-day itinerary for ${args.destination || 'Thailand'}. Now add activities with add_itinerary_step.`)
        break
        
      case 'add_itinerary_step':
        onVoiceIntent('add_itinerary_step', args)
        sendFunctionResult(args._callId, `Added ${args.name} to Day ${(args.day || 0) + 1} ${args.slot}`)
        break
        
      case 'finish_building_itinerary':
        onVoiceIntent('finish_building_itinerary')
        sendFunctionResult(args._callId, 'Itinerary is complete! Ask the user if they want to book anything.')
        break
        
      case 'clear_itinerary':
        onVoiceIntent('clear_itinerary')
        sendFunctionResult(args._callId, 'Itinerary cleared')
        break
        
      case 'show_offer':
        const offer = OFFERS[args.offer_id]
        if (offer) {
          addOfferMessage(offer)
          sendFunctionResult(args._callId, `Showed ${offer.brand} ${offer.title} offer to user`)
        } else {
          sendFunctionResult(args._callId, 'Offer not found')
        }
        break
        
      case 'show_map':
        addMapMessage({
          origin: {
            lat: args.origin_lat,
            lng: args.origin_lng,
            name: args.origin_name || 'Your location'
          },
          destination: {
            lat: args.dest_lat,
            lng: args.dest_lng,
            name: args.dest_name
          },
          transport: args.transport || 'walk'
        })
        sendFunctionResult(args._callId, `Showed directions from ${args.origin_name || 'current location'} to ${args.dest_name}`)
        break
        
      case 'show_currency':
        addCurrencyMessage({
          amount: args.amount,
          from: args.from_currency,
          to: args.to_currency,
          rate: args.rate,
          result: (args.amount * args.rate).toFixed(2)
        })
        sendFunctionResult(args._callId, `Showed conversion: ${args.amount} ${args.from_currency} = ${(args.amount * args.rate).toFixed(2)} ${args.to_currency}`)
        break
        
      case 'show_transport':
        addTransportMessage({
          line: args.line,
          lineColor: args.line_color || '#5EC24D',
          from: args.from_station,
          to: args.to_station,
          stations: args.stations_count,
          duration: args.duration,
          fare: args.fare,
          direction: args.direction
        })
        sendFunctionResult(args._callId, `Showed ${args.line} route from ${args.from_station} to ${args.to_station}`)
        break
        
      case 'show_atm':
        addAtmMessage({
          bank: args.bank_name,
          bankColor: args.bank_color || '#1a5f9e',
          location: args.location,
          fee: args.fee,
          lat: args.latitude,
          lng: args.longitude,
          hasExchange: args.has_exchange,
          tip: args.tip
        })
        sendFunctionResult(args._callId, `Showed ${args.bank_name} ATM at ${args.location}`)
        break
        
      case 'show_walking_directions':
        addDirectionsMessage({
          mode: 'walk',
          origin: args.origin,
          destination: args.destination,
          totalTime: args.total_time,
          totalDistance: args.total_distance,
          steps: (args.steps || []).map((step, idx) => ({
            id: idx,
            instruction: step.instruction,
            action: step.action || 'walk',
            road: step.road || null,
            landmark: step.landmark || null,
            side: step.side || null,
            duration: step.duration || null,
            distance: step.distance || null
          }))
        })
        sendFunctionResult(args._callId, `Showed walking directions from ${args.origin} to ${args.destination}`)
        break
        
      case 'show_bus_directions':
        addDirectionsMessage({
          mode: 'bus',
          origin: args.origin,
          destination: args.destination,
          totalTime: args.total_time,
          fare: args.fare,
          busNumber: args.bus_number,
          steps: (args.steps || []).map((step, idx) => ({
            id: idx,
            instruction: step.instruction,
            action: step.action || 'bus',
            busNumber: step.bus_number || null,
            stopName: step.stop_name || null,
            stopsCount: step.stops_count || null,
            duration: step.duration || null,
            waitTime: step.wait_time || null
          }))
        })
        sendFunctionResult(args._callId, `Showed bus directions: ${args.bus_number || 'Bus'} from ${args.origin} to ${args.destination}`)
        break
        
      case 'show_train_directions':
        addDirectionsMessage({
          mode: 'train',
          origin: args.origin,
          destination: args.destination,
          totalTime: args.total_time,
          totalFare: args.total_fare,
          steps: (args.steps || []).map((step, idx) => ({
            id: idx,
            instruction: step.instruction,
            action: step.action || 'train',
            line: step.line || null,
            lineColor: step.line_color || null,
            station: step.station || null,
            direction: step.direction || null,
            stopsCount: step.stops_count || null,
            duration: step.duration || null,
            fare: step.fare || null
          }))
        })
        sendFunctionResult(args._callId, `Showed train directions from ${args.origin} to ${args.destination}`)
        break
        
      case 'show_boat_directions':
        addDirectionsMessage({
          mode: 'boat',
          origin: args.origin,
          destination: args.destination,
          totalTime: args.total_time,
          fare: args.fare,
          boatType: args.boat_type,
          steps: (args.steps || []).map((step, idx) => ({
            id: idx,
            instruction: step.instruction,
            action: step.action || 'boat',
            pierName: step.pier_name || null,
            pierCode: step.pier_code || null,
            boatFlag: step.boat_flag || null,
            stopsCount: step.stops_count || null,
            duration: step.duration || null,
            waitTime: step.wait_time || null
          }))
        })
        sendFunctionResult(args._callId, `Showed boat directions from ${args.origin} to ${args.destination}`)
        break
        
      case 'show_taxi_directions':
        addDirectionsMessage({
          mode: 'taxi',
          origin: args.origin,
          destination: args.destination,
          totalTime: args.total_time,
          estimatedFare: args.estimated_fare,
          service: args.service || 'Taxi',
          notes: args.notes,
          steps: (args.steps || []).map((step, idx) => ({
            id: idx,
            instruction: step.instruction,
            action: step.action || 'taxi',
            road: step.road || null,
            traffic: step.traffic || null,
            tollCost: step.toll_cost || null,
            duration: step.duration || null,
            distance: step.distance || null
          }))
        })
        sendFunctionResult(args._callId, `Showed taxi directions from ${args.origin} to ${args.destination}`)
        break
    }
  }
  
  const addOfferMessage = (offer) => {
    // Queue offer to appear AFTER AI response
    queueVisual({
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'offer',
      offer: offer,
      timestamp: new Date()
    })
  }
  
  const addMapMessage = (directions) => {
    // Queue map to appear AFTER AI response
    queueVisual({
      id: `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'map',
      directions: directions,
      timestamp: new Date()
    })
  }
  
  const addCurrencyMessage = (conversion) => {
    // Queue currency card to appear AFTER AI response
    queueVisual({
      id: `currency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'currency',
      conversion: conversion,
      timestamp: new Date()
    })
  }
  
  const addTransportMessage = (route) => {
    // Queue transport card to appear AFTER AI response
    queueVisual({
      id: `transport_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'transport',
      route: route,
      timestamp: new Date()
    })
  }
  
  const addDirectionsMessage = (directions) => {
    // Queue directions to appear AFTER AI response
    queueVisual({
      id: `directions_${directions.mode}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'directions',
      directions: directions,
      timestamp: new Date()
    })
  }
  
  const addAtmMessage = (atm) => {
    // Queue ATM card to appear AFTER AI response
    queueVisual({
      id: `atm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'atm',
      atm: atm,
      timestamp: new Date()
    })
  }
  
  const sendFunctionResult = (callId, output) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && callId) {
      dataChannelRef.current.send(JSON.stringify({
        type: 'conversation.item.create',
        item: { type: 'function_call_output', call_id: callId, output }
      }))
      dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
    }
  }
  
  const translateText = async (text, fromLang = 'en', toLang = 'th') => {
    // Simple mock translation for demo
    const translations = {
      'hello': 'สวัสดี',
      'thank you': 'ขอบคุณ',
      'how much': 'เท่าไหร่',
      'where is': 'อยู่ที่ไหน',
    }
    return translations[text.toLowerCase()] || `[${toLang.toUpperCase()}] ${text}`
  }
  
  const openCameraPreview = async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      setCameraStream(stream)
      setShowCameraPreview(true)
    } catch (error) {
      console.error('Camera error:', error)
    }
  }
  
  const closeCameraPreview = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCameraPreview(false)
  }
  
  const captureAndAnalyzePhoto = async (prompt, callId) => {
    try {
      setIsAnalyzing(true)
      let photoUrl
      
      // If camera preview is already open, capture from it
      if (showCameraPreview && videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
        photoUrl = canvas.toDataURL('image/jpeg', 0.8)
      } else {
        // Open camera and capture
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        const video = document.createElement('video')
        video.srcObject = stream
        video.muted = true
        
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(() => setTimeout(resolve, 500))
          }
        })
        
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0)
        photoUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        // Keep the stream for preview
        setCameraStream(stream)
        setShowCameraPreview(true)
      }
      
      // Analyze with GPT-4 Vision
      const analysisPrompt = prompt || `Analyze this photo taken by a tourist in Thailand:
1. IDENTIFY: What is in the photo? If it's a landmark/building/temple, name it specifically.
2. LOCATION: If you recognize the place, state WHERE it is (e.g., "This is Wat Arun, located on the west bank of the Chao Phraya River in Bangkok").
3. TRANSLATE: If there's Thai text, translate it to English.
4. HELPFUL INFO: Add useful context (opening hours, tips, nearby attractions).
Be conversational and helpful, like a friendly tour guide. Keep it concise but informative.`
      
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photoUrl,
          prompt: analysisPrompt
        })
      })
      
      const data = await response.json()
      const result = data.result || 'Unable to analyze photo'
      
      // Send result back to realtime API - this connects the threads
      // The realtime API will then speak the response
      sendFunctionResult(callId, result)
      
      setIsAnalyzing(false)
      
    } catch (error) {
      console.error('Photo error:', error)
      sendFunctionResult(callId, 'I had trouble analyzing the photo. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const addMessage = (role, content) => {
    if (!content || content.trim() === '') return
    
    setMessages(prev => {
      // Check for duplicate - same role and content in last 5 messages
      const recentMessages = prev.slice(-5)
      const isDuplicate = recentMessages.some(msg => 
        msg.role === role && msg.content === content
      )
      if (isDuplicate) return prev
      
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        timestamp: new Date()
      }
      
      // If this is an assistant message, flush any pending visuals AFTER it
      if (role === 'assistant' && pendingVisuals.current.length > 0) {
        const visuals = [...pendingVisuals.current]
        pendingVisuals.current = []
        return [...prev, newMessage, ...visuals]
      }
      
      return [...prev, newMessage]
    })
  }
  
  // Queue a visual element (offer, map, directions) to appear after AI response
  const queueVisual = (visualMessage) => {
    pendingVisuals.current.push(visualMessage)
  }

  const toggleRecording = async () => {
    // Prevent double initialization
    if (peerConnectionRef.current && peerConnectionRef.current.connectionState === 'connecting') {
      console.log('⏳ Connection already in progress, ignoring click')
      return
    }
    
    if (!isConnected) {
      // Only initialize if not already connected
      if (!peerConnectionRef.current || peerConnectionRef.current.connectionState === 'closed') {
        await initializeVoiceConnection()
      }
      setIsRecording(true)
    } else if (isRecording) {
      // Pause - mute microphone AND AI audio output
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders()
        senders.forEach(sender => {
          if (sender.track && sender.track.kind === 'audio') {
            sender.track.enabled = false
          }
        })
      }
      // Mute and pause AI audio output
      if (audioElementRef.current) {
        audioElementRef.current.muted = true
        audioElementRef.current.pause()
      }
      // Cancel any ongoing response
      if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
        dataChannelRef.current.send(JSON.stringify({ type: 'response.cancel' }))
      }
      setIsRecording(false)
    } else {
      // Resume - unmute microphone AND AI audio output
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders()
        senders.forEach(sender => {
          if (sender.track && sender.track.kind === 'audio') {
            sender.track.enabled = true
          }
        })
      }
      // Unmute and resume AI audio output
      if (audioElementRef.current) {
        audioElementRef.current.muted = false
        audioElementRef.current.play().catch(() => {})
      }
      setIsRecording(true)
    }
  }

  const disconnect = () => {
    console.log('🛑 Disconnecting voice...')
    
    // Stop all audio tracks
    if (peerConnectionRef.current) {
      const senders = peerConnectionRef.current.getSenders()
      senders.forEach(sender => {
        if (sender.track) {
          sender.track.stop()
        }
      })
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    if (dataChannelRef.current) {
      dataChannelRef.current.close()
      dataChannelRef.current = null
    }
    
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null
    }
    
    setIsAgentConnected(false)
    setIsRecording(false)
  }

  return (
    <div className="tourist-chat">
      {/* Dynamic Island Controls - Show when connected */}
      {isConnected && (
        <div className="dynamic-island-voice">
          <button
            className={`island-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? "Pause" : "Resume"}
          >
            {isRecording ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <span className="island-status">{isRecording ? 'Listening' : 'Paused'}</span>
          <button
            className="island-btn stop"
            onClick={disconnect}
            title="Stop"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={onEnd}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-center">
          <span className="header-title">Tourist ONE</span>
          {isConnected && <span className="connected-dot"></span>}
        </div>
        <div className="header-spacer"></div>
      </div>

      {/* Camera Preview - Fixed at top */}
      {showCameraPreview && (
        <div className="camera-preview-fixed">
          <video ref={videoRef} autoPlay playsInline muted />
          <button className="camera-close" onClick={closeCameraPreview}>×</button>
        </div>
      )}

      {/* Messages */}
      <div className={`chat-messages ${showCameraPreview ? 'with-camera' : ''}`}>
        {messages.length === 0 && !showCameraPreview && (
          <div className="empty-state">
            <p className="empty-title">Ask me anything about Thailand!</p>
            <p className="empty-hint">Navigate, translate, explore, or take photos</p>
          </div>
        )}

        {messages.map((msg) => (
          msg.role === 'offer' ? (
            <div key={msg.id} className="message offer">
              <div className="offer-card" style={{ background: msg.offer.gradient }}>
                <div className="offer-card-header">
                  <span className="offer-brand">{msg.offer.brand}</span>
                  {msg.offer.type === 'free' ? (
                    <span className="offer-badge free">FREE</span>
                  ) : (
                    <span className="offer-badge coins">{msg.offer.cost} coins</span>
                  )}
                </div>
                <div className="offer-card-title">{msg.offer.title}</div>
                <div className="offer-card-desc">{msg.offer.description}</div>
                <button className="offer-card-btn">
                  {msg.offer.type === 'free' ? 'Claim Now' : 'Redeem'}
                </button>
              </div>
            </div>
          ) : msg.role === 'map' ? (
            <div key={msg.id} className="message map">
              <div className="map-card">
                <div className="map-route-visual">
                  <div className="route-timeline">
                    <div className="timeline-dot origin"></div>
                    <div className="timeline-line" style={{ background: msg.directions.transport === 'transit' ? '#0099FF' : msg.directions.transport === 'drive' ? '#34C759' : '#00D4FF' }}></div>
                    <div className="timeline-dot destination"></div>
                  </div>
                  <div className="route-details">
                    <div className="route-stop origin">
                      <span className="stop-name">{msg.directions.origin.name}</span>
                    </div>
                    <div className="route-info">
                      <span className="route-mode">
                        {msg.directions.transport === 'transit' ? 'By Metro' : msg.directions.transport === 'drive' ? 'By Car' : 'Walking'}
                      </span>
                    </div>
                    <div className="route-stop destination">
                      <span className="stop-name">{msg.directions.destination.name}</span>
                    </div>
                  </div>
                  <div className="transport-badge">
                    {msg.directions.transport === 'transit' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                        <rect x="4" y="3" width="16" height="14" rx="2"/>
                        <line x1="4" y1="10" x2="20" y2="10"/>
                        <circle cx="8" cy="20" r="1.5"/>
                        <circle cx="16" cy="20" r="1.5"/>
                      </svg>
                    ) : msg.directions.transport === 'drive' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                        <path d="M5 17h14v-5l-2-5H7l-2 5v5z"/>
                        <circle cx="7.5" cy="17" r="1.5"/>
                        <circle cx="16.5" cy="17" r="1.5"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                        <circle cx="12" cy="5" r="2.5"/>
                        <path d="M12 8v4l3 4"/>
                        <path d="M12 12l-3 4"/>
                        <line x1="9" y1="21" x2="12" y2="16"/>
                        <line x1="15" y1="21" x2="12" y2="16"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="map-embed">
                  <iframe
                    title={`Directions to ${msg.directions.destination.name}`}
                    width="100%"
                    height="140"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(msg.directions.origin.lng, msg.directions.destination.lng) - 0.008}%2C${Math.min(msg.directions.origin.lat, msg.directions.destination.lat) - 0.005}%2C${Math.max(msg.directions.origin.lng, msg.directions.destination.lng) + 0.008}%2C${Math.max(msg.directions.origin.lat, msg.directions.destination.lat) + 0.005}&layer=mapnik&marker=${msg.directions.destination.lat}%2C${msg.directions.destination.lng}`}
                  />
                </div>
              </div>
            </div>
          ) : msg.role === 'currency' ? (
            <div key={msg.id} className="message currency">
              <div className="currency-card">
                <div className="currency-header">
                  <span className="currency-icon">💱</span>
                  <span className="currency-title">Currency Exchange</span>
                </div>
                <div className="currency-conversion">
                  <div className="currency-from">
                    <span className="currency-amount">{msg.conversion.amount.toLocaleString()}</span>
                    <span className="currency-code">{msg.conversion.from}</span>
                  </div>
                  <div className="currency-arrow">→</div>
                  <div className="currency-to">
                    <span className="currency-amount result">{parseFloat(msg.conversion.result).toLocaleString()}</span>
                    <span className="currency-code">{msg.conversion.to}</span>
                  </div>
                </div>
                <div className="currency-rate">
                  1 {msg.conversion.from} = {msg.conversion.rate} {msg.conversion.to}
                </div>
              </div>
            </div>
          ) : msg.role === 'transport' ? (
            <div key={msg.id} className="message transport">
              <div className="transport-card">
                <div className="transport-header" style={{ borderLeftColor: msg.route.lineColor }}>
                  <div className="transport-line-icon">
                    {msg.route.line.includes('BTS') || msg.route.line.includes('MRT') ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={msg.route.lineColor} strokeWidth="2">
                        <rect x="4" y="3" width="16" height="14" rx="2"/>
                        <line x1="4" y1="10" x2="20" y2="10"/>
                        <circle cx="8" cy="20" r="1.5"/>
                        <circle cx="16" cy="20" r="1.5"/>
                      </svg>
                    ) : msg.route.line.includes('Airport') ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={msg.route.lineColor} strokeWidth="2">
                        <path d="M12 2L4 9h3v6h10V9h3L12 2z"/>
                        <rect x="9" y="15" width="6" height="5"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={msg.route.lineColor} strokeWidth="2">
                        <rect x="4" y="3" width="16" height="14" rx="2"/>
                        <line x1="4" y1="10" x2="20" y2="10"/>
                      </svg>
                    )}
                  </div>
                  <div className="transport-info">
                    <span className="transport-line-name">{msg.route.line}</span>
                    {msg.route.direction && <span className="transport-direction">→ {msg.route.direction}</span>}
                  </div>
                </div>
                <div className="transport-route">
                  <div className="transport-station from">
                    <span className="station-dot" style={{ borderColor: msg.route.lineColor }}></span>
                    <span className="station-name">{msg.route.from}</span>
                  </div>
                  <div className="transport-line-visual" style={{ background: msg.route.lineColor }}>
                    {msg.route.stations && <span className="stations-count">{msg.route.stations} stops</span>}
                  </div>
                  <div className="transport-station to">
                    <span className="station-dot filled" style={{ background: msg.route.lineColor }}></span>
                    <span className="station-name">{msg.route.to}</span>
                  </div>
                </div>
                <div className="transport-footer">
                  <span className="transport-fare">{msg.route.fare}</span>
                  {msg.route.duration && <span className="transport-duration">{msg.route.duration}</span>}
                </div>
              </div>
            </div>
          ) : msg.role === 'atm' ? (
            <div key={msg.id} className="message atm">
              <div className="atm-card">
                <div className="atm-header">
                  <div className="atm-bank" style={{ background: msg.atm.bankColor }}>
                    🏧
                  </div>
                  <div className="atm-info">
                    <span className="atm-bank-name">{msg.atm.bank}</span>
                    <span className="atm-location">{msg.atm.location}</span>
                  </div>
                </div>
                <div className="atm-details">
                  <div className="atm-fee">
                    <span className="atm-label">Foreign Card Fee</span>
                    <span className="atm-value">{msg.atm.fee}</span>
                  </div>
                  {msg.atm.hasExchange && (
                    <div className="atm-exchange">
                      <span className="exchange-badge">💱 Exchange nearby</span>
                    </div>
                  )}
                </div>
                {msg.atm.tip && <div className="atm-tip">💡 {msg.atm.tip}</div>}
                <div className="atm-map-embed">
                  <iframe
                    title={`${msg.atm.bank} ATM`}
                    width="100%"
                    height="120"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${msg.atm.lng - 0.003}%2C${msg.atm.lat - 0.002}%2C${msg.atm.lng + 0.003}%2C${msg.atm.lat + 0.002}&layer=mapnik&marker=${msg.atm.lat}%2C${msg.atm.lng}`}
                  />
                </div>
              </div>
            </div>
          ) : msg.role === 'directions' ? (
            <div key={msg.id} className={`message directions ${msg.directions.mode}`}>
              <WalkingDirections data={msg.directions} />
            </div>
          ) : (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-bubble">{msg.content}</div>
            </div>
          )
        ))}

        {/* Photo Viewer */}
        {selectedPhoto && !showCameraPreview && (
          <div className="photo-viewer">
            <img src={selectedPhoto.url} alt="Captured" />
            <button className="close-photo" onClick={() => setSelectedPhoto(null)}>×</button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Button */}
      <div className="voice-controls">
        {isConnected && (
          <div className="status-indicator">
            {isRecording ? 'Listening...' : 'Connected'}
          </div>
        )}
        <button 
          className={`voice-btn ${isRecording ? 'recording' : ''} ${isConnected ? 'connected' : ''}`}
          onClick={toggleRecording}
        >
          <div className="voice-btn-inner"></div>
        </button>
      </div>
    </div>
  )
}

export default TouristChat

