
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Loader,
  AlertCircle,
  CheckCircle,
  User,
  ArrowLeft,
  MessageCircle,
  Clock,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  vapi,
  createPersonalizedAssistant,
  checkMicrophonePermission,
  isVapiConfigured
} from '../utils/vapiClient';
import { fetchPatientProfile, initMcpClient } from '../utils/mcpClient';
import { profiles } from '../utils/profiles';
import './VoiceSession.css';

// Session phases
const PHASE = {
  SELECT_PROFILE: 'select_profile',
  LOADING_PROFILE: 'loading_profile',
  PRE_CALL: 'pre_call',
  CONNECTING: 'connecting',
  ACTIVE_CALL: 'active_call',
  ENDING_CALL: 'ending_call',
  SUMMARY: 'summary',
  ERROR: 'error'
};

// Error types
const ERROR_TYPE = {
  MCP_CONNECTION: 'mcp_connection',
  VAPI_CONNECTION: 'vapi_connection',
  MICROPHONE: 'microphone',
  CALL_DROPPED: 'call_dropped',
  UNKNOWN: 'unknown'
};

const VoiceSession = () => {
  const navigate = useNavigate();

  // Session state
  const [phase, setPhase] = useState(PHASE.SELECT_PROFILE);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [micPermission, setMicPermission] = useState(null);

  // Call state
  const [exchangeCount, setExchangeCount] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [patientState, setPatientState] = useState(null);
  const [speakingIndicator, setSpeakingIndicator] = useState(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [callEndTime, setCallEndTime] = useState(null);
  const [statusText, setStatusText] = useState(null); // For Processing.../Listening... text
  const [lastAiMessage, setLastAiMessage] = useState(''); // Track last AI message for silence prompts
  const [silenceCount, setSilenceCount] = useState(0); // Track how many times we've prompted due to silence

  // Refs
  const timerRef = useRef(null);
  const transcriptRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isConfigured = isVapiConfigured();

  // Caring prompts that escalate with compassion
  const caringPrompts = [
    "Take your time, I'm right here with you. There's no rush at all.",
    "I can see you might need a moment. I'm here whenever you're ready to talk. You matter to me.",
    "I truly care about how you're doing. Please know I'm listening whenever you want to share.",
    "You are so important, and I'm here for you. Whether you want to talk or just sit together quietly, I'm not going anywhere."
  ];

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Reset silence timer - call this when patient speaks or AI responds
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // Only start silence timer during active call
    if (phase === PHASE.ACTIVE_CALL && speakingIndicator !== 'ai') {
      silenceTimerRef.current = setTimeout(() => {
        // Patient has been quiet for 7 seconds
        setSilenceCount(prev => {
          const newCount = Math.min(prev + 1, caringPrompts.length - 1);
          const caringMessage = caringPrompts[newCount];

          // Add caring prompt to transcript
          setTranscript(prevTranscript => [
            ...prevTranscript,
            {
              role: 'assistant',
              text: caringMessage,
              timestamp: new Date().toLocaleTimeString(),
              isFinal: true,
              isCaringPrompt: true
            }
          ]);

          // Use VAPI to speak the caring message
          try {
            vapi.say(caringMessage);
          } catch (err) {
            console.warn('[VoiceSession] Could not speak caring prompt:', err);
          }

          return newCount;
        });

        // Set up next silence check (escalate every 7 seconds)
        resetSilenceTimer();
      }, 7000); // 7 seconds of silence
    }
  }, [phase, speakingIndicator, caringPrompts]);

  // Start silence timer when AI finishes speaking
  useEffect(() => {
    if (phase === PHASE.ACTIVE_CALL && speakingIndicator === null) {
      resetSilenceTimer();
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [phase, speakingIndicator, resetSilenceTimer]);

  // Initialize MCP client
  useEffect(() => {
    initMcpClient().then(connected => {
      console.log('[VoiceSession] MCP client initialized:', connected);
    });
  }, []);

  // VAPI event listeners
  useEffect(() => {
    const handleCallStart = () => {
      console.log('[VAPI] Call started');
      setPhase(PHASE.ACTIVE_CALL);
      setError(null);
      setExchangeCount(0);
      setSpeakingIndicator(null);
      setSilenceCount(0);
      setStatusText('Listening...');

      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    };

    const handleCallEnd = () => {
      console.log('[VAPI] Call ended');

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      setStatusText(null);
      setCallEndTime(new Date());
      setPhase(PHASE.ENDING_CALL);
      setTimeout(() => setPhase(PHASE.SUMMARY), 1500);
    };

    const handleSpeechStart = () => {
      console.log('[VAPI] AI speaking...');
      setSpeakingIndicator('ai');
      setStatusText('Processing...');

      // Clear silence timer while AI is speaking
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    const handleSpeechEnd = () => {
      console.log('[VAPI] AI finished speaking');
      setSpeakingIndicator(null);
      setStatusText('Listening...');
      setSilenceCount(0); // Reset silence count when AI finishes speaking
    };

    // Only show FINAL transcripts to avoid sensitivity
    const handleMessage = (message) => {
      console.log('[VAPI] Message:', message);

      if (message.type === 'transcript' && message.transcript) {
        // When user speaks, just reset silence timer (don't show their text)
        if (message.role === 'user' && message.transcriptType === 'final') {
          // Reset silence counter and timer when patient speaks
          setSilenceCount(0);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        }

        // ONLY add AI (assistant) final transcripts to the display
        if (message.transcriptType === 'final' && message.role === 'assistant') {
          setTranscript(prev => {
            const exists = prev.some(t =>
              t.text === message.transcript &&
              t.role === message.role &&
              t.isFinal
            );
            if (exists) return prev;

            return [...prev, {
              role: message.role,
              text: message.transcript,
              timestamp: new Date().toLocaleTimeString(),
              isFinal: true
            }];
          });

          setExchangeCount(prev => Math.min(prev + 1, 3));
          setLastAiMessage(message.transcript);
        }
      }

      if (message.type === 'function-call' && message.functionCall) {
        const { name, parameters } = message.functionCall;
        if (name === 'end_conversation') {
          handleEndConversationFunction(parameters);
        }
      }
    };

    const handleError = (err) => {
      console.error('[VAPI] Error:', err);

      let errorMsg = 'An error occurred during the call';
      if (typeof err === 'string') errorMsg = err;
      else if (err?.message) errorMsg = err.message;
      else if (err?.error?.message) errorMsg = err.error.message;

      if (phase === PHASE.ACTIVE_CALL) {
        setErrorType(ERROR_TYPE.CALL_DROPPED);
        errorMsg = 'The call was disconnected. This may be due to internet connection issues.';
      } else {
        setErrorType(ERROR_TYPE.VAPI_CONNECTION);
      }

      setError(String(errorMsg));
      setPhase(PHASE.ERROR);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
      if (timerRef.current) clearInterval(timerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [phase]);

  const handleEndConversationFunction = useCallback((parameters) => {
    console.log(`[VoiceSession] AI ending conversation, patient state: ${parameters?.patient_state}`);
    setPatientState(parameters?.patient_state || 'calm');
    setTimeout(() => vapi.stop(), 2000);
  }, []);

  const handleSelectProfile = async (patientId) => {
    setPhase(PHASE.LOADING_PROFILE);
    setError(null);
    setErrorType(null);

    try {
      let profileData;
      try {
        profileData = await fetchPatientProfile(patientId);
      } catch (mcpError) {
        console.warn('[VoiceSession] MCP fetch failed, using local profiles');
        profileData = profiles[patientId];
        if (!profileData) throw new Error(`Profile not found: ${patientId}`);
      }

      setProfile(profileData);
      setPhase(PHASE.PRE_CALL);
    } catch (err) {
      setError('Unable to load patient profiles. Please try again.');
      setErrorType(ERROR_TYPE.MCP_CONNECTION);
      setPhase(PHASE.ERROR);
    }
  };

  const startVoiceSession = async () => {
    if (!profile) return;
    if (!isConfigured) {
      setError('VAPI API key not configured.');
      setErrorType(ERROR_TYPE.VAPI_CONNECTION);
      setPhase(PHASE.ERROR);
      return;
    }

    const hasMicPermission = await checkMicrophonePermission();
    if (!hasMicPermission) {
      setMicPermission('denied');
      setError('Microphone access is required for voice sessions.');
      setErrorType(ERROR_TYPE.MICROPHONE);
      setPhase(PHASE.ERROR);
      return;
    }
    setMicPermission('granted');

    try {
      setPhase(PHASE.CONNECTING);
      setError(null);
      setTranscript([]);
      setCallDuration(0);
      setExchangeCount(0);
      setPatientState(null);
      setCallEndTime(null);

      const assistant = createPersonalizedAssistant(profile);
      console.log('[VoiceSession] Starting Vapi with config:', assistant);
      await vapi.start(assistant);
    } catch (err) {
      console.error('[VoiceSession] Failed to start Vapi:', err);
      // Show actual error message for debugging
      const errorMessage = err.message || err.toString();
      setError(`Connection failed: ${errorMessage}`);
      setErrorType(ERROR_TYPE.VAPI_CONNECTION);
      setPhase(PHASE.ERROR);
    }
  };

  const confirmEndCall = () => {
    setShowEndConfirm(false);
    vapi.stop();
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      vapi.setMuted(newMuted);
      return newMuted;
    });
  };

  const resetSession = () => {
    setPhase(PHASE.SELECT_PROFILE);
    setProfile(null);
    setTranscript([]);
    setCallDuration(0);
    setExchangeCount(0);
    setPatientState(null);
    setError(null);
    setErrorType(null);
    setShowEndConfirm(false);
    setSilenceCount(0);
    setStatusText(null);
    setLastAiMessage('');
  };

  const restartWithSameProfile = () => {
    setPhase(PHASE.PRE_CALL);
    setTranscript([]);
    setCallDuration(0);
    setExchangeCount(0);
    setPatientState(null);
    setError(null);
    setSilenceCount(0);
    setStatusText(null);
    setLastAiMessage('');
  };

  const handleRetry = () => {
    if (errorType === ERROR_TYPE.MCP_CONNECTION && profile) {
      handleSelectProfile(profile.patient_id);
    } else if (errorType === ERROR_TYPE.MICROPHONE) {
      checkMicrophonePermission().then(granted => {
        if (granted) {
          setMicPermission('granted');
          setError(null);
          setPhase(PHASE.PRE_CALL);
        }
      });
    } else {
      setError(null);
      setPhase(profile ? PHASE.PRE_CALL : PHASE.SELECT_PROFILE);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPatientStateInfo = () => {
    switch (patientState) {
      case 'calm': return { color: '#7FB069', emoji: '🟢', text: 'Patient seemed calm' };
      case 'slightly_agitated': return { color: '#E8A87C', emoji: '🟡', text: 'Patient seemed slightly agitated' };
      case 'very_agitated': return { color: '#D88373', emoji: '🔴', text: 'Patient seemed very agitated' };
      default: return { color: '#7FB069', emoji: '🟢', text: 'Session completed' };
    }
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderProfileSelection = () => (
    <div className="vs-container vs-profile-select">
      <div className="vs-header-brand">
        <h1 className="vs-title">Grounding Companion</h1>
        <p className="vs-subtitle">Compassionate AI for Alzheimer's Care</p>
      </div>

      <div className="vs-profile-cards">
        <button className="vs-profile-card" onClick={() => handleSelectProfile('margaret_chen')}>
          <div className="vs-avatar vs-avatar-margaret">
            <span className="vs-avatar-emoji">👩‍🏫</span>
          </div>
          <h3 className="vs-card-name">Margaret Chen</h3>
          <p className="vs-card-age">78 years old</p>
          <p className="vs-card-desc">
            Retired elementary school teacher who taught 2nd grade for 35 years.
            Loves her rose garden and Sunday tea with her daughter.
          </p>
          <div className="vs-card-button">
            <Phone size={18} />
            Select Profile
          </div>
        </button>

        <button className="vs-profile-card" onClick={() => handleSelectProfile('robert_williams')}>
          <div className="vs-avatar vs-avatar-robert">
            <span className="vs-avatar-emoji">👨‍💼</span>
          </div>
          <h3 className="vs-card-name">Robert Williams</h3>
          <p className="vs-card-age">71 years old</p>
          <p className="vs-card-desc">
            Retired postal worker who delivered mail for 40 years.
            Enjoys fishing trips and visits from his grandchildren Emma and Jake.
          </p>
          <div className="vs-card-button">
            <Phone size={18} />
            Select Profile
          </div>
        </button>
      </div>

      <button className="vs-back-link" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to Home
      </button>
    </div>
  );

  const renderLoadingProfile = () => (
    <div className="vs-container vs-center">
      <div className="vs-loading-box">
        <Loader size={50} className="vs-spinner" />
        <h2>Loading profile...</h2>
        <p>Fetching patient data</p>
      </div>
    </div>
  );

  const renderPreCall = () => (
    <div className="vs-container vs-pre-call">
      <button className="vs-change-profile-btn" onClick={resetSession}>
        <User size={16} />
        Change Profile
      </button>

      <div className="vs-pre-call-content">
        <div className="vs-patient-preview">
          <div className={`vs-avatar-large ${profile.voice_preference === 'warm_female' ? 'vs-avatar-margaret' : 'vs-avatar-robert'}`}>
            <span className="vs-avatar-emoji-large">
              {profile.voice_preference === 'warm_female' ? '👩‍🏫' : '👨‍💼'}
            </span>
          </div>
          <h2 className="vs-patient-name">{profile.name}</h2>
          <p className="vs-patient-age">{profile.age} years old</p>
        </div>

        <p className="vs-pre-call-heading">
          You're about to start a grounding session with <strong>{profile.preferred_address}</strong>
        </p>

        <div className="vs-tips-section">
          <button className="vs-tips-header" onClick={() => setShowTips(!showTips)}>
            <Info size={18} />
            <span>Grounding Tips</span>
            {showTips ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showTips && (
            <ul className="vs-tips-list">
              <li>Hand the phone directly to {profile.preferred_address}</li>
              <li>Let them speak naturally—the AI will guide them</li>
              <li>You can end the call anytime if needed</li>
              <li>The conversation will last about 2-3 minutes</li>
            </ul>
          )}
        </div>

        <button className="vs-start-button" onClick={startVoiceSession}>
          <Phone size={22} />
          Start Voice Session
        </button>

        <button className="vs-change-link" onClick={resetSession}>
          <ArrowLeft size={16} />
          Change Profile
        </button>
      </div>
    </div>
  );

  const renderConnecting = () => (
    <div className="vs-container vs-center">
      <div className={`vs-avatar-large ${profile?.voice_preference === 'warm_female' ? 'vs-avatar-margaret' : 'vs-avatar-robert'}`}>
        <span className="vs-avatar-emoji-large">
          {profile?.voice_preference === 'warm_female' ? '👩‍🏫' : '👨‍💼'}
        </span>
      </div>
      <h2 className="vs-connecting-name">{profile?.name}</h2>
      <div className="vs-connecting-spinner">
        <Loader size={40} className="vs-spinner" />
      </div>
      <p className="vs-connecting-text">Connecting call...</p>
      <p className="vs-connecting-subtext">This should take just a moment</p>
    </div>
  );

  const renderActiveCall = () => (
    <div className="vs-container vs-active-call">
      <div className="vs-call-topbar">
        <div className="vs-call-patient-info">
          <div className={`vs-avatar-small ${profile?.voice_preference === 'warm_female' ? 'vs-avatar-margaret' : 'vs-avatar-robert'}`}>
            <span className="vs-avatar-emoji-small">
              {profile?.voice_preference === 'warm_female' ? '👩‍🏫' : '👨‍💼'}
            </span>
          </div>
          <div className="vs-call-patient-text">
            <span className="vs-call-patient-name">{profile?.preferred_address}</span>
            <span className="vs-call-status">
              <span className="vs-status-dot"></span>
              In Session
            </span>
          </div>
        </div>

        <div className="vs-call-meta">
          <span className="vs-exchange-badge">Exchange {exchangeCount} of 3</span>
          <div className="vs-exchange-dots">
            {[1, 2, 3].map(num => (
              <div key={num} className={`vs-dot ${num <= exchangeCount ? 'filled' : ''}`} />
            ))}
          </div>
        </div>

        <button className="vs-end-btn-small" onClick={() => setShowEndConfirm(true)} title="End Call">
          <PhoneOff size={20} />
        </button>
      </div>

      <div className="vs-transcript" ref={transcriptRef}>
        {transcript.length === 0 ? (
          <div className="vs-transcript-empty">
            <MessageCircle size={40} />
            <p>Waiting for AI to speak...</p>
          </div>
        ) : (
          transcript.map((msg, idx) => (
            <div
              key={idx}
              className={`vs-message vs-message-ai ${msg.isCaringPrompt ? 'vs-message-caring' : ''} ${idx === transcript.length - 1 ? 'vs-message-latest' : ''}`}
            >
              <span className="vs-message-role">
                {msg.isCaringPrompt ? '💚 AI Companion' : 'AI Companion'}
              </span>
              <p className="vs-message-text">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="vs-status-bar">
        <div className="vs-status-text vs-status-listening">
          <span className="vs-status-pulse"></span>
          Listening...
        </div>
      </div>

      <div className="vs-call-controls">
        <button className={`vs-control-btn ${isMuted ? 'vs-muted' : ''}`} onClick={toggleMute}>
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button className="vs-control-btn vs-end-call-btn" onClick={() => setShowEndConfirm(true)}>
          <PhoneOff size={24} />
          <span>End Call</span>
        </button>

        <div className="vs-control-btn vs-duration">
          <Clock size={24} />
          <span>{formatDuration(callDuration)}</span>
        </div>
      </div>

      {showEndConfirm && (
        <div className="vs-modal-overlay">
          <div className="vs-modal">
            <h3>End this session?</h3>
            <p>Are you sure you want to end this grounding session?</p>
            <div className="vs-modal-actions">
              <button className="vs-modal-cancel" onClick={() => setShowEndConfirm(false)}>Cancel</button>
              <button className="vs-modal-confirm" onClick={confirmEndCall}>End Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEndingCall = () => (
    <div className="vs-container vs-center">
      <Loader size={50} className="vs-spinner" />
      <h2>Ending session...</h2>
    </div>
  );

  const renderSummary = () => {
    const stateInfo = getPatientStateInfo();

    return (
      <div className="vs-container vs-summary">
        <div className="vs-summary-header">
          <CheckCircle size={60} color="#7FB069" />
          <h2>Session Completed</h2>
          <p className="vs-summary-patient">{profile?.name}</p>
          <p className="vs-summary-time">
            Session ended at {callEndTime?.toLocaleTimeString() || new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="vs-state-badge" style={{ backgroundColor: stateInfo.color }}>
          {stateInfo.emoji} {stateInfo.text}
        </div>

        <div className="vs-summary-stats">
          <div className="vs-stat">
            <span className="vs-stat-value">{exchangeCount}</span>
            <span className="vs-stat-label">Exchanges</span>
          </div>
          <div className="vs-stat">
            <span className="vs-stat-value">{formatDuration(callDuration)}</span>
            <span className="vs-stat-label">Duration</span>
          </div>
        </div>

        <div className="vs-transcript-box">
          <h3>Conversation Transcript</h3>
          <div className="vs-transcript-scroll">
            {transcript.length === 0 ? (
              <p className="vs-no-transcript">No transcript available</p>
            ) : (
              transcript.map((msg, idx) => (
                <div key={idx} className={`vs-transcript-line ${msg.role === 'assistant' ? 'vs-line-ai' : 'vs-line-patient'}`}>
                  <strong>{msg.role === 'assistant' ? 'AI' : 'Patient'}:</strong>
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="vs-summary-actions">
          <button className="vs-btn-primary" onClick={restartWithSameProfile}>Start New Session</button>
          <button className="vs-btn-secondary" onClick={resetSession}>Change Profile</button>
        </div>
      </div>
    );
  };

  const renderError = () => (
    <div className="vs-container vs-center">
      <div className="vs-error-card">
        {errorType === ERROR_TYPE.MICROPHONE ? (
          <Mic size={60} color="#D88373" />
        ) : (
          <AlertCircle size={60} color="#D88373" />
        )}

        <h2>Something went wrong</h2>
        <p className="vs-error-message">{error}</p>

        {errorType === ERROR_TYPE.MICROPHONE && (
          <div className="vs-mic-instructions">
            <p><strong>To enable microphone access:</strong></p>
            <ol>
              <li>Click the camera/microphone icon in your browser's address bar</li>
              <li>Select "Allow" for microphone</li>
              <li>Click "Check Permission" below</li>
            </ol>
          </div>
        )}

        <div className="vs-error-actions">
          <button className="vs-btn-primary" onClick={handleRetry}>
            <RefreshCw size={18} />
            {errorType === ERROR_TYPE.MICROPHONE ? 'Check Permission' : 'Try Again'}
          </button>
          <button className="vs-btn-secondary" onClick={resetSession}>
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="vs-page">
      {phase === PHASE.SELECT_PROFILE && renderProfileSelection()}
      {phase === PHASE.LOADING_PROFILE && renderLoadingProfile()}
      {phase === PHASE.PRE_CALL && renderPreCall()}
      {phase === PHASE.CONNECTING && renderConnecting()}
      {phase === PHASE.ACTIVE_CALL && renderActiveCall()}
      {phase === PHASE.ENDING_CALL && renderEndingCall()}
      {phase === PHASE.SUMMARY && renderSummary()}
      {phase === PHASE.ERROR && renderError()}
    </div>
  );
};

export default VoiceSession;
