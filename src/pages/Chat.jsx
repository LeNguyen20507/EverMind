/**
 * AI Chat Page
 * AI assistant for Alzheimer guidance and support
 */

import { PageLayout } from '../components';
import { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot,
  User,
  Sparkles,
  CheckCircle,
  Code,
  HelpCircle,
  Heart,
  AlertTriangle,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';

const Chat = () => {
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [isVoiceOutput, setIsVoiceOutput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleVoiceInput = () => {
    setIsVoiceInput(!isVoiceInput);
    if (isListening) setIsListening(false);
  };

  const toggleVoiceOutput = () => {
    setIsVoiceOutput(!isVoiceOutput);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  // Sample conversation bubbles (placeholder)
  const sampleConversation = [
    { 
      type: 'bot', 
      message: "Hello! I'm your Alzheimer's patient assistant. I'm here to help you with Alzheimer's care questions, caregiver support, and guidance. How can I assist you today?" 
    },
    { 
      type: 'user', 
      message: "What are some early signs of Alzheimer's disease?" 
    },
    { 
      type: 'bot', 
      message: "Early signs of Alzheimer's may include: memory loss affecting daily life, difficulty planning or solving problems, confusion with time or place, and changes in mood or personality. Would you like me to explain any of these in more detail?" 
    },
    { 
      type: 'user', 
      message: "How can I help my loved one stay calm during confusion?" 
    },
    { 
      type: 'bot', 
      message: "Great question! Here are some helpful tips: Speak calmly and reassuringly, maintain a consistent daily routine, avoid arguing or correcting them, use gentle touch if appropriate, and create a peaceful environment. Remember to take care of yourself too!" 
    },
  ];

  // Quick suggestion buttons
  const quickSuggestions = [
    { icon: HelpCircle, text: 'Symptom questions' },
    { icon: Heart, text: 'Caregiver tips' },
    { icon: AlertTriangle, text: 'Emergency help' },
  ];

  return (
    <PageLayout
      title="AI Assistant"
      description="Get personalized guidance, answers to your questions, and compassionate support 24/7."
      icon={MessageCircle}
      bunnyImage="/assets/bunny3.svg"
      themeColor="#6ABD9B"
    >
      {/* Quick Suggestions */}
      <section className="section">
        <h3 className="section-title">
          <Sparkles size={20} />
          Quick Topics
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {quickSuggestions.map(({ icon: Icon, text }, index) => (
            <button 
              key={index} 
              className="btn btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.9rem' }}
            >
              <Icon size={16} />
              {text}
            </button>
          ))}
        </div>
      </section>

      {/* Chat Interface Mockup */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            <Bot size={20} />
            Chat Preview
          </h3>
          <button
            onClick={toggleVoiceInput}
            className="btn"
            style={{
              padding: '8px 12px',
              background: isVoiceInput ? 'var(--primary-500)' : 'var(--neutral-200)',
              color: isVoiceInput ? 'white' : 'var(--text-primary)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Toggle voice chat"
          >
            <Mic size={16} />
            Voice
          </button>
        </div>
        <div className="chat-container">
          {sampleConversation.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.type}`}>
              {msg.message}
            </div>
          ))}
        </div>

        {/* Chat Input (Non-functional) */}
        <div className="chat-input-container">
          <button 
            className="voice-input-btn"
            onClick={toggleVoiceInput}
            style={{
              background: isVoiceInput ? 'var(--primary-500)' : 'var(--neutral-200)',
              color: isVoiceInput ? 'white' : 'var(--text-muted)'
            }}
            title="Toggle voice input"
          >
            {isVoiceInput ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <input 
            type="text" 
            className="chat-input" 
            placeholder={isVoiceInput ? "Voice mode active - tap mic above" : "Type your question here..."}
            disabled={isVoiceInput}
            style={{
              opacity: isVoiceInput ? 0.6 : 1
            }}
          />
          <button className="chat-send-btn" disabled>
            <Send size={20} />
          </button>
        </div>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          marginTop: '12px'
        }}>
          Chat functionality coming soon
        </p>
      </section>
    </PageLayout>
  );
};

export default Chat;
