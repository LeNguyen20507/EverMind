/**
 * Home Page - Patient Information Dashboard
 * Non-scrollable overview showing key patient info at a glance
 * The person button switches patients (handled in navbar)
 */

import { 
  Phone, 
  Pill, 
  AlertTriangle,
  User,
  Heart,
  ChevronRight,
  Activity,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Patient data
  const patientData = {
    name: 'John Doe',
    stage: 'Mild Stage',
    condition: 'Alzheimer\'s Disease',
    age: 72
  };

  // Medical overview
  const medicalInfo = {
    medications: [
      { name: 'Donepezil', dosage: '10mg', time: 'Morning' },
      { name: 'Memantine', dosage: '5mg', time: 'Twice daily' }
    ],
    allergies: ['Penicillin', 'Sulfa drugs'],
    physician: { name: 'Dr. Sarah Smith', phone: '+1 (555) 234-5678' }
  };

  // Emergency contacts
  const emergencyContacts = [
    { name: 'Mary Doe', relation: 'Spouse', phone: '+1 (555) 123-4567' },
    { name: 'Sarah J.', relation: 'Daughter', phone: '+1 (555) 987-6543' }
  ];

  return (
    <div className="home-page">
      {/* Patient Identity Section - Top Priority */}
      <div className="patient-identity">
        <div className="patient-photo">
          <User size={32} />
        </div>
        <div className="patient-info">
          <h1 className="patient-name">{patientData.name}</h1>
          <span className="patient-stage">{patientData.stage} • Age {patientData.age}</span>
        </div>
      </div>

      {/* Info Label */}
      <div className="home-info-label">
        <Brain size={14} />
        <span>Current Patient Overview</span>
      </div>

      {/* Critical Information Cards Grid */}
      <div className="home-cards-grid">
        {/* Medical Overview Card */}
        <div className="home-card medical-card">
          <div className="card-header">
            <Pill size={16} />
            <span>Medications</span>
          </div>
          <div className="card-content">
            <div className="med-list">
              {medicalInfo.medications.map((med, idx) => (
                <div key={idx} className="med-item">
                  <span className="med-name">{med.name}</span>
                  <span className="med-dose">{med.dosage}</span>
                </div>
              ))}
            </div>
            <div className="allergy-warning">
              <AlertTriangle size={12} />
              <span>Allergies: {medicalInfo.allergies.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Card */}
        <div className="home-card contacts-card">
          <div className="card-header">
            <Phone size={16} />
            <span>Contacts</span>
          </div>
          <div className="card-content">
            {emergencyContacts.map((contact, idx) => (
              <a 
                key={idx} 
                href={`tel:${contact.phone}`}
                className="contact-item"
              >
                <div className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-relation">{contact.relation}</span>
                </div>
                <Phone size={14} className="call-icon" />
              </a>
            ))}
          </div>
        </div>

        {/* Today's Schedule Card - Navigate to Reminders */}
        <Link to="/reminders" className="home-card schedule-card clickable">
          <div className="card-header">
            <Activity size={16} />
            <span>Today's Schedule</span>
            <ChevronRight size={16} className="card-arrow" />
          </div>
          <div className="card-content schedule-preview">
            <p className="schedule-hint">
              View and manage daily reminders, medications, and appointments
            </p>
          </div>
        </Link>

        {/* Physician Info Card */}
        <div className="home-card doctor-card">
          <div className="card-header">
            <Heart size={16} />
            <span>Physician</span>
          </div>
          <div className="card-content">
            <div className="doctor-info-display">
              <span className="doctor-name">{medicalInfo.physician.name}</span>
              <a href={`tel:${medicalInfo.physician.phone}`} className="doctor-phone">
                <Phone size={12} />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Label */}
      <div className="home-footer-label">
        <span>Tap the person icon (top right) to switch patients</span>
      </div>
    </div>
  );
};

export default Home;
