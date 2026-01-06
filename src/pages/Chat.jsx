/**
 * AI Chat Page
 * AI assistant for Alzheimer guidance and support
 */

import { PageLayout } from '../components';
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
  AlertTriangle
} from 'lucide-react';

const Chat = () => {
  // Sample conversation bubbles (placeholder)
  const sampleConversation = [
    { 
      type: 'bot', 
      message: "Hello! I'm your ADTreat AI assistant. I'm here to help you with Alzheimer's care questions, caregiver support, and guidance. How can I assist you today?" 
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
        <h3 className="section-title">
          <Bot size={20} />
          Chat Preview
        </h3>
        <div className="chat-container">
          {sampleConversation.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.type}`}>
              {msg.message}
            </div>
          ))}
        </div>

        {/* Chat Input (Non-functional) */}
        <div className="chat-input-container">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Type your question here..."
            disabled
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
