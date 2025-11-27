import React, { createContext, useContext, useReducer, useCallback } from 'react'

const TouristAppContext = createContext(null)

// Initial state
const initialState = {
  // User & SIM
  user: {
    phoneNumber: '+66 98 765 4321',
    planName: 'Tourist 7-Day Unlimited',
    dataRemaining: '45.2 GB',
    daysLeft: 5,
    activatedAt: new Date().toISOString(),
  },
  
  // TrueCoin Loyalty
  loyalty: {
    balance: 150,
    history: [
      { id: 1, type: 'earn', amount: 50, description: '7-Eleven Purchase', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, type: 'earn', amount: 100, description: 'SIM Activation Bonus', date: new Date(Date.now() - 172800000).toISOString() },
    ],
  },
  
  // Explore - dynamically populated via web search
  explore: {
    places: [],
    loading: false,
    lastQuery: null,
    categories: ['Sightseeing', 'Food & Markets', 'Beaches', 'Shopping', 'Culture'],
  },
  
  // Itinerary
  itinerary: {
    days: [],
    tripLength: 3,
    destination: 'Bangkok',
    isBuilding: false,
    buildingSteps: [],
  },
  
  // Available CP Group Offers (Thailand's largest conglomerate)
  // Brands: 7-Eleven (CP ALL), Chester's/Five Star (CP Foods), True Corp, Lotus's, CP Fresh
  availableOffers: [
    { id: '7eleven-coffee', brand: '7-Eleven', offer: 'Free All Cafe Coffee', trigger: ['hot', 'tired', 'morning', 'coffee', 'drink', 'thirsty'] },
    { id: '7eleven-snack', brand: '7-Eleven', offer: 'Snack Bundle', trigger: ['hungry', 'snack', 'quick bite', 'walking', 'day trip'] },
    { id: '7eleven-readymeals', brand: '7-Eleven', offer: 'Ready Meal Deal', trigger: ['lunch', 'dinner', 'quick meal', 'cheap food'] },
    { id: 'chesters', brand: "Chester's Grill", offer: 'Free Meal Upgrade', trigger: ['lunch', 'chicken', 'grill', 'fast food', 'quick'] },
    { id: 'fivestar', brand: 'Five Star Chicken', offer: 'Family Bucket Deal', trigger: ['fried chicken', 'family', 'group', 'bucket', 'hungry'] },
    { id: 'cpfresh', brand: 'CP Fresh Mart', offer: '20% Off Fresh Produce', trigger: ['groceries', 'fruits', 'vegetables', 'fresh', 'cooking'] },
    { id: 'lotus', brand: "Lotus's", offer: '฿100 Shopping Voucher', trigger: ['shopping', 'supermarket', 'hypermarket', 'groceries', 'mall'] },
    { id: 'true-data', brand: 'True Mobile', offer: '1GB Data Bonus', trigger: ['data', 'internet', 'streaming', 'video', 'maps', 'navigate'] },
    { id: 'truemoney', brand: 'True Money', offer: '฿50 Cashback', trigger: ['pay', 'market', 'street food', 'vendor', 'cash'] },
    { id: 'truevisions', brand: 'True ID', offer: 'Free Premium Streaming', trigger: ['movie', 'series', 'entertainment', 'stream', 'watch'] },
    { id: 'airport-fasttrack', brand: 'True Tourist', offer: 'Airport Fast Track', trigger: ['airport', 'flight', 'immigration', 'leaving', 'departure'] },
  ],
  
  // Smart Offers - contextual
  offers: [],
  
  // Navigation
  currentScreen: 'home',
  
  // Voice/Assistant state
  lastIntent: null,
  assistantMessage: null,
}

// Action types
const ACTIONS = {
  SET_SCREEN: 'SET_SCREEN',
  UPDATE_PLAN: 'UPDATE_PLAN',
  ADD_COINS: 'ADD_COINS',
  SPEND_COINS: 'SPEND_COINS',
  SET_PLACES: 'SET_PLACES',
  SET_PLACES_LOADING: 'SET_PLACES_LOADING',
  ADD_TO_ITINERARY: 'ADD_TO_ITINERARY',
  REMOVE_FROM_ITINERARY: 'REMOVE_FROM_ITINERARY',
  SET_ITINERARY: 'SET_ITINERARY',
  SET_OFFERS: 'SET_OFFERS',
  ACCEPT_OFFER: 'ACCEPT_OFFER',
  DISMISS_OFFER: 'DISMISS_OFFER',
  SET_ASSISTANT_MESSAGE: 'SET_ASSISTANT_MESSAGE',
  SET_LAST_INTENT: 'SET_LAST_INTENT',
  // Dynamic itinerary building
  START_BUILDING_ITINERARY: 'START_BUILDING_ITINERARY',
  ADD_ITINERARY_STEP: 'ADD_ITINERARY_STEP',
  FINISH_BUILDING_ITINERARY: 'FINISH_BUILDING_ITINERARY',
  CLEAR_ITINERARY: 'CLEAR_ITINERARY',
}

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      return { ...state, currentScreen: action.payload }
    
    case ACTIONS.UPDATE_PLAN:
      return { ...state, user: { ...state.user, ...action.payload } }
    
    case ACTIONS.ADD_COINS:
      return {
        ...state,
        loyalty: {
          balance: state.loyalty.balance + action.payload.amount,
          history: [
            { 
              id: Date.now(), 
              type: 'earn', 
              amount: action.payload.amount, 
              description: action.payload.description,
              date: new Date().toISOString()
            },
            ...state.loyalty.history
          ],
        },
      }
    
    case ACTIONS.SPEND_COINS:
      if (state.loyalty.balance < action.payload.amount) return state
      return {
        ...state,
        loyalty: {
          balance: state.loyalty.balance - action.payload.amount,
          history: [
            { 
              id: Date.now(), 
              type: 'redeem', 
              amount: action.payload.amount, 
              description: action.payload.description,
              date: new Date().toISOString()
            },
            ...state.loyalty.history
          ],
        },
      }
    
    case ACTIONS.SET_PLACES:
      return {
        ...state,
        explore: {
          ...state.explore,
          places: action.payload.places,
          lastQuery: action.payload.query,
          loading: false,
        },
      }
    
    case ACTIONS.SET_PLACES_LOADING:
      return {
        ...state,
        explore: { ...state.explore, loading: action.payload },
      }
    
    case ACTIONS.ADD_TO_ITINERARY:
      const { day, slot, place } = action.payload
      const newDays = [...state.itinerary.days]
      if (!newDays[day]) {
        newDays[day] = { morning: null, afternoon: null, evening: null }
      }
      newDays[day] = { ...newDays[day], [slot]: place }
      return {
        ...state,
        itinerary: { ...state.itinerary, days: newDays },
      }
    
    case ACTIONS.REMOVE_FROM_ITINERARY:
      const updatedDays = [...state.itinerary.days]
      if (updatedDays[action.payload.day]) {
        updatedDays[action.payload.day] = {
          ...updatedDays[action.payload.day],
          [action.payload.slot]: null,
        }
      }
      return {
        ...state,
        itinerary: { ...state.itinerary, days: updatedDays },
      }
    
    case ACTIONS.SET_ITINERARY:
      return {
        ...state,
        itinerary: { ...state.itinerary, ...action.payload },
      }
    
    case ACTIONS.SET_OFFERS:
      return { ...state, offers: action.payload }
    
    case ACTIONS.ACCEPT_OFFER:
      return {
        ...state,
        offers: state.offers.filter(o => o.id !== action.payload),
      }
    
    case ACTIONS.DISMISS_OFFER:
      return {
        ...state,
        offers: state.offers.filter(o => o.id !== action.payload),
      }
    
    case ACTIONS.SET_ASSISTANT_MESSAGE:
      return { ...state, assistantMessage: action.payload }
    
    case ACTIONS.SET_LAST_INTENT:
      return { ...state, lastIntent: action.payload }
    
    case ACTIONS.START_BUILDING_ITINERARY:
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          isBuilding: true,
          buildingSteps: [],
          destination: action.payload?.destination || state.itinerary.destination,
          tripLength: action.payload?.days || state.itinerary.tripLength,
        },
        currentScreen: 'itinerary',
      }
    
    case ACTIONS.ADD_ITINERARY_STEP:
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          buildingSteps: [...state.itinerary.buildingSteps, action.payload],
        },
      }
    
    case ACTIONS.FINISH_BUILDING_ITINERARY:
      // Convert building steps to days format
      const steps = state.itinerary.buildingSteps
      const daysArray = []
      steps.forEach(step => {
        if (!daysArray[step.day]) {
          daysArray[step.day] = { morning: null, afternoon: null, evening: null }
        }
        daysArray[step.day][step.slot] = step.activity
      })
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          isBuilding: false,
          days: daysArray,
          buildingSteps: [],
        },
      }
    
    case ACTIONS.CLEAR_ITINERARY:
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          days: [],
          buildingSteps: [],
          isBuilding: false,
        },
      }
    
    default:
      return state
  }
}

// Provider component
export function TouristAppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  // ========================================
  // VOICE INTENT HANDLERS
  // These are called by the realtime voice layer
  // The voice layer does web searches and passes results here
  // ========================================
  
  const voiceIntentHandlers = {
    // --- Navigation ---
    navigate_home: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'home' })
      return { success: true, message: 'Showing home screen' }
    },
    
    navigate_loyalty: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'loyalty' })
      return { success: true, message: 'Showing TrueCoin loyalty hub' }
    },
    
    navigate_explore: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'explore' })
      return { success: true, message: 'Showing explore Thailand' }
    },
    
    navigate_itinerary: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'itinerary' })
      return { success: true, message: 'Showing your itinerary' }
    },
    
    navigate_translate: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'translate' })
      return { success: true, message: 'Opening live translation' }
    },
    
    navigate_chat: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'chat' })
      return { success: true, message: 'Opening voice assistant' }
    },
    
    navigate_stores: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'explore' })
      return { success: true, message: 'Showing stores and offers' }
    },
    
    navigate_offers: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'offers' })
      return { success: true, message: 'Showing offers' }
    },
    
    // --- Plan Management ---
    check_plan: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'home' })
      return { 
        success: true, 
        data: state.user,
        message: `You have ${state.user.daysLeft} days left with ${state.user.dataRemaining} remaining on your ${state.user.planName}.`
      }
    },
    
    buy_data_topup: (params = {}) => {
      const amount = params.amount || '10GB'
      dispatch({ 
        type: ACTIONS.UPDATE_PLAN, 
        payload: { dataRemaining: `${parseFloat(state.user.dataRemaining) + parseFloat(amount)} GB` } 
      })
      return { success: true, message: `Added ${amount} data top-up to your plan.` }
    },
    
    upgrade_plan: (params = {}) => {
      const newPlan = params.plan || 'Tourist 15-Day Unlimited'
      dispatch({ 
        type: ACTIONS.UPDATE_PLAN, 
        payload: { planName: newPlan, daysLeft: 15 } 
      })
      return { success: true, message: `Upgraded to ${newPlan}.` }
    },
    
    // --- Loyalty / TrueCoin ---
    show_loyalty_balance: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'loyalty' })
      return { 
        success: true, 
        data: { balance: state.loyalty.balance, history: state.loyalty.history },
        message: `You have ${state.loyalty.balance} TrueCoins.`
      }
    },
    
    earn_coins: (params = {}) => {
      const amount = params.amount || 25
      const description = params.description || '7-Eleven Purchase'
      dispatch({ type: ACTIONS.ADD_COINS, payload: { amount, description } })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'loyalty' })
      return { success: true, message: `Earned ${amount} TrueCoins from ${description}!` }
    },
    
    simulate_purchase: (params = {}) => {
      const store = params.store || '7-Eleven'
      const spendAmount = params.amount || 500
      const coinsEarned = Math.floor(spendAmount / 100)
      dispatch({ type: ACTIONS.ADD_COINS, payload: { amount: coinsEarned, description: `${store} - ฿${spendAmount} purchase` } })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'loyalty' })
      return { success: true, message: `Spent ฿${spendAmount} at ${store}, earned ${coinsEarned} TrueCoins!` }
    },
    
    redeem_coins: (params = {}) => {
      const amount = params.amount || 50
      const reward = params.reward || '฿20 discount'
      if (state.loyalty.balance < amount) {
        return { success: false, message: `Not enough coins. You have ${state.loyalty.balance} TrueCoins.` }
      }
      dispatch({ type: ACTIONS.SPEND_COINS, payload: { amount, description: `Redeemed for ${reward}` } })
      return { success: true, message: `Redeemed ${amount} TrueCoins for ${reward}!` }
    },
    
    // --- Explore (Voice layer provides search results) ---
    set_places: (params) => {
      // Voice layer passes places from web search
      dispatch({ type: ACTIONS.SET_PLACES, payload: { places: params.places, query: params.query } })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'explore' })
      return { success: true, message: `Found ${params.places.length} places for "${params.query}"` }
    },
    
    explore_category: (params = {}) => {
      dispatch({ type: ACTIONS.SET_PLACES_LOADING, payload: true })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'explore' })
      // Voice layer will do web search and call set_places
      return { 
        success: true, 
        action: 'web_search', 
        query: `Best ${params.category || 'attractions'} in ${params.location || 'Thailand'} for tourists`,
        message: `Searching for ${params.category || 'attractions'}...`
      }
    },
    
    explore_nearby: (params = {}) => {
      dispatch({ type: ACTIONS.SET_PLACES_LOADING, payload: true })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'explore' })
      return { 
        success: true, 
        action: 'web_search',
        query: `Popular tourist attractions near ${params.location || 'Bangkok'} Thailand`,
        message: `Finding places nearby...`
      }
    },
    
    // --- Itinerary ---
    add_to_itinerary: (params) => {
      dispatch({ 
        type: ACTIONS.ADD_TO_ITINERARY, 
        payload: { day: params.day || 0, slot: params.slot || 'morning', place: params.place }
      })
      return { success: true, message: `Added ${params.place.name} to Day ${(params.day || 0) + 1} ${params.slot || 'morning'}` }
    },
    
    remove_from_itinerary: (params) => {
      dispatch({ 
        type: ACTIONS.REMOVE_FROM_ITINERARY, 
        payload: { day: params.day, slot: params.slot }
      })
      return { success: true, message: `Removed activity from Day ${params.day + 1}` }
    },
    
    // Dynamic itinerary building
    start_building_itinerary: (params) => {
      dispatch({ 
        type: ACTIONS.START_BUILDING_ITINERARY, 
        payload: { destination: params?.destination, days: params?.days }
      })
      return { success: true, message: 'Starting to build your itinerary' }
    },
    
    add_itinerary_step: (params) => {
      dispatch({ 
        type: ACTIONS.ADD_ITINERARY_STEP, 
        payload: {
          day: params.day || 0,
          slot: params.slot || 'morning',
          activity: {
            name: params.name,
            description: params.description,
            type: params.type,
            duration: params.duration,
            price: params.price,
          }
        }
      })
      return { success: true, message: `Added: ${params.name}` }
    },
    
    finish_building_itinerary: () => {
      dispatch({ type: ACTIONS.FINISH_BUILDING_ITINERARY })
      return { success: true, message: 'Itinerary complete!' }
    },
    
    clear_itinerary: () => {
      dispatch({ type: ACTIONS.CLEAR_ITINERARY })
      return { success: true, message: 'Itinerary cleared' }
    },
    
    create_itinerary: (params = {}) => {
      const days = params.days || 3
      const destination = params.destination || 'Bangkok'
      dispatch({ 
        type: ACTIONS.SET_ITINERARY, 
        payload: { 
          tripLength: days, 
          destination,
          days: Array(days).fill(null).map(() => ({ morning: null, afternoon: null, evening: null }))
        }
      })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'itinerary' })
      return { 
        success: true, 
        action: 'web_search',
        query: `Best ${days} day itinerary for ${destination} Thailand tourists must see attractions`,
        message: `Creating ${days}-day itinerary for ${destination}...`
      }
    },
    
    set_itinerary_days: (params) => {
      // Voice layer passes suggested itinerary from web search
      dispatch({ type: ACTIONS.SET_ITINERARY, payload: { days: params.days } })
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'itinerary' })
      return { success: true, message: `Set up your ${params.days.length}-day itinerary!` }
    },
    
    show_itinerary: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'itinerary' })
      return { 
        success: true, 
        data: state.itinerary,
        message: `Showing your ${state.itinerary.tripLength}-day ${state.itinerary.destination} itinerary`
      }
    },
    
    // --- Smart Offers ---
    set_offers: (params) => {
      dispatch({ type: ACTIONS.SET_OFFERS, payload: params.offers })
      return { success: true, message: `${params.offers.length} new offers available!` }
    },
    
    show_offers: () => {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'offers' })
      return { 
        success: true, 
        data: state.offers,
        message: `You have ${state.offers.length} smart offers`
      }
    },
    
    accept_offer: (params) => {
      dispatch({ type: ACTIONS.ACCEPT_OFFER, payload: params.offerId })
      return { success: true, message: 'Offer accepted!' }
    },
    
    dismiss_offer: (params) => {
      dispatch({ type: ACTIONS.DISMISS_OFFER, payload: params.offerId })
      return { success: true, message: 'Offer dismissed' }
    },
    
    // --- Assistant Message ---
    show_message: (params) => {
      dispatch({ type: ACTIONS.SET_ASSISTANT_MESSAGE, payload: params.message })
      return { success: true }
    },
    
    clear_message: () => {
      dispatch({ type: ACTIONS.SET_ASSISTANT_MESSAGE, payload: null })
      return { success: true }
    },
  }
  
  // Main intent handler function exposed to voice layer
  const onVoiceIntent = useCallback((intentName, params = {}) => {
    console.log(`[VoiceIntent] ${intentName}`, params)
    dispatch({ type: ACTIONS.SET_LAST_INTENT, payload: { name: intentName, params, timestamp: Date.now() } })
    
    const handler = voiceIntentHandlers[intentName]
    if (handler) {
      return handler(params)
    }
    
    return { success: false, message: `Unknown intent: ${intentName}` }
  }, [state])
  
  // Expose to window for voice layer access
  React.useEffect(() => {
    window.touristApp = {
      onVoiceIntent,
      getState: () => state,
      dispatch,
      ACTIONS,
    }
  }, [onVoiceIntent, state])
  
  return (
    <TouristAppContext.Provider value={{ state, dispatch, onVoiceIntent, ACTIONS }}>
      {children}
    </TouristAppContext.Provider>
  )
}

export function useTouristApp() {
  const context = useContext(TouristAppContext)
  if (!context) {
    throw new Error('useTouristApp must be used within TouristAppProvider')
  }
  return context
}

export { ACTIONS }

