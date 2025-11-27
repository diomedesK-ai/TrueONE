import React, { useState, useEffect } from 'react';
import './FloorMap.css';

const FloorMap = ({ onClose, onNavigateToPatient, isRecording, toggleRecording, isConnected, disconnect }) => {
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({ waiting: 0, active: 0 });
  
  const hospitalStats = { waiting: 12, active: 28 };

  const floors = [
    { id: 1, name: 'ER', critical: 2 },
    { id: 2, name: 'General', critical: 1 },
    { id: 3, name: 'ICU', critical: 2 },
  ];

  // Enhanced room data with patient details
  const roomLayouts = {
    1: [
      { id: 'ER-1', row: 1, col: 1, patients: [
        { name: 'Sofia Garcia', status: 'critical', condition: 'Chest Pain', meds: 'Aspirin, Nitroglycerin', nurse: 'J. Smith', vitals: 'HR: 112, BP: 160/95' }
      ]},
      { id: 'ER-2', row: 1, col: 2, patients: [] },
      { id: 'ER-3', row: 1, col: 3, patients: [
        { name: 'David Thompson', status: 'waiting', condition: 'Laceration', meds: 'Lidocaine PRN', nurse: 'M. Johnson', vitals: 'HR: 78, BP: 120/80' }
      ]},
      { id: 'W-1', row: 2, col: 1, patients: [
        { name: 'Luis Martinez', status: 'waiting', condition: 'Abdominal Pain', meds: 'None', nurse: 'Pending', vitals: 'HR: 82, BP: 118/76' }
      ]},
      { id: 'W-2', row: 2, col: 2, patients: [] },
      { id: 'W-3', row: 2, col: 3, patients: [] },
    ],
    2: [
      { id: '201', row: 1, col: 1, patients: [
        { name: 'Margaret Chen', status: 'stable', condition: 'Post-op Recovery', meds: 'Morphine 4mg IV, Cefazolin', nurse: 'R. Williams', vitals: 'HR: 72, BP: 118/78' }
      ]},
      { id: '202', row: 1, col: 2, patients: [] },
      { id: '203', row: 1, col: 3, patients: [
        { name: 'Elena Rodriguez', status: 'stable', condition: 'Pneumonia', meds: 'Azithromycin, Albuterol', nurse: 'K. Davis', vitals: 'HR: 88, BP: 122/82' },
        { name: 'Carlos Rodriguez', status: 'stable', condition: 'Observation', meds: 'None', nurse: 'K. Davis', vitals: 'HR: 76, BP: 115/75' }
      ]},
      { id: '204', row: 2, col: 1, patients: [] },
      { id: '205', row: 2, col: 2, patients: [
        { name: 'James Wilson', status: 'monitoring', condition: 'Cardiac Arrhythmia', meds: 'Metoprolol 25mg', nurse: 'S. Brown', vitals: 'HR: 94, BP: 138/88' }
      ]},
      { id: '206', row: 2, col: 3, patients: [] },
      { id: '207', row: 3, col: 1, patients: [] },
      { id: '208', row: 3, col: 2, patients: [
        { name: 'Robert Kim', status: 'critical', condition: 'Sepsis', meds: 'Vancomycin, Piperacillin', nurse: 'T. Garcia', vitals: 'HR: 118, BP: 90/60' }
      ]},
      { id: '209', row: 3, col: 3, patients: [
        { name: 'Patricia Lee', status: 'stable', condition: 'Hip Replacement', meds: 'Enoxaparin, Oxycodone', nurse: 'L. Martinez', vitals: 'HR: 68, BP: 124/76' }
      ]},
    ],
    3: [
      { id: '301', row: 1, col: 1, patients: [] },
      { id: '302', row: 1, col: 2, patients: [
        { name: 'Michael Brown', status: 'critical', condition: 'Respiratory Failure', meds: 'Propofol, Fentanyl, Norepinephrine', nurse: 'A. Wilson', vitals: 'HR: 105, BP: 85/55, Vent: AC 12/50%' }
      ]},
      { id: '303', row: 2, col: 1, patients: [
        { name: 'Amanda Davis', status: 'critical', condition: 'Multi-organ Failure', meds: 'Vasopressin, Insulin drip', nurse: 'B. Taylor', vitals: 'HR: 122, BP: 78/48' }
      ]},
      { id: '304', row: 2, col: 2, patients: [] },
    ],
  };

  // Navigation directions based on floor
  const getDirections = (floorId, roomId) => {
    const floorDirections = {
      1: { base: 'From main entrance: Turn left at reception', rooms: { 'ER-1': 'First bay on left', 'ER-2': 'Second bay', 'ER-3': 'Third bay', 'W-1': 'Waiting area A', 'W-2': 'Waiting area B', 'W-3': 'Waiting area C' }},
      2: { base: 'Take elevator to Floor 2, exit right', rooms: { '201': 'First door on left', '202': 'Second door left', '203': 'End of hall left', '204': 'First door right', '205': 'Second door right', '206': 'Third door right', '207': 'Corner room left', '208': 'Corner room center', '209': 'Corner room right' }},
      3: { base: 'Take elevator to Floor 3 (ICU), badge required', rooms: { '301': 'Bay 1', '302': 'Bay 2', '303': 'Bay 3', '304': 'Bay 4' }}
    };
    const floor = floorDirections[floorId];
    return floor ? `${floor.base}. ${floor.rooms[roomId] || 'Check nurse station'}` : '';
  };

  useEffect(() => {
    const duration = 600;
    const steps = 15;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        waiting: Math.round(hospitalStats.waiting * progress),
        active: Math.round(hospitalStats.active * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#ff453a';
      case 'monitoring': return '#ff9f0a';
      case 'stable': return '#30d158';
      case 'waiting': return '#8e8e93';
      default: return 'rgba(255,255,255,0.15)';
    }
  };

  const getPriorityStatus = (patients) => {
    if (!patients || patients.length === 0) return null;
    // Return highest priority status
    if (patients.some(p => p.status === 'critical')) return 'critical';
    if (patients.some(p => p.status === 'monitoring')) return 'monitoring';
    if (patients.some(p => p.status === 'waiting')) return 'waiting';
    return 'stable';
  };

  const currentRooms = roomLayouts[selectedFloor] || [];
  const selectedRoomData = selectedRoom ? currentRooms.find(r => r.id === selectedRoom) : null;

  return (
    <div className="chat-screen floor-map-wrapper">
      {/* Dynamic Island Controls */}
      {isConnected && (
        <div className="dynamic-island-controls">
          <button
            className={`island-control-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? "Pause" : "Record"}
          >
            {isRecording ? (
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
          {isRecording && (
            <span className="island-status-text">Listening...</span>
          )}
          <button
            className="island-control-btn"
            onClick={disconnect}
            title="Stop"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.7)">
              <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="fm-header">
        <button className="fm-back" onClick={onClose}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="fm-title">Floor Map</span>
        <div className="fm-stats">
          <span className="fm-stat">{animatedStats.waiting} waiting</span>
          <span className="fm-stat cyan">{animatedStats.active} active</span>
        </div>
      </div>

      {/* Floor Tabs - Sliding Pill */}
      <div className="fm-floors" data-active={selectedFloor - 1}>
        {floors.map(floor => (
          <button
            key={floor.id}
            className={`fm-floor-tab ${selectedFloor === floor.id ? 'active' : ''}`}
            onClick={() => { setSelectedFloor(floor.id); setSelectedRoom(null); }}
          >
            {floor.name}
            {floor.critical > 0 && <span className="fm-critical-dot"></span>}
          </button>
        ))}
      </div>

      {/* Visual Floor Plan - Condensed */}
      <div className="fm-plan-container">
        <div className="fm-plan">
          <div className="fm-corridor-compact">
            <span>← Elevator</span>
            <span>Corridor</span>
            <span>Stairs →</span>
          </div>
          
          <div className="fm-rooms-compact">
            {currentRooms.map(room => {
              const patientCount = room.patients?.length || 0;
              const priorityStatus = getPriorityStatus(room.patients);
              
              return (
                <div
                  key={room.id}
                  className={`fm-room-compact ${patientCount > 0 ? 'occupied' : 'empty'} ${selectedRoom === room.id ? 'selected' : ''}`}
                  style={{ 
                    gridRow: room.row, 
                    gridColumn: room.col,
                    '--status-color': priorityStatus ? getStatusColor(priorityStatus) : 'transparent'
                  }}
                  onClick={() => setSelectedRoom(patientCount > 0 ? room.id : null)}
                >
                  <span className="fm-room-id">{room.id}</span>
                  {patientCount > 0 && (
                    <span 
                      className="fm-patient-count" 
                      style={{ background: getStatusColor(priorityStatus) }}
                    >
                      {patientCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="fm-corridor-compact bottom">
            <span>Nurse Station</span>
          </div>
        </div>

        <div className="fm-legend-compact">
          <span className="fm-legend-item"><span className="dot critical"></span>Critical</span>
          <span className="fm-legend-item"><span className="dot monitoring"></span>Monitor</span>
          <span className="fm-legend-item"><span className="dot stable"></span>Stable</span>
        </div>
      </div>

      {/* Bottom Section - Patient Details */}
      <div className="fm-detail-section">
        {selectedRoomData && selectedRoomData.patients?.length > 0 ? (
          <div className="fm-patient-details">
            <div className="fm-detail-header">
              <span className="fm-detail-room">Room {selectedRoomData.id}</span>
              <span className="fm-detail-count">{selectedRoomData.patients.length} patient{selectedRoomData.patients.length > 1 ? 's' : ''}</span>
            </div>
            
            <div className="fm-detail-directions">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L12 22M12 2L6 8M12 2L18 8"/>
              </svg>
              <span>{getDirections(selectedFloor, selectedRoomData.id)}</span>
            </div>
            
            <div className="fm-patients-list">
              {selectedRoomData.patients.map((patient, idx) => (
                <div key={idx} className="fm-patient-item" style={{ '--status-color': getStatusColor(patient.status) }}>
                  <div className="fm-patient-header">
                    <span className="fm-patient-name">{patient.name}</span>
                    <span className={`fm-patient-status-badge ${patient.status}`}>
                      {patient.status}
                    </span>
                  </div>
                  <div className="fm-patient-info">
                    <div className="fm-info-row">
                      <span className="fm-info-label">Condition:</span>
                      <span className="fm-info-value">{patient.condition}</span>
                    </div>
                    <div className="fm-info-row">
                      <span className="fm-info-label">Vitals:</span>
                      <span className="fm-info-value vitals">{patient.vitals}</span>
                    </div>
                    <div className="fm-info-row">
                      <span className="fm-info-label">Meds:</span>
                      <span className="fm-info-value">{patient.meds}</span>
                    </div>
                    <div className="fm-info-row">
                      <span className="fm-info-label">Nurse:</span>
                      <span className="fm-info-value">{patient.nurse}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="fm-hint-section">
            <p className="fm-hint-main">Tap a room to view patient details</p>
            <p className="fm-hint-sub">Say "take me to room 205" or "find patient Chen"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorMap;
