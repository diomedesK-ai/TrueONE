# TrueOne Platform Architecture

**Enterprise AI Orchestration for Travel, Retail & Mobility**

---

## Executive Summary

TrueOne is a next-generation AI-powered travel companion built on **Azure AI Foundry**, leveraging advanced orchestration patterns to seamlessly integrate retail, transportation, connectivity, and payment services. The platform employs Anthropic's latest [Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use) patterns for intelligent service discovery and execution.

---

## Platform Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRUEONE ORCHESTRATION LAYER                        │
│                              Azure AI Foundry                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│   │   Azure     │    │   Azure     │    │   Azure     │    │   Azure     │  │
│   │   OpenAI    │    │   Claude    │    │  Entra ID   │    │  Key Vault  │  │
│   │  Realtime   │    │  (Sonnet)   │    │  + Face ID  │    │   Secrets   │  │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│          │                  │                  │                  │         │
│          └──────────────────┴──────────────────┴──────────────────┘         │
│                                    │                                         │
│                     ┌──────────────┴──────────────┐                         │
│                     │    TOOL SEARCH ENGINE       │                         │
│                     │   Dynamic MCP Discovery     │                         │
│                     └──────────────┬──────────────┘                         │
│                                    │                                         │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────────────┐
        │                            │                                     │
        ▼                            ▼                                     ▼
┌───────────────┐          ┌───────────────┐                    ┌───────────────┐
│  RETAIL MCP   │          │ TRANSPORT MCP │                    │ TELECOM MCP   │
│               │          │               │                    │               │
│ • 7-Eleven    │          │ • Metro APIs  │                    │ • eSIM Reg    │
│ • Store Maps  │          │ • Bus Routes  │                    │ • 5G Plans    │
│ • Promotions  │          │ • Taxi/Ride   │                    │ • Data Top-up │
│ • Payments    │          │ • Rail Cards  │                    │ • Roaming     │
└───────────────┘          └───────────────┘                    └───────────────┘
```

---

## Core Architecture Components

### 1. Azure AI Foundry Orchestration Hub

The central nervous system of TrueOne, built on Azure AI Foundry, provides:

| Component | Service | Purpose |
|-----------|---------|---------|
| Voice Interface | Azure OpenAI Realtime | Natural language conversation with real-time audio streaming |
| Reasoning Engine | Azure Claude (Sonnet 4) | Complex decision-making, multi-step planning, visual analysis |
| Identity | Azure Entra ID + Face ID | Biometric authentication, secure session management |
| Secrets | Azure Key Vault | API keys, MCP credentials, payment tokens |
| Gateway | Azure API Management | Rate limiting, caching, unified API surface |

### 2. Tool Search Architecture

Following Anthropic's [Tool Search Tool](https://www.anthropic.com/engineering/advanced-tool-use) pattern, TrueOne implements dynamic service discovery:

```
┌─────────────────────────────────────────────────────────────┐
│                    TOOL SEARCH ENGINE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ALWAYS LOADED (Core Tools)           ~500 tokens           │
│  ├── tool_search_bm25                                       │
│  ├── get_user_location                                      │
│  └── get_user_preferences                                   │
│                                                              │
│  DEFERRED LOADING (On-Demand)         ~45K tokens saved     │
│  ├── 7eleven.*        (12 tools)     defer_loading: true    │
│  ├── metro.*          (8 tools)      defer_loading: true    │
│  ├── taxi.*           (6 tools)      defer_loading: true    │
│  ├── esim.*           (5 tools)      defer_loading: true    │
│  ├── payments.*       (9 tools)      defer_loading: true    │
│  └── maps.*           (7 tools)      defer_loading: true    │
│                                                              │
│  CONTEXT SAVINGS: 95% reduction in token overhead           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

```json
{
  "tools": [
    {
      "type": "tool_search_tool_bm25_20251119",
      "name": "discover_services"
    },
    {
      "name": "7eleven.find_nearby_stores",
      "description": "Find 7-Eleven stores near a location with real-time inventory, promotions, and services available (ATM, eSIM kiosk, transit card top-up)",
      "defer_loading": true,
      "input_schema": {
        "type": "object",
        "properties": {
          "latitude": { "type": "number" },
          "longitude": { "type": "number" },
          "radius_meters": { "type": "integer", "default": 500 },
          "services_filter": { 
            "type": "array", 
            "items": { "type": "string" }
          }
        }
      }
    }
  ]
}
```

---

## MCP Server Integration

### Remote MCP Architecture

TrueOne connects to multiple Remote MCP servers, each exposing domain-specific capabilities:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REMOTE MCP TOPOLOGY                          │
└─────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │   TRUEONE AI    │
                         │   ORCHESTRATOR  │
                         └────────┬────────┘
                                  │
                    SSE/WebSocket Connections
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  RETAIL MCP     │    │  MOBILITY MCP   │    │  TELECOM MCP    │
│  mcp.7eleven.io │    │  mcp.metro.gov  │    │  mcp.esim.cloud │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│                 │    │                 │    │                 │
│ store_locator   │    │ plan_route      │    │ check_coverage  │
│ get_promotions  │    │ get_schedules   │    │ register_esim   │
│ check_inventory │    │ buy_ticket      │    │ activate_plan   │
│ process_payment │    │ track_vehicle   │    │ check_balance   │
│ redeem_coupon   │    │ card_topup      │    │ purchase_data   │
│ floor_map       │    │ taxi_request    │    │ port_number     │
│                 │    │ bike_unlock     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### MCP Server Configurations

```json
{
  "mcp_servers": {
    "retail_7eleven": {
      "url": "https://mcp.7eleven.io/v1",
      "transport": "sse",
      "auth": {
        "type": "oauth2",
        "token_url": "https://auth.7eleven.io/token",
        "client_id": "${AZURE_KEYVAULT:7eleven-client-id}",
        "scope": "stores.read promotions.read payments.write"
      },
      "default_config": { "defer_loading": true },
      "tool_overrides": {
        "store_locator": { "defer_loading": false }
      }
    },
    "mobility_metro": {
      "url": "https://mcp.transitapi.gov/v2",
      "transport": "websocket",
      "auth": {
        "type": "api_key",
        "header": "X-Transit-Key",
        "key": "${AZURE_KEYVAULT:metro-api-key}"
      }
    },
    "telecom_esim": {
      "url": "https://mcp.esim.cloud/connect",
      "transport": "sse",
      "auth": {
        "type": "bearer",
        "token": "${AZURE_KEYVAULT:esim-bearer-token}"
      }
    }
  }
}
```

---

## Service Domains

### 1. Retail Services (7-Eleven Integration)

```
┌────────────────────────────────────────────────────────────┐
│                   7-ELEVEN MCP SERVICES                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  STORE DISCOVERY                                            │
│  ├── find_nearby_stores      Location-based store search   │
│  ├── get_store_details       Hours, services, amenities    │
│  ├── get_floor_map           In-store navigation layout    │
│  └── check_wait_times        Real-time queue estimates     │
│                                                             │
│  PROMOTIONS & LOYALTY                                       │
│  ├── get_promotions          Current deals and discounts   │
│  ├── get_personalized_offers AI-curated recommendations    │
│  ├── check_points_balance    Loyalty program status        │
│  └── redeem_coupon           Apply digital coupons         │
│                                                             │
│  PAYMENTS                                                   │
│  ├── initiate_payment        NFC, QR, or card payment      │
│  ├── process_refund          Transaction reversals         │
│  └── get_receipt             Digital receipt retrieval     │
│                                                             │
│  ADDITIONAL SERVICES                                        │
│  ├── atm_locator             In-store ATM availability     │
│  └── transit_card_topup      IC card balance reload        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Tool Use Examples (Anthropic Pattern):**

```json
{
  "name": "7eleven.process_payment",
  "input_schema": { ... },
  "input_examples": [
    {
      "store_id": "711-TYO-3847",
      "amount": 1250,
      "currency": "JPY",
      "payment_method": "apple_pay",
      "loyalty_id": "7REWARDS-9283746",
      "apply_coupons": ["COFFEE50", "ONIGIRI20"]
    },
    {
      "store_id": "711-TPE-1029",
      "amount": 89,
      "currency": "TWD",
      "payment_method": "line_pay"
    }
  ]
}
```

### 2. Transportation & Mobility

```
┌────────────────────────────────────────────────────────────┐
│                   MOBILITY MCP SERVICES                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  METRO & RAIL                                               │
│  ├── plan_route              Multi-modal journey planning  │
│  ├── get_schedules           Real-time departure times     │
│  ├── get_fare                Calculate journey cost        │
│  ├── buy_ticket              Purchase digital tickets      │
│  └── card_topup              Reload IC/transit cards       │
│                                                             │
│  BUS NETWORK                                                │
│  ├── find_bus_stops          Nearby stop discovery         │
│  ├── get_bus_arrivals        Real-time ETA tracking        │
│  └── track_vehicle           Live bus GPS position         │
│                                                             │
│  TAXI & RIDESHARE                                           │
│  ├── request_ride            Book taxi or rideshare        │
│  ├── get_fare_estimate       Price quote before booking    │
│  ├── track_driver            Real-time driver location     │
│  └── rate_trip               Post-journey feedback         │
│                                                             │
│  MICROMOBILITY                                              │
│  ├── find_bikes              Locate rental bikes/scooters  │
│  ├── unlock_vehicle          Start rental session          │
│  └── end_rental              Complete and pay              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### 3. Telecom & Connectivity (eSIM)

```
┌────────────────────────────────────────────────────────────┐
│                    TELECOM MCP SERVICES                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  eSIM PROVISIONING                                          │
│  ├── check_device_compat     Verify eSIM support           │
│  ├── get_available_plans     Browse 5G/LTE data plans      │
│  ├── register_esim           Create eSIM profile           │
│  ├── activate_plan           Enable selected data plan     │
│  └── download_profile        Install eSIM to device        │
│                                                             │
│  ACCOUNT MANAGEMENT                                         │
│  ├── check_balance           Data usage and remaining      │
│  ├── purchase_data           Buy additional data packs     │
│  ├── check_coverage          5G/LTE coverage by location   │
│  └── get_usage_history       Historical consumption        │
│                                                             │
│  PORTABILITY                                                │
│  ├── port_number             Transfer existing number      │
│  └── manage_profiles         Switch between eSIM plans     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**eSIM Registration Flow:**

```
User Request                    Tool Orchestration
     │                                 │
     ▼                                 ▼
"Set up 5G data"  ──────────▶  discover_services("esim 5G")
                                       │
                                       ▼
                               esim.check_device_compat()
                                       │
                                       ▼
                               esim.get_available_plans()
                                       │
                                       ▼
                               [User selects plan]
                                       │
                                       ▼
                               esim.register_esim({
                                 plan_id: "5G-TRAVEL-7DAY",
                                 payment_token: "...",
                                 identity_verification: "faceid"
                               })
                                       │
                                       ▼
                               esim.activate_plan()
                                       │
                                       ▼
                               esim.download_profile()
                                       │
                                       ▼
                               ✓ 5G Connected
```

---

## Programmatic Tool Calling

Following Anthropic's [Programmatic Tool Calling](https://www.anthropic.com/engineering/advanced-tool-use) pattern, TrueOne enables Claude to execute multi-tool workflows efficiently:

```
┌─────────────────────────────────────────────────────────────┐
│              PROGRAMMATIC TOOL CALLING FLOW                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  USER: "Find the nearest 7-Eleven with an ATM, check        │
│         metro routes there, and see if they have eSIM"       │
│                                                              │
│                         ▼                                    │
│                                                              │
│  CLAUDE GENERATES CODE:                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ // Parallel data fetching                              │ │
│  │ const [stores, location] = await Promise.all([         │ │
│  │   tools.call("7eleven.find_nearby_stores", {           │ │
│  │     latitude: user.lat,                                │ │
│  │     longitude: user.lng,                               │ │
│  │     services_filter: ["atm", "esim_kiosk"]             │ │
│  │   }),                                                  │ │
│  │   tools.call("get_user_location")                      │ │
│  │ ]);                                                    │ │
│  │                                                        │ │
│  │ // Find best store                                     │ │
│  │ const best = stores                                    │ │
│  │   .filter(s => s.services.includes("atm"))             │ │
│  │   .sort((a, b) => a.distance - b.distance)[0];         │ │
│  │                                                        │ │
│  │ // Get route to store                                  │ │
│  │ const route = await tools.call("metro.plan_route", {   │ │
│  │   origin: location,                                    │ │
│  │   destination: best.coordinates                        │ │
│  │ });                                                    │ │
│  │                                                        │ │
│  │ return { store: best, route, has_esim: true };         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  RESULT: Only final summary enters context                   │
│  TOKEN SAVINGS: ~85% vs sequential tool calls                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Configuration:**

```json
{
  "tools": [
    {
      "type": "code_execution_20250825",
      "name": "code_execution"
    },
    {
      "name": "7eleven.find_nearby_stores",
      "allowed_callers": ["code_execution", "llm"],
      "defer_loading": true
    },
    {
      "name": "metro.plan_route",
      "allowed_callers": ["code_execution", "llm"],
      "defer_loading": true
    }
  ]
}
```

---

## Identity & Authentication

### Azure Entra ID + Face ID Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    IDENTITY ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐         ┌─────────────┐                    │
│  │   Device    │         │   Azure     │                    │
│  │   Face ID   │◀───────▶│  Entra ID   │                    │
│  │   Secure    │  OIDC   │  B2C/B2B    │                    │
│  │   Enclave   │         │             │                    │
│  └──────┬──────┘         └──────┬──────┘                    │
│         │                       │                            │
│         │ Biometric             │ JWT + Claims               │
│         │ Attestation           │                            │
│         ▼                       ▼                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              SESSION CONTEXT                         │    │
│  │                                                      │    │
│  │  user_id: "usr_8a7f3c..."                           │    │
│  │  auth_level: "biometric_verified"                   │    │
│  │  payment_methods: ["apple_pay", "line_pay"]         │    │
│  │  loyalty_ids: { "7eleven": "7R-928...", ... }       │    │
│  │  esim_profiles: ["profile_5g_travel"]               │    │
│  │  transit_cards: ["suica_virtual", "icoca"]          │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Authentication Tiers:**

| Level | Method | Capabilities |
|-------|--------|--------------|
| Guest | Anonymous | Store locator, schedules, coverage check |
| Basic | Email/OAuth | Promotions, route planning, fare estimates |
| Verified | Face ID | Payments, eSIM registration, transit card linking |
| Premium | Face ID + PIN | High-value transactions, number porting |

---

## Payment Processing

### Multi-Rail Payment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT ORCHESTRATION                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│   │  Apple Pay  │    │  Google Pay │    │  Line Pay   │     │
│   │             │    │             │    │             │     │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│          │                  │                  │             │
│          └──────────────────┼──────────────────┘             │
│                             │                                │
│                             ▼                                │
│              ┌──────────────────────────┐                   │
│              │   AZURE PAYMENT GATEWAY   │                   │
│              │                          │                   │
│              │  • Tokenization          │                   │
│              │  • Fraud Detection       │                   │
│              │  • PCI DSS Compliance    │                   │
│              │  • Multi-currency        │                   │
│              └────────────┬─────────────┘                   │
│                           │                                  │
│          ┌────────────────┼────────────────┐                │
│          │                │                │                │
│          ▼                ▼                ▼                │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│   │  7-Eleven  │  │   Metro    │  │   eSIM     │           │
│   │  Checkout  │  │   Fares    │  │  Purchases │           │
│   └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Real-Time Voice Architecture

### Azure OpenAI Realtime Integration

```
┌─────────────────────────────────────────────────────────────┐
│                 VOICE INTERACTION PIPELINE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   USER DEVICE                    AZURE OPENAI REALTIME       │
│   ┌──────────┐                   ┌──────────────────┐       │
│   │          │   WebRTC/PCM16    │                  │       │
│   │   Mic    │◀─────────────────▶│   GPT-4o-RT      │       │
│   │          │                   │   Realtime       │       │
│   │ Speaker  │                   │                  │       │
│   │          │                   │   Voice: Shimmer │       │
│   └──────────┘                   └────────┬─────────┘       │
│                                           │                  │
│                                           │ Function Calls   │
│                                           ▼                  │
│                              ┌────────────────────┐         │
│                              │  TOOL ORCHESTRATOR │         │
│                              │                    │         │
│                              │  MCP Routing       │         │
│                              │  Result Synthesis  │         │
│                              │  Context Injection │         │
│                              └────────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Session Configuration:**

```json
{
  "model": "gpt-4o-realtime-preview",
  "voice": "shimmer",
  "modalities": ["text", "audio"],
  "input_audio_format": "pcm16",
  "output_audio_format": "pcm16",
  "turn_detection": {
    "type": "server_vad",
    "threshold": 0.4,
    "silence_duration_ms": 500
  },
  "tools": [
    { "type": "tool_search_tool_bm25_20251119" },
    { "type": "code_execution_20250825" }
  ]
}
```

---

## Deployment Architecture

### Azure Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                    AZURE DEPLOYMENT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REGION: East Asia (Primary) / Southeast Asia (DR)          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 AZURE AI FOUNDRY                     │    │
│  │                                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │ Azure       │  │ Azure       │  │ Azure       │  │    │
│  │  │ OpenAI      │  │ Claude      │  │ AI Search   │  │    │
│  │  │ (Realtime)  │  │ (Sonnet 4)  │  │ (BM25)      │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 PLATFORM SERVICES                    │    │
│  │                                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │ Container   │  │ API         │  │ Key Vault   │  │    │
│  │  │ Apps        │  │ Management  │  │             │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  │                                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │ Cosmos DB   │  │ Redis       │  │ Event Grid  │  │    │
│  │  │ (Sessions)  │  │ (Cache)     │  │ (Events)    │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 SECURITY & IDENTITY                  │    │
│  │                                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │ Entra ID    │  │ Front Door  │  │ DDoS        │  │    │
│  │  │ (Identity)  │  │ (WAF/CDN)   │  │ Protection  │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## User Journey Example

### Tourist Arrival Scenario

```
┌─────────────────────────────────────────────────────────────┐
│              ARRIVAL JOURNEY ORCHESTRATION                   │
└─────────────────────────────────────────────────────────────┘

STEP 1: Authentication
────────────────────────────────────────────────────────────────
User opens TrueOne app → Face ID verification → Session created

STEP 2: eSIM Setup
────────────────────────────────────────────────────────────────
"I just landed, I need data"
    │
    ├── discover_services("esim 5G data plan tourist")
    ├── esim.check_device_compat() → ✓ iPhone 15 Pro
    ├── esim.get_available_plans() → [7-day 5G, 14-day LTE, ...]
    ├── User selects "7-day 5G Unlimited"
    ├── esim.register_esim(plan: "5G-TRAVEL-7DAY", payment: "apple_pay")
    ├── esim.activate_plan()
    └── esim.download_profile() → ✓ 5G Connected

STEP 3: Getting to City Center
────────────────────────────────────────────────────────────────
"How do I get to Shibuya?"
    │
    ├── discover_services("metro train shibuya route")
    ├── metro.plan_route(origin: "NRT Airport", dest: "Shibuya")
    │   └── Returns: Narita Express → JR Yamanote → Shibuya
    ├── metro.get_fare() → ¥3,250
    ├── User: "Buy ticket with Apple Pay"
    └── metro.buy_ticket(payment: "apple_pay") → ✓ Digital ticket issued

STEP 4: Convenience Stop
────────────────────────────────────────────────────────────────
"Find a 7-Eleven near my hotel"
    │
    ├── discover_services("7-eleven convenience store nearby")
    ├── 7eleven.find_nearby_stores(lat: 35.658, lng: 139.701)
    │   └── Returns: 3 stores within 200m
    ├── 7eleven.get_promotions(store: "711-TYO-3847")
    │   └── Returns: "50% off onigiri after 8pm"
    ├── User enters store, scans items
    ├── 7eleven.process_payment(
    │     store: "711-TYO-3847",
    │     amount: 1250,
    │     payment: "apple_pay",
    │     coupons: ["ONIGIRI50"]
    │   )
    └── ✓ Payment complete, digital receipt saved
```

---

## Security & Compliance

| Domain | Standard | Implementation |
|--------|----------|----------------|
| Data Protection | GDPR, APPI | Azure Data Residency, Encryption at Rest |
| Payment | PCI DSS Level 1 | Tokenization, No Card Data Storage |
| Identity | FIDO2 | Face ID Attestation via Azure Entra |
| API Security | OAuth 2.0 / OIDC | Managed Identities, Short-lived Tokens |
| Network | Zero Trust | Private Endpoints, mTLS for MCP |

---

## Performance Metrics

| Metric | Target | Implementation |
|--------|--------|----------------|
| Voice Latency | < 300ms | Azure OpenAI Realtime, Regional Deployment |
| Tool Discovery | < 100ms | BM25 Index, Redis Caching |
| Payment Processing | < 2s | Pre-tokenized Methods, Async Confirmation |
| MCP Response | < 500ms | Connection Pooling, Circuit Breakers |
| Context Efficiency | 95% savings | Tool Search + Programmatic Calling |

---

## References

- [Anthropic Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)
- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Azure OpenAI Realtime API](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)

---

*TrueOne Platform Architecture v2.0*
*Confidential — Internal Use Only*


