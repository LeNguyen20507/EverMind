/**
 * Learn Page - Educational Content Hub
 * AI Chat on top, then educational articles
 * For Patient tab shows educational content
 */

import { useState } from 'react';
import { 
  BookOpen, 
  Brain,
  Heart,
  Users,
  Shield,
  Clock,
  Sun,
  MessageCircle,
  Send,
  ChevronRight,
  Sparkles,
  User,
  Gamepad2,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

const Learn = () => {
  const [activeSection, setActiveSection] = useState('caregivers');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: "Hello! I'm your caregiving assistant. Ask me anything about Alzheimer's care, and I'll do my best to help." }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Featured articles for caregivers
  const caregiverArticles = [
    { 
      id: 1,
      title: "Understanding Alzheimer's Stages", 
      description: "Learn about the 7 stages of Alzheimer's and what to expect",
      readTime: "8 min",
      category: "Basics",
      icon: Brain,
      color: '#8B5CF6'
    },
    { 
      id: 2,
      title: "Communication Strategies", 
      description: "Effective ways to connect with your loved one",
      readTime: "6 min",
      category: "Communication",
      icon: Users,
      color: '#3B82F6'
    },
    { 
      id: 3,
      title: "Managing Behavioral Changes", 
      description: "Tips for handling agitation, wandering, and sundowning",
      readTime: "10 min",
      category: "Behavior",
      icon: Heart,
      color: '#EC4899'
    },
    { 
      id: 4,
      title: "Caregiver Self-Care", 
      description: "Taking care of yourself while caring for others",
      readTime: "5 min",
      category: "Wellness",
      icon: Sun,
      color: '#F59E0B'
    },
    { 
      id: 5,
      title: "Daily Care Routines", 
      description: "Creating structure and predictability",
      readTime: "7 min",
      category: "Routines",
      icon: Clock,
      color: '#10B981'
    },
    { 
      id: 6,
      title: "Safety & Wandering Prevention", 
      description: "Home safety modifications and monitoring tips",
      readTime: "9 min",
      category: "Safety",
      icon: Shield,
      color: '#EF4444'
    },
  ];

  // Patient-focused educational content
  const patientEducation = [
    { 
      title: "Understanding Your Journey", 
      icon: Brain, 
      description: "Simple information about memory changes",
      color: '#8B5CF6'
    },
    { 
      title: "Brain-Healthy Activities", 
      icon: Gamepad2, 
      description: "Fun puzzles and games for your mind",
      color: '#3B82F6'
    },
    { 
      title: "Staying Connected", 
      icon: Heart, 
      description: "Tips for communicating with loved ones",
      color: '#EC4899'
    },
    { 
      title: "Daily Wellness Tips", 
      icon: Sun, 
      description: "Simple ways to feel your best each day",
      color: '#F59E0B'
    },
    { 
      title: "Memory Helpers", 
      icon: Lightbulb, 
      description: "Tools and tricks to help you remember",
      color: '#10B981'
    },
    { 
      title: "Questions & Answers", 
      icon: HelpCircle, 
      description: "Common questions answered simply",
      color: '#6366F1'
    },
  ];

  // AI Chat suggested prompts
  const suggestedPrompts = [
    "How do I handle sundowning?",
    "What are medication side effects?",
    "Tips for difficult conversations"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        text: "Thank you for your question. As a caregiver, it's important to approach this with patience and understanding. I recommend consulting with your healthcare provider for personalized advice." 
      }]);
    }, 1000);
    
    setInputMessage('');
  };

  return (
    <div className="learn-page">
      {/* Section Toggle */}
      <div className="section-toggle">
        <button 
          className={`toggle-btn ${activeSection === 'caregivers' ? 'active' : ''}`}
          onClick={() => setActiveSection('caregivers')}
        >
          For Caregivers
        </button>
        <button 
          className={`toggle-btn ${activeSection === 'patient' ? 'active' : ''}`}
          onClick={() => setActiveSection('patient')}
        >
          For Patient
        </button>
      </div>

      {activeSection === 'caregivers' ? (
        <>
          {/* AI Chat Interface Section - ON TOP */}
          <section className="learn-section ai-chat-section">
            <h2 className="learn-section-title">
              <Sparkles size={20} />
              Ask AI About Caregiving
            </h2>
            
            {/* Chat Messages */}
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.type}`}>
                  <div className="message-avatar">
                    {msg.type === 'bot' ? <Sparkles size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Prompts */}
            <div className="suggested-prompts">
              {suggestedPrompts.map((prompt, idx) => (
                <button 
                  key={idx} 
                  className="prompt-chip"
                  onClick={() => setInputMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input-wrapper">
              <input
                type="text"
                placeholder="Ask a question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="chat-input-field"
              />
              <button 
                className="chat-send-button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </section>

          {/* Featured Articles Section - BELOW AI CHAT */}
          <section className="learn-section">
            <h2 className="learn-section-title">
              <BookOpen size={20} />
              Featured Articles
            </h2>
            <div className="articles-grid">
              {caregiverArticles.map((article) => {
                const Icon = article.icon;
                return (
                  <div key={article.id} className="article-card">
                    <div className="article-icon" style={{ background: `${article.color}15`, color: article.color }}>
                      <Icon size={22} />
                    </div>
                    <div className="article-content">
                      <span className="article-category" style={{ color: article.color, background: `${article.color}10` }}>
                        {article.category}
                      </span>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-desc">{article.description}</p>
                      <span className="article-time">{article.readTime} read</span>
                    </div>
                    <ChevronRight size={18} className="article-arrow" />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        /* Patient Educational Content Section */
        <section className="learn-section patient-section">
          <h2 className="learn-section-title patient-title">
            <Heart size={20} />
            Educational Resources
          </h2>
          <p className="patient-subtitle">
            Easy-to-understand information and activities designed for you
          </p>
          
          <div className="patient-education-grid">
            {patientEducation.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button key={idx} className="patient-education-card">
                  <div className="education-icon" style={{ background: `${item.color}15`, color: item.color }}>
                    <Icon size={28} />
                  </div>
                  <div className="education-text">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <ChevronRight size={20} className="education-arrow" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Learn;
