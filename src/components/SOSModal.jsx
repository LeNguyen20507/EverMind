/**
 * SOS Modal - Emergency Grounding Voice Call
 * 
 * Provides AI-powered grounding conversations for Alzheimer's patients.
 * Integrates with EverMind MCP Server for patient profiles and tracking data.
 * 
 * Architecture Flow:
 * 1. Patient data loaded from PatientContext
 * 2. Tracking data fetched from Activity Tracker (MCP Server)
 * 3. Data mapped to MCP profile format
 * 4. System prompt generated with full context
 * 5. VAPI voice call initiated with personalized assistant
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone, PhoneOff, Volume2, VolumeX, X, Mic, MicOff, Heart, AlertCircle, Loader2
} from 'lucide-react';
import { vapi, createPersonalizedAssistant, isVapiConfigured, checkMicrophonePermission } from '../utils/vapiClient';
import { usePatient } from '../context/PatientContext';
import { getMoodHistory, getRecentActivities, getConversationNotes } from '../utils/activityTracker';

// ============================================================================
// PROFILE MAPPING - Converts PatientContext data to MCP Server format
// ============================================================================

/**
 * Extracts calming topics from patient data
 */
const extractCalmingTopics = (patient) => {
  const topics = [];
  
  // Add favorite songs
  if (patient.favoriteSongs?.length > 0) {
    topics.push(...patient.favoriteSongs.slice(0, 2).map(s => `${s.title} by ${s.artist}`));
  }
  
  // Add favorite things
  if (patient.favoriteThings?.activity) topics.push(patient.favoriteThings.activity);
  if (patient.favoriteThings?.place) topics.push(patient.favoriteThings.place);
  
  // Add comfort memories
  if (patient.comfortMemories?.length > 0) topics.push(patient.comfortMemories[0]);
  
  return topics.length > 0 ? topics.slice(0, 5) : ['Music', 'Family memories'];
};

/**
 * Builds core identity string from patient data
 */
const buildCoreIdentity = (patient) => {
  const parts = [
    `${patient.preferredName} is ${patient.age} years old`,
    patient.location && `from ${patient.location}`,
    patient.diagnosis,
    patient.favoriteThings?.era && `They especially love things from the ${patient.favoriteThings.era}`,
    patient.favoriteThings?.person && `Their favorite person to talk about is ${patient.favoriteThings.person}`
  ].filter(Boolean);
  
  return parts.join('. ') + '.';
};

/**
 * Determines voice preference based on patient data
 */
const getVoicePreference = (patient) => {
  if (patient.voicePreference) return patient.voicePreference;
  
  const femaleNames = ['margaret', 'dorothy', 'mary', 'elizabeth', 'patricia'];
  const nameLower = patient.name?.toLowerCase() || '';
  
  return femaleNames.some(name => nameLower.includes(name)) ? 'warm_female' : 'warm_male';
};

/**
 * Fetches and formats tracking data from MCP Server
 */
const fetchTrackingData = (patientId) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Fetch data from MCP Server (Activity Tracker)
  const recentMoods = getMoodHistory(patientId, 7);
  const todayNotes = getConversationNotes(patientId, today);
  const yesterdayNotes = getConversationNotes(patientId, yesterday);
  const recentActivities = getRecentActivities(7, patientId);
  
  // Format mood summary
  const moodSummary = recentMoods
    .filter(d => d.predominantMood)
    .map(d => {
      const note = d.moods?.[0]?.note ? ` (${d.moods[0].note})` : '';
      return `${d.dayOfWeek}: ${d.predominantMood}${note}`;
    })
    .join(', ') || 'No recent mood data';
  
  // Combine and format notes (prioritize by type)
  const allNotes = [
    ...todayNotes.map(n => ({ ...n, isYesterday: false })),
    ...yesterdayNotes.map(n => ({ ...n, isYesterday: true }))
  ];
  
  const formatNote = (n) => {
    const timeLabel = n.isYesterday ? '(yesterday)' : '(today)';
    return `[${n.tag || 'note'}] ${timeLabel} ${n.text}`;
  };
  
  // Sort by priority: emergency > behavior > medical > other
  const sortedNotes = [
    ...allNotes.filter(n => n.tag === 'emergency'),
    ...allNotes.filter(n => n.tag === 'behavior'),
    ...allNotes.filter(n => n.tag === 'medical'),
    ...allNotes.filter(n => !['emergency', 'behavior', 'medical'].includes(n.tag)).slice(0, 3)
  ];
  
  const notesSummary = sortedNotes.map(formatNote).join(' | ') || 'No notes today';
  
  return { moodSummary, notesSummary, recentActivities: recentActivities.slice(0, 10) };
};

/**
 * Maps PatientContext patient to MCP Server profile format
 * This is the bridge between the app and the AI prompt generator
 */
const mapPatientToProfile = (patient) => {
  if (!patient) return null;

  // Extract patient attributes
  const comfortMemories = patient.comfortMemories?.join(', ') || 
    (patient.favoriteSongs?.[0] ? `listening to ${patient.favoriteSongs[0].title}` : 'spending time with family');
  const triggers = patient.triggers?.join(', ') || 'unfamiliar surroundings or sudden changes';
  const calmingStrategies = patient.calmingStrategies?.join(', ') || 'listening to familiar music';
  
  // Fetch tracking data from MCP Server
  const { moodSummary, notesSummary, recentActivities } = fetchTrackingData(patient.id);

  return {
    // Core patient info
    patient_id: patient.id,
    name: patient.name,
    preferred_address: patient.preferredName,
    age: patient.age,
    diagnosis_stage: patient.stage,
    
    // Identity and context
    core_identity: buildCoreIdentity(patient),
    safe_place: patient.favoriteThings?.place 
      ? `${patient.favoriteThings.place} and their home in ${patient.location || 'their community'}`
      : `their home in ${patient.location || 'their community'}`,
    comfort_memory: `${patient.preferredName} finds comfort in ${comfortMemories}.${
      patient.favoriteThings?.food ? ` Their favorite food is ${patient.favoriteThings.food}.` : ''
    }`,
    
    // Triggers and strategies
    common_trigger: triggers,
    calming_strategies: calmingStrategies,
    calming_topics: extractCalmingTopics(patient),
    avoid_topics: patient.triggers || [],
    
    // Voice and contacts
    voice_preference: getVoicePreference(patient),
    emergency_contacts: patient.emergencyContacts || [],
    doctor_name: patient.doctorName,
    doctor_phone: patient.doctorPhone,
    favorite_music: patient.favoriteSongs || [],
    
    // SOS flag for emergency context
    is_sos_call: true,
    
    // MCP Server tracking data
    recent_mood_summary: moodSummary,
    todays_notes: notesSummary,
    recent_activities: recentActivities
  };
};

// ============================================================================
// CALL STATUS CONSTANTS
// ============================================================================

const CALL_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ENDED: 'ended',
  ERROR: 'error'
};

const SILENCE_THRESHOLD_MS = 3000;
const MESSAGE_FADE_DELAY_MS = 20000;

// ============================================================================
// SOS MODAL COMPONENT
// ============================================================================

const SOSModal = ({ isOpen, onClose }) => {
  const { currentPatient } = usePatient();
  
  // Call state
  const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Transcript state
  const [aiMessage, setAiMessage] = useState('');
  const [patientMessage, setPatientMessage] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isPatientSpeaking, setIsPatientSpeaking] = useState(false);

  // Refs for timeout management
  const silenceTimeoutRef = useRef(null);
  const messageFadeTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(silenceTimeoutRef.current);
      clearTimeout(messageFadeTimeoutRef.current);
    };
  }, []);

  // VAPI Event Handlers
  const handleCallStart = useCallback(() => {
    console.log('[SOS] Call started');
    setCallStatus(CALL_STATUS.CONNECTED);
    setAiMessage('Connecting...');
    setPatientMessage('');
  }, []);

  const handleCallEnd = useCallback(() => {
    console.log('[SOS] Call ended');
    setCallStatus(CALL_STATUS.ENDED);
    setAiMessage('Call ended. Take care.');
    setIsAiSpeaking(false);
    setIsPatientSpeaking(false);
  }, []);

  const handleSpeechStart = useCallback(() => {
    setIsPatientSpeaking(true);
  }, []);

  const handleSpeechEnd = useCallback(() => {
    clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      setIsPatientSpeaking(false);
    }, SILENCE_THRESHOLD_MS);
  }, []);

  const handleMessage = useCallback((message) => {
    if (message.type !== 'transcript') {
      // Handle end_conversation function call
      if (message.type === 'function-call' && message.functionCall?.name === 'end_conversation') {
        setTimeout(() => vapi.stop(), 2000);
      }
      return;
    }

    if (message.role === 'assistant') {
      setAiMessage(message.transcript);
      setIsAiSpeaking(true);
      setIsPatientSpeaking(false);
      
      if (message.transcriptType === 'final') {
        setTimeout(() => setIsAiSpeaking(false), 2000);
        clearTimeout(messageFadeTimeoutRef.current);
        messageFadeTimeoutRef.current = setTimeout(() => setAiMessage(''), MESSAGE_FADE_DELAY_MS);
      }
    } else if (message.role === 'user') {
      setPatientMessage(message.transcript);
      setIsPatientSpeaking(true);
      setIsAiSpeaking(false);
      
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => setIsPatientSpeaking(false), SILENCE_THRESHOLD_MS);
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('[SOS] Vapi error:', error);
    setCallStatus(CALL_STATUS.ERROR);
    setErrorMessage('Connection error. Please try again.');
  }, []);

  // Set up VAPI event listeners
  useEffect(() => {
    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
    };
  }, [handleCallStart, handleCallEnd, handleMessage, handleError, handleSpeechStart, handleSpeechEnd]);

  // Start voice call
  const startCall = async () => {
    // Validate configuration
    if (!isVapiConfigured()) {
      setCallStatus(CALL_STATUS.ERROR);
      setErrorMessage('Voice service not configured. Please add VITE_VAPI_PUBLIC_KEY to .env.local');
      return;
    }

    // Check microphone permission
    const hasMic = await checkMicrophonePermission();
    if (!hasMic) {
      setCallStatus(CALL_STATUS.ERROR);
      setErrorMessage('Microphone access denied. Please allow microphone access.');
      return;
    }

    setCallStatus(CALL_STATUS.CONNECTING);
    setAiMessage('Connecting to AI assistant...');
    setPatientMessage('');

    try {
      const profile = mapPatientToProfile(currentPatient);
      if (!profile) throw new Error('No patient selected');

      const assistantConfig = createPersonalizedAssistant(profile);
      console.log('[SOS] Starting call for:', profile.name);
      
      await vapi.start(assistantConfig);
    } catch (error) {
      console.error('[SOS] Failed to start call:', error);
      setCallStatus(CALL_STATUS.ERROR);
      setErrorMessage(`Could not connect: ${error.message}`);
    }
  };

  // End voice call
  const endCall = () => {
    console.log('[SOS] Ending call');
    vapi.stop();
    setCallStatus(CALL_STATUS.ENDED);
    clearTimeout(silenceTimeoutRef.current);
    clearTimeout(messageFadeTimeoutRef.current);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(prev => {
      vapi.setMuted(!prev);
      return !prev;
    });
  };

  // Handle modal close
  const handleClose = () => {
    if (callStatus === CALL_STATUS.CONNECTED || callStatus === CALL_STATUS.CONNECTING) {
      endCall();
    }
    setCallStatus(CALL_STATUS.IDLE);
    setAiMessage('');
    setPatientMessage('');
    setIsAiSpeaking(false);
    setIsPatientSpeaking(false);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="sos-modal-overlay" onClick={handleClose}>
      <div className="sos-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sos-modal-header">
          <div className="sos-header-title">
            <Heart className="sos-heart-icon" size={24} />
            <h2>Grounding Session</h2>
          </div>
          <button className="sos-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Patient Info */}
        {currentPatient && (
          <div className="sos-patient-info">
            <span className="sos-patient-avatar" style={{ background: currentPatient.color }}>
              {currentPatient.avatarUrl ? (
                <img src={currentPatient.avatarUrl} alt={currentPatient.name} 
                     style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                <span style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>
                  {currentPatient.initials}
                </span>
              )}
            </span>
            <span className="sos-patient-name">{currentPatient.preferredName}</span>
            <span className="sos-patient-age">Age {currentPatient.age}</span>
          </div>
        )}

        {/* Call Section */}
        <div className="sos-call-section">
          {/* Idle State */}
          {callStatus === CALL_STATUS.IDLE && (
            <button className="sos-start-call-btn" onClick={startCall}>
              <Phone size={32} />
              <span>Start Grounding Call</span>
              <small>Speak with a calming AI assistant</small>
            </button>
          )}

          {/* Connecting State */}
          {callStatus === CALL_STATUS.CONNECTING && (
            <div className="sos-call-status connecting">
              <Loader2 className="sos-spinner" size={48} />
              <span>Connecting...</span>
            </div>
          )}

          {/* Connected State */}
          {callStatus === CALL_STATUS.CONNECTED && (
            <div className="sos-call-active">
              <div className="sos-voice-indicator">
                <div className="sos-voice-wave">
                  <span /><span /><span /><span /><span />
                </div>
                <span className="sos-call-status-text">Call Active</span>
              </div>

              {/* Transcript Boxes */}
              <div className="sos-transcript-row">
                <div className={`sos-transcript-box ai-box ${isAiSpeaking ? 'speaking' : ''}`}>
                  <div className="transcript-label">
                    <Heart size={14} />
                    <span>AI Assistant</span>
                  </div>
                  <div className="transcript-text">{aiMessage || 'Listening...'}</div>
                </div>

                <div className={`sos-transcript-box patient-box ${isPatientSpeaking ? 'speaking' : ''}`}>
                  <div className="transcript-label">
                    <Mic size={14} />
                    <span>{currentPatient?.preferredName || 'Patient'}</span>
                  </div>
                  <div className="transcript-text">{patientMessage || 'Start speaking...'}</div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="sos-call-controls">
                <button className={`sos-control-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute}>
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button className="sos-control-btn end-call" onClick={endCall}>
                  <PhoneOff size={24} />
                  <span>End Call</span>
                </button>

                <button className={`sos-control-btn ${!isSpeakerOn ? 'active' : ''}`} 
                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}>
                  {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  <span>Speaker</span>
                </button>
              </div>
            </div>
          )}

          {/* Ended State */}
          {callStatus === CALL_STATUS.ENDED && (
            <div className="sos-call-status ended">
              <Heart size={48} />
              <span>Session Complete</span>
              <p className="sos-ended-message">You did great. Take a deep breath.</p>
              <button className="sos-restart-btn" onClick={() => setCallStatus(CALL_STATUS.IDLE)}>
                Start New Session
              </button>
            </div>
          )}

          {/* Error State */}
          {callStatus === CALL_STATUS.ERROR && (
            <div className="sos-call-status error">
              <AlertCircle size={48} />
              <span>{errorMessage || 'Connection error'}</span>
              <button className="sos-restart-btn" onClick={() => setCallStatus(CALL_STATUS.IDLE)}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="sos-calming-message">
          <Heart size={16} />
          <span>You are safe. Help is here.</span>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
