/**
 * Home Page
 * Dashboard overview with quick stats and navigation to other sections
 */

import { PageLayout } from '../components';
import { 
  Home as HomeIcon, 
  Bell, 
  MessageCircle, 
  BookOpen, 
  Heart, 
  Users, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Brain,
  Moon,
  Droplet,
  Info,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [showReminders, setShowReminders] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);

  // Patient-specific condition information
  const patientCondition = {
    name: "John Doe",
    stage: "Moderate Alzheimer's Disease",
    diagnosedDate: "June 2024",
    careApproach: [
      "Maintain consistent daily routines",
      "Use gentle redirection instead of correction",
      "Keep environment familiar and clutter-free",
      "Encourage participation in simple activities"
    ],
    triggers: [
      "Loud noises or crowded spaces",
      "Changes in routine or environment",
      "Evening time (sundowning)"
    ]
  };

  // Wellness tracking data
  const wellnessData = {
    overallScore: 87,
    patientName: "John Doe",
    lastUpdated: "Today, 3:45 PM",
    metrics: [
      { icon: Brain, label: 'Cognitive Activity', value: 85, color: '#8B5CF6' },
      { icon: Activity, label: 'Physical Activity', value: 92, color: '#10B981' },
      { icon: Moon, label: 'Sleep Quality', value: 78, color: '#3B82F6' },
      { icon: Droplet, label: 'Hydration', value: 95, color: '#06B6D4' },
    ]
  };

  // Placeholder reminders preview
  const todayReminders = [
    { time: '8:00 AM', task: 'Morning Medication', type: 'medication' },
    { time: '10:00 AM', task: 'Hydration Reminder', type: 'hydration' },
    { time: '2:00 PM', task: 'Afternoon Rest', type: 'rest' },
  ];

  // Latest AI chat response
  const latestAIResponse = {
    question: "What are some ways to help with memory loss?",
    response: "Here are several evidence-based strategies to help with memory loss: 1) Establish consistent daily routines to reduce confusion. 2) Use memory aids like calendars, notes, and reminder apps. 3) Keep the environment familiar and well-organized. 4) Encourage mental stimulation through puzzles and conversation. 5) Ensure adequate sleep and proper nutrition.",
    timestamp: "2 hours ago"
  };

  return (
    <PageLayout
      title="Welcome Back"
      description="Your Alzheimer care dashboard. Monitor health, manage reminders, and access support."
      icon={HomeIcon}
      bunnyImage="/assets/bunny1.svg"
      themeColor="#6AB3D8"
    >
      {/* Wellness Overview Card with Score */}
      <section className="section" style={{
        background: 'white',
        border: '1px solid rgba(20, 184, 166, 0.12)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(19, 78, 74, 0.3)',
            position: 'relative',
            flexShrink: 0
          }}>
            <div style={{
              position: 'absolute',
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              border: '2px solid rgba(20, 184, 166, 0.2)',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', lineHeight: '1' }}>
                {wellnessData.overallScore}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', marginTop: '2px' }}>
                Score
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Daily Wellness
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {wellnessData.lastUpdated}
            </p>
          </div>
        </div>

        {/* Wellness Metrics */}
        <div style={{ display: 'grid', gap: '10px' }}>
          {wellnessData.metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-normal)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `${metric.color}1A`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 6px ${metric.color}15`
                }}>
                  <Icon size={18} style={{ color: metric.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{metric.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: metric.color }}>
                      {metric.value}%
                    </span>
                  </div>
                  <div style={{
                    height: '5px',
                    background: '#E5E7EB',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${metric.value}%`,
                      background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}CC 100%)`,
                      borderRadius: '3px',
                      animation: 'progressFill 1.5s ease-out forwards',
                      '--target-width': `${metric.value}%`
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Patient Condition Overview */}
      <section className="section">
        <h3 className="section-title">
          <Info size={20} />
          Care Profile
        </h3>
        <div style={{
          background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          border: '1px solid #99F6E4'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {patientCondition.name}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#0F766E', fontWeight: '500' }}>
              {patientCondition.stage}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Diagnosed: {patientCondition.diagnosedDate}
            </p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F766E', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} />
              Recommended Care Approach
            </h5>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {patientCondition.careApproach.map((approach, index) => (
                <li key={index} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: '1.4' }}>
                  {approach}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F766E', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} />
              Known Triggers
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {patientCondition.triggers.map((trigger, index) => (
                <span key={index} style={{
                  fontSize: '0.75rem',
                  background: 'white',
                  color: '#0F766E',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #99F6E4'
                }}>
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Today's Reminders Preview */}
      <section className="section">
        <h3 
          className="section-title" 
          onClick={() => setShowReminders(!showReminders)}
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} />
            Today's Reminders
          </div>
          {showReminders ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </h3>
        {showReminders && (
          <div style={{ marginTop: '12px' }}>
            {todayReminders.map((reminder, index) => (
              <div key={index} className="reminder-item">
                <div className={`reminder-icon ${reminder.type}`}>
                  <Bell size={20} />
                </div>
                <div className="reminder-content">
                  <h4>{reminder.task}</h4>
                  <p>Scheduled reminder</p>
                </div>
                <span className="reminder-time">{reminder.time}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest AI Chat Response */}
      <section className="section">
        <h3 
          className="section-title"
          onClick={() => setShowAIResponse(!showAIResponse)}
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} />
            Latest AI Assistance
          </div>
          {showAIResponse ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </h3>
        {showAIResponse && (
          <div style={{
            background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid #DDD6FE',
            marginTop: '12px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MessageCircle size={16} style={{ color: '#8B5CF6' }} />
                <span style={{ fontSize: '0.8rem', color: '#6B21A8', fontWeight: '600' }}>Your Question</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#581C87', fontWeight: '500' }}>
                {latestAIResponse.question}
              </p>
            </div>
            <div style={{ 
              background: 'white',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} style={{ color: '#8B5CF6' }} />
                <span style={{ fontSize: '0.8rem', color: '#6B21A8', fontWeight: '600' }}>AI Response</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {latestAIResponse.response}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B21A8' }}>
                {latestAIResponse.timestamp}
              </span>
              <Link 
                to="/chat" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  color: '#8B5CF6',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Ask more questions
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default Home;
