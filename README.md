# TrueOne

A modern voice-enabled AI application built with React and OpenAI Realtime API.

## Project Structure

```
TrueOne/
├── .env                    # API keys (OpenAI, etc.)
├── README.md
└── frontend/
    ├── package.json        # Dependencies
    ├── vite.config.js      # Vite configuration
    ├── index.html          # Entry HTML
    ├── server.js           # Express API server
    ├── public/             # Static assets
    │   ├── Airpods-Pro.png
    │   ├── appleai.png
    │   ├── Face_ID_logo.svg.png
    │   ├── lock_1.png
    │   └── ok_signed_in.png
    └── src/
        ├── main.jsx        # React entry point
        ├── App.jsx         # Main app component
        ├── App.css         # Global styles
        ├── index.css       # Base styles
        ├── contexts/
        │   └── ThemeContext.jsx
        └── components/
            ├── SetupScreen.jsx/.css
            ├── ChatScreen.jsx/.css
            ├── NurseChat.jsx
            ├── MessageBubble.jsx/.css
            ├── VoiceRecorder.jsx/.css
            ├── ComplianceSettings.jsx/.css
            └── FloorMap.jsx/.css
```

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root with:

```
OPENAI_API_KEY=your_openai_api_key
```

## Features

- 🎤 Voice-enabled AI assistant (OpenAI Realtime API)
- 📱 iPhone-style UI with Dynamic Island
- 📷 Camera integration with vitals monitoring
- 🗺️ Interactive floor map
- 🔒 Security compliance settings
- 🌙 Dark/Light theme support



