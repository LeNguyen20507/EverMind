/**
 * Navbar Component
 * Global top navigation bar with emergency button, tab indicator, and profile
 * Tab navigation below for Home, Learn, Reminders
 */

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Bell, BookOpen, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import EmergencyModal from './EmergencyModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  
  // Patient-specific emergency information
  const patientInfo = {
    name: "John Doe",
    age: 72,
    condition: "Moderate Alzheimer's Disease",
    doctorName: "Dr. Sarah Smith",
    doctorPhone: "+1 (555) 234-5678",
    allergies: ['Penicillin', 'Sulfa drugs'],
    medications: [
      { name: 'Donepezil', dosage: '10mg', time: '8:00 AM' },
      { name: 'Memantine', dosage: '5mg', time: 'Twice daily' }
    ],
    emergencyContacts: [
      { name: "Mary Doe", role: "Spouse", phone: "+1 (555) 123-4567" },
      { name: "Sarah Johnson", role: "Daughter", phone: "+1 (555) 987-6543" },
    ],
    criticalInfo: [
      "Patient has wandering tendency - check doors/windows",
      "Responds well to calm, slow speech",
      "May become confused in unfamiliar environments",
      "Sundowning typically occurs after 5 PM"
    ]
  };
  
  const handleEmergency = () => {
    setShowEmergencyModal(true);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
  ];

  return (
    <>
      {/* Global Top Navigation Bar - Fixed */}
      <nav className="global-top-nav">
        {/* LEFT: Emergency Button */}
        <button 
          className="emergency-btn" 
          onClick={handleEmergency}
          aria-label="Emergency"
        >
          <AlertCircle size={22} />
        </button>

        {/* CENTER: Current Tab or App Logo */}
        <div className="nav-center">
          <img 
            src="/assets/name.svg" 
            alt="ADTreat" 
            className="nav-logo"
          />
        </div>

        {/* RIGHT: Profile Button */}
        <button 
          className="profile-btn" 
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          <div className="profile-avatar-btn">
            <User size={20} />
          </div>
        </button>
      </nav>

      {/* Tab Navigation - Below Global Nav */}
      <nav className="tab-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        patientInfo={patientInfo}
      />
    </>
  );
};

export default Navbar;
