/**
 * SOS Modal - Emergency Grounding Voice Call
 * Uses PatientContext for profile data and personalized VAPI assistant
 * 
 * Features:
 * - Personalized AI grounding conversations based on selected patient
 * - Delayed transcript display (7-10 seconds after AI speaks for less sensitivity)
 * - 3-second silence detection before AI proceeds
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  X, 
  Mic, 
  MicOff,
  Heart,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { vapi, createPersonalizedAssistant, isVapiConfigured, checkMicrophonePermission } from '../utils/vapiClient';
import { usePatient } from '../context/PatientContext';

// Map PatientContext patient to MCP-style profile format for promptGenerator
const mapPatientToProfile = (patient) => {
  if (!patient) return null;
  
  // Check if this is a hackathon participant (has hackathonProject field)
  const isHackathonParticipant = !!patient.hackathonProject;
  
  // Generate context based on patient type
  let coreIdentity, safePlace, comfortMemory, commonTrigger, calmingTopics;
  
  if (isHackathonParticipant) {
    // Hackathon participant profile
    coreIdentity = `${patient.preferredName} is an ${patient.age}-year-old hackathon participant working on "${patient.hackathonProject}". The deadline is ${patient.hackathonDeadline}.`;
    safePlace = `working on their hackathon project in ${patient.location}`;
    comfortMemory = `${patient.preferredName} finds comfort in ${patient.copingStrategies?.join(', ') || 'taking breaks and talking things through'}.`;
    commonTrigger = patient.stressors?.join(', ') || 'deadline pressure and technical challenges';
    calmingTopics = [
      `their hackathon project progress`,
      `what they've accomplished so far`,
      ...(patient.favoriteSongs?.map(s => s.title) || [])
    ];
  } else {
    // Regular patient profile (Alzheimer's care)
    const favoriteMemory = patient.favoriteSongs?.[0] 
      ? `listening to ${patient.favoriteSongs[0].title} by ${patient.favoriteSongs[0].artist}`
      : 'spending time with family';
    coreIdentity = `${patient.preferredName} is ${patient.age} years old from ${patient.location}.`;
    safePlace = `their home in ${patient.location}`;
    comfortMemory = `${patient.preferredName} finds comfort in ${favoriteMemory}.`;
    commonTrigger = 'unfamiliar surroundings or sudden changes';
    calmingTopics = patient.favoriteSongs?.map(s => s.title) || ['Music', 'Family memories'];
  }
  
  return {
    patient_id: patient.id,
    name: patient.name,
    preferred_address: patient.preferredName,
    age: patient.age,
    diagnosis_stage: patient.stage,
    core_identity: coreIdentity,
    safe_place: safePlace,
    comfort_memory: comfortMemory,
    common_trigger: commonTrigger,
    voice_preference: 'warm_female',
    calming_topics: calmingTopics,
    avoid_topics: patient.stressors || patient.allergies || [],
    favorite_music: patient.favoriteSongs || [],
    // Hackathon specific
    hackathonProject: patient.hackathonProject,
    hackathonDeadline: patient.hackathonDeadline,
    hackathonTasks: patient.hackathonTasks
  };
};

const SOSModal = ({ isOpen, onClose }) => {
  // Get current patient from context (synced with top-right switcher)
  const { currentPatient } = usePatient();
  
  // Call states
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, connected, ended, error
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  
  // Transcript management with delay
  const [currentMessage, setCurrentMessage] = useState('');
  const [visibleMessage, setVisibleMessage] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptTimeoutRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Configuration
  const TRANSCRIPT_DELAY_MS = 8000; // 8 seconds delay before showing transcript
  const SILENCE_THRESHOLD_MS = 3000; // 3 seconds of silence before AI proceeds

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (transcriptTimeoutRef.current) clearTimeout(transcriptTimeoutRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  // Set up Vapi event listeners
  useEffect(() => {
    const handleCallStart = () => {
      console.log('[SOS] Call started');
      setCallStatus('connected');
      setCurrentMessage('Connected. AI assistant is speaking...');
      setShowTranscript(false);
    };

    const handleCallEnd = () => {
      console.log('[SOS] Call ended');
      setCallStatus('ended');
      setCurrentMessage('Call ended.');
      setShowTranscript(true);
      setVisibleMessage('Call ended. Take care.');
    };

    const handleMessage = (message) => {
      console.log('[SOS] Message:', message.type, message.role);
      
      if (message.type === 'transcript') {
        if (message.role === 'assistant') {
          // AI is speaking - show immediately with "AI:" prefix
          const transcript = message.transcript;
          setCurrentMessage(transcript);
          setVisibleMessage(`AI: ${transcript}`);
          setShowTranscript(true);
        } else if (message.role === 'user') {
          // User is speaking - show immediately with "You:" prefix
          setVisibleMessage(`You: ${message.transcript}`);
          setShowTranscript(true);
          
          // Clear and restart silence timer
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // After 3 seconds of silence, AI can proceed
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('[SOS] User silence detected - AI can proceed');
          }, SILENCE_THRESHOLD_MS);
        }
      }
      
      // Handle function calls (end_conversation)
      if (message.type === 'function-call' && message.functionCall?.name === 'end_conversation') {
        console.log('[SOS] End conversation function called');
        setTimeout(() => {
          endCall();
        }, 2000);
      }
    };

    const handleError = (error) => {
      console.error('[SOS] Vapi error:', error);
      setCallStatus('error');
      setCurrentMessage('Connection error. Please try again.');
    };

    const handleSpeechStart = () => {
      console.log('[SOS] Speech started');
      setVisibleMessage('Listening...');
      setShowTranscript(true);
    };

    const handleSpeechEnd = () => {
      console.log('[SOS] Speech ended');
      // Start silence timer when user stops speaking
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('[SOS] 3s silence - AI can proceed');
        setVisibleMessage('Processing...');
      }, SILENCE_THRESHOLD_MS);
    };

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
  }, []);

  const startCall = async () => {
    // Check configuration
    if (!isVapiConfigured()) {
      setCallStatus('error');
      setCurrentMessage('Voice service not configured. Please add VITE_VAPI_API_KEY to .env.local');
      return;
    }

    // Check microphone permission
    const hasMic = await checkMicrophonePermission();
    if (!hasMic) {
      setCallStatus('error');
      setCurrentMessage('Microphone access denied. Please allow microphone access.');
      return;
    }

    setCallStatus('connecting');
    setCurrentMessage('Connecting to AI assistant...');
    setShowTranscript(false);

    try {
      // Map current patient to profile format
      const profile = mapPatientToProfile(currentPatient);
      
      if (!profile) {
        throw new Error('No patient selected');
      }

      // Create personalized assistant configuration
      const assistantConfig = createPersonalizedAssistant(profile);
      console.log('[SOS] Starting call for:', profile.name);
      
      // Start the call
      await vapi.start(assistantConfig);
      
    } catch (error) {
      console.error('[SOS] Failed to start call:', error);
      setCallStatus('error');
      setCurrentMessage(`Could not connect: ${error.message}`);
    }
  };

  const endCall = () => {
    console.log('[SOS] Ending call');
    vapi.stop();
    setCallStatus('ended');
    
    // Clear all timeouts
    if (transcriptTimeoutRef.current) clearTimeout(transcriptTimeoutRef.current);
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    vapi.setMuted(!isMuted);
  };

  const handleClose = () => {
    if (callStatus === 'connected' || callStatus === 'connecting') {
      endCall();
    }
    setCallStatus('idle');
    setCurrentMessage('');
    setVisibleMessage('');
    setShowTranscript(false);
    onClose();
  };

  if (!isOpen) return null;

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

        {/* Patient Info from Context */}
        {currentPatient && (
          <div className="sos-patient-info">
            <span className="sos-patient-avatar">{currentPatient.avatar}</span>
            <span className="sos-patient-name">{currentPatient.preferredName}</span>
            <span className="sos-patient-age">Age {currentPatient.age}</span>
          </div>
        )}

        {/* Voice Call Section */}
        <div className="sos-call-section">
          {callStatus === 'idle' && (
            <button className="sos-start-call-btn" onClick={startCall}>
              <Phone size={32} />
              <span>Start Grounding Call</span>
              <small>Speak with a calming AI assistant</small>
            </button>
          )}

          {callStatus === 'connecting' && (
            <div className="sos-call-status connecting">
              <Loader2 className="sos-spinner" size={48} />
              <span>Connecting...</span>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="sos-call-active">
              <div className="sos-voice-indicator">
                <div className="sos-voice-wave">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span className="sos-call-status-text">Call Active</span>
              </div>

              {/* Transcript with delayed display */}
              {showTranscript && visibleMessage && (
                <div className="sos-call-message">
                  {visibleMessage}
                </div>
              )}

              <div className="sos-call-controls">
                <button 
                  className={`sos-control-btn ${isMuted ? 'active' : ''}`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button 
                  className="sos-control-btn end-call"
                  onClick={endCall}
                >
                  <PhoneOff size={24} />
                  <span>End Call</span>
                </button>

                <button 
                  className={`sos-control-btn ${!isSpeakerOn ? 'active' : ''}`}
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  <span>Speaker</span>
                </button>
              </div>
            </div>
          )}

          {callStatus === 'ended' && (
            <div className="sos-call-status ended">
              <Heart size={48} />
              <span>Session Complete</span>
              <p className="sos-ended-message">You did great. Take a deep breath.</p>
              <button className="sos-restart-btn" onClick={() => setCallStatus('idle')}>
                Start New Session
              </button>
            </div>
          )}

          {callStatus === 'error' && (
            <div className="sos-call-status error">
              <AlertCircle size={48} />
              <span>{currentMessage}</span>
              <button className="sos-restart-btn" onClick={() => setCallStatus('idle')}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Calming Message */}
        <div className="sos-calming-message">
          <Heart size={16} />
          <span>You are safe. Help is here.</span>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
