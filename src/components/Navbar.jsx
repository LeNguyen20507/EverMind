/**
 * Navbar Component
 * Global top navigation bar with emergency button (with label), app title, and patient switcher
 * Tab navigation for Home, Tracking, and Reminders
 * SOS button opens the AI-powered calming assistant modal
 */

import { AlertCircle, Home, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SOSModal from './SOSModal';
import PatientSwitcher from './PatientSwitcher';
import { usePatient } from '../context/PatientContext';

const Navbar = () => {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showPatientSwitcher, setShowPatientSwitcher] = useState(false);
  const { currentPatient } = usePatient();
  const location = useLocation();

  // Tab items
  const tabs = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tracking', label: 'Tracking', icon: ClipboardList }
  ];

  return (
    <>
      {/* Global Top Navigation Bar - Fixed */}
      <nav className="global-top-nav">
        {/* LEFT: Emergency Button with Label */}
        <button
          className="emergency-btn-with-label"
          onClick={() => setShowSOSModal(true)}
          aria-label="Emergency"
        >
          <AlertCircle size={20} />
          <span>Help</span>
        </button>

        {/* CENTER: App Logo */}
        <div className="nav-center">
          <span className="app-logo-text" style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-sans, inherit)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--blue-600) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            EverMind
          </span>
        </div>

        {/* RIGHT: Patient Switcher Button */}
        <button
          className="patient-switcher-btn"
          onClick={() => setShowPatientSwitcher(true)}
          aria-label="Switch Patient"
          title={`Current: ${currentPatient?.preferredName || 'Select Patient'}`}
          style={{ '--patient-color': currentPatient?.color || '#14B8A6' }}
        >
          <div
            className="patient-avatar-btn"
            style={{
              background: currentPatient?.color,
              borderColor: currentPatient?.color
            }}
          >
            {currentPatient?.avatarUrl ? (
              <img
                src={currentPatient.avatarUrl}
                alt={currentPatient.name}
                className="patient-avatar-img"
              />
            ) : (
              <span className="patient-avatar-initials">
                {currentPatient?.initials || 'PT'}
              </span>
            )}
          </div>
        </button>
      </nav>

      {/* Tab Navigation Bar */}
      <nav className="tab-nav-bar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`tab-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* SOS Modal - AI-powered calming assistant */}
      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
      />

      {/* Patient Switcher Modal */}
      <PatientSwitcher
        isOpen={showPatientSwitcher}
        onClose={() => setShowPatientSwitcher(false)}
      />
    </>
  );
};

export default Navbar;
