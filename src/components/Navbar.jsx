/**
 * Navbar Component
 * Top bar with app name and profile, bottom navigation for main sections
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Bell, MessageCircle, BookOpen, User, AlertCircle, Phone } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  
  // Patient-specific emergency information
  const patientInfo = {
    name: "John Doe",
    condition: "Moderate Alzheimer's Disease",
    emergencyContacts: [
      { name: "Dr. Sarah Smith", role: "Primary Physician", phone: "911" },
      { name: "Mary Johnson", role: "Family Member", phone: "+1 (555) 123-4567" },
      { name: "Alzheimer's Crisis Line", role: "24/7 Support", phone: "1-800-272-3900" },
    ],
    criticalInfo: [
      "Patient has wandering tendency - check doors/windows",
      "Allergic to penicillin",
      "Takes Donepezil 10mg daily at 8 AM",
      "Calm demeanor works best - avoid confrontation"
    ]
  };
  
  const handleEmergency = () => {
    setShowEmergencyModal(true);
  };
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <button 
          className="emergency-button" 
          onClick={handleEmergency}
          aria-label="Emergency"
        >
          <AlertCircle size={20} />
        </button>
        <div className="app-name">
          <img 
            src="/assets/name.svg" 
            alt="Don't you forget!" 
            style={{ height: '60px', display: 'block' }}
          />
        </div>
        <button 
          className="profile-button" 
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          <User size={20} />
        </button>
      </nav>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <Icon size={22} />
            </div>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setShowEmergencyModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: 'white'
              }}>
                <AlertCircle size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Emergency Contacts
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                For {patientInfo.name}
              </p>
            </div>

            {/* Emergency Contacts */}
            <div style={{ marginBottom: '20px' }}>
              {patientInfo.emergencyContacts.map((contact, index) => (
                <a
                  key={index}
                  href={`tel:${contact.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    background: index === 0 ? 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' : 'var(--neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '10px',
                    textDecoration: 'none',
                    border: index === 0 ? '2px solid #EF4444' : '1px solid var(--neutral-200)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index === 0 ? '#EF4444' : 'var(--primary-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <Phone size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {contact.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {contact.role}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: index === 0 ? '#DC2626' : 'var(--primary-500)' }}>
                    {contact.phone}
                  </div>
                </a>
              ))}
            </div>

            {/* Critical Patient Information */}
            <div style={{
              background: 'var(--accent-warning)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#5D4037', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                Critical Information
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {patientInfo.criticalInfo.map((info, index) => (
                  <li key={index} style={{ fontSize: '0.8rem', color: '#5D4037', marginBottom: '4px' }}>
                    {info}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--neutral-200)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
