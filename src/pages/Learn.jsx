/**
 * Learn Page - Educational Content Hub
 * Scrollable with caregiver articles and AI chat interface
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
  Gamepad2
} from 'lucide-react';

const Learn = () => {
  const [activeSection, setActiveSection] = useState('caregivers'); // 'caregivers' or 'patient'
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
      title: "Caregiver Self-Care & Burnout Prevention", 
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

  // Patient-focused content
  const patientResources = [
    { title: "Brain-Healthy Activities", icon: Brain, description: "Simple puzzles and games" },
    { title: "Memory Exercises", icon: Gamepad2, description: "Gentle memory activities" },
    { title: "About Your Condition", icon: Heart, description: "Easy-to-understand information" },
  ];

  // AI Chat suggested prompts
  const suggestedPrompts = [
    "How do I handle sundowning?",
    "What are signs of medication side effects?",
    "Tips for difficult conversations"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    
    // Simulate AI response (in real app, this would call an API)
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
          For John
        </button>
      </div>

      {activeSection === 'caregivers' ? (
        <>
          {/* Featured Articles Section */}
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

          {/* AI Chat Interface Section */}
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
        </>
      ) : (
        /* Patient Resources Section */
        <section className="learn-section patient-section">
          <h2 className="learn-section-title patient-title">
            <Heart size={20} />
            Resources for John
          </h2>
          <p className="patient-subtitle">
            Simple activities and information in easy-to-understand language
          </p>
          
          <div className="patient-resources">
            {patientResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <button key={idx} className="patient-resource-card">
                  <div className="resource-icon">
                    <Icon size={28} />
                  </div>
                  <div className="resource-text">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                  </div>
                  <ChevronRight size={20} />
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
