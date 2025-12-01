/**
 * Walking Directions Tool Definition
 * 
 * This tool definition is sent to the OpenAI Realtime API so the model
 * returns structured JSON for walking directions instead of free text.
 * 
 * The frontend renders this structured data as a visual path with icons.
 */

export const WALKING_DIRECTIONS_TOOL = {
  type: "function",
  name: "show_walking_directions",
  description: `Display visual walking directions with an interactive path. 
Use this tool ALWAYS when giving walking or navigation directions to a destination.
The UI will render a beautiful visual path with icons for each step.
Do NOT also speak the directions - the visual display is sufficient.`,
  parameters: {
    type: "object",
    properties: {
      origin: {
        type: "string",
        description: "Starting location name (e.g., 'Lumpini Park', 'Your location', 'BTS Siam')"
      },
      destination: {
        type: "string", 
        description: "End location name (e.g., '7-Eleven', 'Grand Palace', 'Chatuchak Market')"
      },
      total_time: {
        type: "string",
        description: "Total estimated walking time (e.g., '5 min', '12 min')"
      },
      total_distance: {
        type: "string",
        description: "Total distance (e.g., '400m', '1.2 km')"
      },
      steps: {
        type: "array",
        description: "Array of navigation steps in order",
        items: {
          type: "object",
          properties: {
            instruction: {
              type: "string",
              description: "Human-readable instruction for this step"
            },
            action: {
              type: "string",
              enum: [
                "start",           // Beginning of route
                "walk",            // General walking
                "continue",        // Continue on same path
                "straight",        // Go straight
                "turn_left",       // Turn left
                "turn_right",      // Turn right
                "slight_left",     // Bear/veer left
                "slight_right",    // Bear/veer right
                "uturn",           // U-turn
                "cross",           // Cross street/crosswalk
                "stairs_up",       // Take stairs up
                "stairs_down",     // Take stairs down
                "elevator",        // Take elevator
                "escalator",       // Take escalator
                "landmark",        // Pass by landmark/POI
                "store",           // Store/shop reference
                "bus_stop",        // Bus stop
                "metro",           // Metro/BTS/MRT station
                "arrive"           // Arrival at destination
              ],
              description: "Type of action - determines which icon to show"
            },
            landmark: {
              type: "string",
              description: "Optional: nearby landmark or reference point (e.g., 'McDonald\\'s', 'Big Buddha statue')"
            },
            road: {
              type: "string", 
              description: "Optional: road or street name (e.g., 'Rama IV Road', 'Sukhumvit Soi 11')"
            },
            side: {
              type: "string",
              enum: ["left", "right"],
              description: "Optional: which side of the road (for destinations)"
            },
            duration: {
              type: "string",
              description: "Optional: time for this step (e.g., '2 min', '30 sec')"
            },
            distance: {
              type: "string",
              description: "Optional: distance for this step (e.g., '150m', '0.2 km')"
            }
          },
          required: ["instruction", "action"]
        }
      }
    },
    required: ["origin", "destination", "steps"]
  }
}

/**
 * Handler for walking directions tool call
 * Returns the structured data to be rendered by WalkingDirections component
 */
export function handleWalkingDirectionsToolCall(args) {
  // Validate the response structure
  if (!args || !args.origin || !args.destination || !args.steps) {
    console.error('[WalkingDirections] Invalid tool call args:', args)
    return null
  }
  
  // Ensure each step has required fields
  const validatedSteps = args.steps.map((step, idx) => ({
    id: idx,
    instruction: step.instruction || 'Continue',
    action: step.action || 'walk',
    landmark: step.landmark || null,
    road: step.road || null,
    side: step.side || null,
    duration: step.duration || null,
    distance: step.distance || null,
  }))
  
  return {
    type: 'walking_directions',
    origin: args.origin,
    destination: args.destination,
    totalTime: args.total_time || null,
    totalDistance: args.total_distance || null,
    steps: validatedSteps,
  }
}

/**
 * Example of structured walking directions response:
 * 
 * {
 *   "origin": "Lumpini Park",
 *   "destination": "7-Eleven",
 *   "total_time": "5 min",
 *   "total_distance": "400m",
 *   "steps": [
 *     {
 *       "instruction": "Exit Lumpini Park from the northeast gate",
 *       "action": "start",
 *       "landmark": "Northeast Gate"
 *     },
 *     {
 *       "instruction": "Turn right onto Rama IV Road",
 *       "action": "turn_right",
 *       "road": "Rama IV Road",
 *       "duration": "1 min"
 *     },
 *     {
 *       "instruction": "Continue along the sidewalk",
 *       "action": "continue",
 *       "duration": "3 min",
 *       "distance": "250m"
 *     },
 *     {
 *       "instruction": "7-Eleven on your right",
 *       "action": "arrive",
 *       "side": "right"
 *     }
 *   ]
 * }
 */

export default WALKING_DIRECTIONS_TOOL



