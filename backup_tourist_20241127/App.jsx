import React, { useState, useEffect, useRef, useCallback } from 'react'
import TouristApp from './components/tourist/TouristApp'
import { TouristAppProvider } from './contexts/TouristAppContext'
import { useTheme } from './contexts/ThemeContext'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  
  // Persistent agent connection - survives navigation
  const peerConnectionRef = useRef(null)
  const dataChannelRef = useRef(null)
  const audioElementRef = useRef(null)
  const [isAgentConnected, setIsAgentConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  
  // Global voice control functions
  const toggleGlobalRecording = useCallback(() => {
    setIsRecording(prev => !prev)
  }, [])
  
  const stopAgent = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close()
      dataChannelRef.current = null
    }
    setIsAgentConnected(false)
    setIsRecording(false)
  }, [])
  
  // Expose to window for cross-component access
  useEffect(() => {
    window.isAgentConnected = isAgentConnected
    window.isAgentRecording = isRecording
    window.toggleAgentRecording = toggleGlobalRecording
    window.stopAgent = stopAgent
  }, [isAgentConnected, isRecording, toggleGlobalRecording, stopAgent])

  // Update outer background based on theme
  useEffect(() => {
    const appElement = document.querySelector('.app')
    if (appElement) {
      if (isDarkMode) {
        appElement.style.background = 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.15), transparent 40%), radial-gradient(circle at 80% 50%, rgba(175, 82, 222, 0.15), transparent 40%), radial-gradient(circle at 50% 80%, rgba(10, 132, 255, 0.1), transparent 40%), #0a0a0a'
      } else {
        appElement.style.background = 'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.08), transparent 40%), radial-gradient(circle at 80% 50%, rgba(175, 82, 222, 0.08), transparent 40%), radial-gradient(circle at 50% 80%, rgba(10, 132, 255, 0.06), transparent 40%), #f5f5f7'
      }
    }
  }, [isDarkMode])

  return (
    <TouristAppProvider>
      <div className="app">
        <div className={`theme-toggle-floating ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <button 
            className="theme-toggle-pill" 
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className={`theme-option ${isDarkMode ? 'active' : ''}`}>Dark</span>
            <span className={`theme-option ${!isDarkMode ? 'active' : ''}`}>Light</span>
          </button>
        </div>
        
        <div className="app-container">
          <TouristApp
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            peerConnectionRef={peerConnectionRef}
            dataChannelRef={dataChannelRef}
            audioElementRef={audioElementRef}
            isAgentConnected={isAgentConnected}
            setIsAgentConnected={setIsAgentConnected}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
      </div>
    </TouristAppProvider>
  )
}

export default App
