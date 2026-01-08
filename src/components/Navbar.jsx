/**
 * Navbar Component
 * Global top navigation bar with emergency button (with label), app title, and patient switcher
 * SOS button opens the AI-powered calming assistant modal
 * Single page app - no bottom tabs needed
 */

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import SOSModal from './SOSModal';
import PatientSwitcher from './PatientSwitcher';
import { usePatient } from '../context/PatientContext';

const Navbar = () => {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showPatientSwitcher, setShowPatientSwitcher] = useState(false);
  const { currentPatient, currentPatientId } = usePatient();

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
          <span>SOS</span>
        </button>

        {/* CENTER: App Logo */}
        <div className="nav-center">
          <img src="/assets/name.svg" alt="EverMind" className="app-logo" />
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
