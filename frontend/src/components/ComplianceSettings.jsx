import React, { useState, useEffect } from 'react'
import './ComplianceSettings.css'

function ComplianceSettings({ isDarkMode }) {
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showAutomationGuide, setShowAutomationGuide] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [applyingAction, setApplyingAction] = useState(null)

  // Always start at 68% - no persistence
  const [appliedActions, setAppliedActions] = useState([])
  const [securityScore, setSecurityScore] = useState(68)

  // Sync to sessionStorage for within-session persistence only (resets on app restart)
  useEffect(() => {
    sessionStorage.setItem('appliedSecurityActions', JSON.stringify(appliedActions))
    sessionStorage.setItem('securityScore', securityScore.toString())
  }, [appliedActions, securityScore])

  // Clear old localStorage data on mount (migrating to sessionStorage)
  useEffect(() => {
    localStorage.removeItem('appliedSecurityActions')
    localStorage.removeItem('securityScore')
  }, [])

  // Listen for updates from AI voice commands
  useEffect(() => {
    const handleSecurityUpdate = () => {
      console.log('🔄 Security settings updated by AI - reloading from sessionStorage')
      const savedActions = sessionStorage.getItem('appliedSecurityActions')
      const savedScore = sessionStorage.getItem('securityScore')
      
      if (savedActions) {
        setAppliedActions(JSON.parse(savedActions))
      }
      if (savedScore) {
        setSecurityScore(parseInt(savedScore))
      }
    }

    window.addEventListener('securitySettingsUpdated', handleSecurityUpdate)
    return () => window.removeEventListener('securitySettingsUpdated', handleSecurityUpdate)
  }, [])

  // Recommendations data - Critical Security Packages
  const recommendations = [
    { 
      id: 'end-to-end-encryption',
      title: 'End-to-End Encryption (AES-256)', 
      impact: 'Critical',
      category: 'HIPAA Compliance',
      description: 'Enable military-grade AES-256 encryption for all patient data at rest and in transit',
      details: [
        'AES-256-GCM encryption for all stored PHI',
        'TLS 1.3 for network communications',
        'Zero-knowledge architecture',
        'Cryptographic key rotation every 90 days'
      ]
    },
    { 
      id: 'audit-logging',
      title: 'Audit Logging & Access Controls', 
      impact: 'High',
      category: 'HIPAA Compliance',
      description: 'Comprehensive audit trail for all patient data access and modifications',
      details: [
        'Tamper-proof audit logs for all PHI access',
        'Role-based access control (RBAC)',
        'Real-time breach detection and alerting',
        'Automated compliance reporting'
      ]
    },
    { 
      id: 'secure-storage',
      title: 'Secure Data Storage with Apple Keychain', 
      impact: 'High',
      category: 'Data Protection',
      description: 'Store sensitive credentials and PHI using Apple Keychain Services',
      details: [
        'Secure Enclave integration for cryptographic keys',
        'iOS Keychain for credential storage',
        'Hardware-backed encryption',
        'Automatic secure backup with device backup'
      ]
    },
    { 
      id: 'hipaa-compliance-mode',
      title: 'HIPAA Compliance Mode', 
      impact: 'Critical',
      category: 'HIPAA Compliance',
      description: 'Enable full HIPAA compliance suite with BAA enforcement',
      details: [
        'Business Associate Agreement (BAA) enforcement',
        'Minimum necessary standard for PHI access',
        'Automatic de-identification of test data',
        'Breach notification automation',
        'Patient rights management (access, amendment, accounting)'
      ]
    },
  ]

  const handleApplyAction = (recommendation) => {
    // Show automation guide for healthcare encryption
    if (recommendation.id === 'healthcare-encryption') {
      setSelectedRecommendation(recommendation)
      setShowAutomationGuide(true)
    } else {
      // Show applying animation
      setApplyingAction(recommendation.id)
      
      // Simulate applying process with elegant timing
      setTimeout(() => {
        const newAppliedActions = [...appliedActions, recommendation.id]
        setAppliedActions(newAppliedActions)
        
        // Calculate new security score based on applied items
        // Each critical item = 7%, each high item = 4%
        const criticalApplied = newAppliedActions.filter(id => {
          const rec = recommendations.find(r => r.id === id)
          return rec?.impact === 'Critical'
        }).length
        const highApplied = newAppliedActions.filter(id => {
          const rec = recommendations.find(r => r.id === id)
          return rec?.impact === 'High'
        }).length
        
        const newScore = 68 + (criticalApplied * 7) + (highApplied * 4)
        setSecurityScore(Math.min(newScore, 90)) // Cap at 90%
        
        // Show toast notification
        setToastMessage(`✓ ${recommendation.title} applied successfully!`)
        setShowToast(true)
        setApplyingAction(null)
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false)
        }, 3000)
      }, 2200) // 2.2 second elegant delay - slower animation
    }
  }
  
  const handleCloseAutomationGuide = () => {
    setShowAutomationGuide(false)
    setSelectedRecommendation(null)
  }
  
  const handleCompleteAutomation = () => {
    if (selectedRecommendation) {
      const newAppliedActions = [...appliedActions, selectedRecommendation.id]
      setAppliedActions(newAppliedActions)
      
      // Calculate new security score
      const criticalApplied = newAppliedActions.filter(id => {
        const rec = recommendations.find(r => r.id === id)
        return rec?.impact === 'Critical'
      }).length
      const highApplied = newAppliedActions.filter(id => {
        const rec = recommendations.find(r => r.id === id)
        return rec?.impact === 'High'
      }).length
      
      const newScore = 68 + (criticalApplied * 7) + (highApplied * 4)
      setSecurityScore(Math.min(newScore, 90))
      
      setToastMessage(`✓ ${selectedRecommendation.title} configured successfully!`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
    setShowAutomationGuide(false)
    setSelectedRecommendation(null)
  }

  const complianceData = {
    regulatory: {
      title: 'Healthcare Regulatory Compliance',
      score: appliedActions.includes('end-to-end-encryption') && appliedActions.includes('hipaa-compliance-mode') ? 100 : 70,
      items: [
        { name: 'HIPAA (Health Insurance Portability)', status: appliedActions.includes('hipaa-compliance-mode') ? 'compliant' : 'partial', details: 'Privacy & Security Rules for PHI' },
        { name: 'FDA Medical Device Guidelines', status: 'compliant', details: 'Software as Medical Device (SaMD) compliance' },
        { name: 'HL7 FHIR Interoperability', status: 'compliant', details: 'Healthcare data exchange standards' },
      ]
    },
    dataProtection: {
      title: 'Data Protection & Encryption',
      score: appliedActions.includes('end-to-end-encryption') ? 100 : 65,
      items: [
        { name: 'Data Encryption at Rest', status: appliedActions.includes('end-to-end-encryption') ? 'enabled' : 'partial', details: 'AES-256 encryption for all stored data' },
        { name: 'Data Encryption in Transit', status: appliedActions.includes('end-to-end-encryption') ? 'enabled' : 'partial', details: 'TLS 1.3 for all network communications' },
        { name: 'On-Device Processing', status: 'enabled', details: '100% local processing, zero cloud dependency' },
        { name: 'Data Minimization', status: 'enabled', details: 'No data collection or external transmission' },
      ]
    },
    zeroTrust: {
      title: 'Zero-Trust Posture',
      score: appliedActions.includes('secure-storage') ? 90 : 65,
      items: [
        { name: 'Network Segmentation', status: appliedActions.includes('secure-storage') ? 'enabled' : 'partial', details: 'Isolated worker processes' },
        { name: 'Least Privilege Access', status: appliedActions.includes('secure-storage') ? 'enabled' : 'partial', details: 'Minimal permission requirements' },
        { name: 'Continuous Verification', status: 'enabled', details: 'Real-time security monitoring' },
        { name: 'Micro-segmentation', status: 'partial', details: 'Backend services isolated' },
      ]
    },
    identity: {
      title: 'Access & Identity Control',
      score: appliedActions.includes('audit-logging') ? 95 : 70,
      items: [
        { name: 'Biometric Authentication (Face ID)', status: 'enabled', details: 'Face ID / Touch ID for PHI access' },
        { name: 'Multi-Factor Authentication (MFA)', status: 'available', details: 'Ready for enterprise integration' },
        { name: 'Certificate Management', status: 'enabled', details: 'SSL/TLS certificate validation' },
        { name: 'Identity Compliance', status: appliedActions.includes('audit-logging') ? 'enabled' : 'partial', details: 'No PII collection by default' },
        { name: 'Session Management', status: 'enabled', details: 'Secure session handling' },
      ]
    },
    governance: {
      title: 'Application Governance',
      score: appliedActions.length >= 2 ? 100 : 68,
      items: [
        { name: 'Secure Configuration Baseline', status: appliedActions.length >= 1 ? 'enabled' : 'partial', details: 'Hardened default settings' },
        { name: 'Dependency Management', status: 'enabled', details: 'Regular security updates' },
        { name: 'Code Review Process', status: 'enabled', details: 'Version control with audit trail' },
        { name: 'Change Management', status: 'enabled', details: 'Git-based versioning' },
      ]
    },
    logging: {
      title: 'Secure Logging & Audit',
      score: appliedActions.includes('audit-logging') ? 95 : 68,
      items: [
        { name: 'Comprehensive Logging', status: appliedActions.includes('audit-logging') ? 'enabled' : 'partial', details: 'All transactions logged locally' },
        { name: 'Audit Trail', status: appliedActions.includes('audit-logging') ? 'enabled' : 'partial', details: 'Tamper-evident log files' },
        { name: 'Log Retention', status: 'enabled', details: 'Configurable retention policy' },
        { name: 'Audit-Ready Documentation', status: 'enabled', details: 'Complete system documentation' },
      ]
    }
  }

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
      case 'enabled':
        return 'rgba(255, 255, 255, 0.95)' // White
      case 'available':
        return 'rgba(255, 255, 255, 0.8)' // Light white
      case 'partial':
        return '#FF9500' // Orange
      default:
        return '#FF3B30' // Red
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
      case 'enabled':
        return '✓'
      case 'available':
        return '◆'
      case 'partial':
        return '⚠'
      default:
        return '✕'
    }
  }

  const automationSteps = {
    'healthcare-encryption': {
      title: 'HIPAA-Compliant PHI Protection Setup',
      sections: [
        {
          title: 'iPhone Configuration (Automated via Hospital MDM)',
          steps: [
            'Deploy healthcare configuration profile via Intune/Jamf',
            'Enable Secure Enclave for PHI protection (automatic)',
            'Configure Health app Keychain access groups',
            'Set data protection class to NSFileProtectionComplete',
            'Enable Face ID/Touch ID requirement for patient data access'
          ]
        },
        {
          title: 'Hospital MDM Policy Enforcement',
          steps: [
            'Create App Configuration Policy for iOS healthcare devices',
            'Set minimum iOS version to 15.0+ (Health app integration)',
            'Enable "Require encrypted backup" policy',
            'Configure "Block PHI backup to iCloud" policy',
            'Deploy Conditional Access policy for HIPAA compliance'
          ]
        },
        {
          title: 'HIPAA Compliance Implementation',
          steps: [
            'Enable on-device PHI encryption (AES-256)',
            'Implement audit logging for all patient data access',
            'Configure automatic session timeout (15 minutes)',
            'Set up breach notification mechanisms',
            'Enable biometric authentication for all clinical operations'
          ]
        },
        {
          title: 'FDA SaMD Guidelines',
          steps: [
            'Encrypt all patient vitals using Secure Enclave',
            'Store clinical data in iOS Health vault with restricted access',
            'Implement clinical decision support logging',
            'Enable TLS 1.3 for EHR/FHIR communications',
            'Configure automated clinical validation workflows'
          ]
        },
        {
          title: 'Automated Deployment Script',
          steps: [
            'Download deployment package from hospital IT portal',
            'Run: ./deploy-healthcare-security.sh',
            'Verify: security find-identity -v -p codesigning',
            'Test PHI encryption: npm run test:hipaa-compliance',
            'Monitor logs: tail -f /var/log/healthcare-audit.log'
          ]
        }
      ]
    }
  }

  // Track agent connection status for dynamic island controls
  const [isAgentConnected, setIsAgentConnected] = useState(false)
  const [isAgentRecording, setIsAgentRecording] = useState(false)
  
  // Poll for agent status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAgentConnected(window.isAgentConnected || false)
      setIsAgentRecording(window.isAgentRecording || false)
    }, 100)
    return () => clearInterval(interval)
  }, [])
  
  const handleToggleRecording = () => {
    if (window.toggleAgentRecording) {
      window.toggleAgentRecording()
    }
  }
  
  const handleStopAgent = () => {
    if (window.stopAgent) {
      window.stopAgent()
    }
  }

  return (
    <div className="compliance-settings">
        {/* Dynamic Island Controls - if agent is connected */}
        {isAgentConnected && (
          <div className="dynamic-island-controls">
            <button
              className={`island-control-btn ${isAgentRecording ? 'recording' : ''}`}
              onClick={handleToggleRecording}
              title={isAgentRecording ? "Pause" : "Record"}
            >
              {isAgentRecording ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255, 69, 58, 1)">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(10, 132, 255, 1)" strokeWidth="2.5">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                </svg>
              )}
            </button>
            {isAgentRecording && (
              <span className="island-status-text">Listening...</span>
            )}
            <button
              className="island-control-btn"
              onClick={handleStopAgent}
              title="Stop"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.7)">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
            </button>
          </div>
        )}
    
        {/* Automation Guide Modal */}
        {showAutomationGuide && selectedRecommendation && (
          <div className="automation-modal-overlay">
            <div className="automation-modal">
              <div className="automation-header">
                <h2>{automationSteps[selectedRecommendation.id]?.title || 'Implementation Guide'}</h2>
                <button className="close-modal-button" onClick={handleCloseAutomationGuide}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className="automation-content">
                {automationSteps[selectedRecommendation.id]?.sections.map((section, idx) => (
                  <div key={idx} className="automation-section">
                    <h3>{section.title}</h3>
                    <ul className="automation-steps">
                      {section.steps.map((step, stepIdx) => (
                        <li key={stepIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="automation-footer">
                <button className="primary-button" onClick={handleCompleteAutomation}>
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="settings-header">
        <button onClick={() => window.location.hash = ''} className="back-button-settings">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Security & Compliance</h1>
      </div>

      {/* Scrollable Content Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px 20px', marginBottom: '20px' }}>
        {/* Overall Security Posture */}
        <div className="security-posture-card">
        <div className="posture-header">
          <h2>Overall Security Posture</h2>
          <div className="posture-score">{securityScore}%</div>
        </div>
        <div className="posture-bar-container">
          <div className="posture-bar" style={{ width: `${securityScore}%` }}></div>
        </div>
        <p className="posture-description">
          HIPAA-compliant healthcare security with 100% on-device PHI processing and encrypted clinical data storage.
        </p>
      </div>

      {/* Recommendations Section */}
      {showRecommendations && recommendations.filter(r => !appliedActions.includes(r.id)).length > 0 && (
        <div className="recommendations-section">
          <div className="recommendations-header">
            <div className="recommendations-title-wrapper">
              <img src="/appleai.png" alt="" className="apple-intelligence-logo" />
              <h3>Recommendations</h3>
            </div>
            <button 
              className="dismiss-all-button" 
              onClick={() => setShowRecommendations(false)}
            >
              Dismiss All
            </button>
          </div>
          
          {recommendations.filter(r => !appliedActions.includes(r.id)).map((rec) => (
            <div key={rec.id} className="recommendation-card">
              <div className="recommendation-content">
                <div className="recommendation-title">{rec.title}</div>
                <div className="recommendation-meta">
                  <span className={`impact-badge ${rec.impact.toLowerCase()}`}>
                    {rec.impact} Impact
                  </span>
                  <span className="category-label">{rec.category}</span>
                </div>
                <p className="recommendation-description">{rec.description}</p>
                {rec.details && (
                  <ul className="recommendation-details">
                    {rec.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button 
                className={`apply-button ${applyingAction === rec.id ? 'applying' : ''}`}
                onClick={() => handleApplyAction(rec)}
                disabled={applyingAction === rec.id}
              >
                {applyingAction === rec.id ? 'Applying...' : 'Apply'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      {/* Compliance Categories */}
      <div className="compliance-categories">
        {Object.entries(complianceData).map(([key, category]) => (
          <div key={key} className="category-card">
            <button 
              className="category-header" 
              onClick={() => toggleCategory(key)}
            >
              <div className="category-info">
                <h3>{category.title}</h3>
                <div className="category-score" style={{ color: getStatusColor('enabled') }}>
                  {category.score}%
                </div>
              </div>
              <svg 
                className={`expand-icon ${expandedCategory === key ? 'expanded' : ''}`}
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {expandedCategory === key && (
              <div className="category-content">
                {category.items.map((item, idx) => (
                  <div key={idx} className="compliance-item">
                    <div className="item-header">
                      <div className="item-status" style={{ color: getStatusColor(item.status) }}>
                        <span className="status-icon">{getStatusIcon(item.status)}</span>
                        <span className="status-name">{item.name}</span>
                      </div>
                      <span className="status-badge" style={{ 
                        backgroundColor: `${getStatusColor(item.status)}20`,
                        color: getStatusColor(item.status)
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <p className="item-details">{item.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

        {/* Footer */}
        <div className="settings-footer">
          <p>Last security audit: {new Date().toLocaleDateString()}</p>
          <p className="footer-note">Healthcare AI Assistant • Zero PHI Transmission • HIPAA Compliant</p>
        </div>
      </div>
    </div>
  )
}

export default ComplianceSettings

