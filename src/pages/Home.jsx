/**
 * Home Page - Non-Scrollable Compact Dashboard
 * Everything must fit in one viewport without scrolling
 */

import { 
  Phone, 
  Pill, 
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Heart,
  FileText
} from 'lucide-react';

const Home = () => {
  // Patient data
  const patientData = {
    name: 'John Doe',
    photo: '/assets/patient-photo.jpg', // placeholder
    stage: 'Mild Stage',
    condition: 'Alzheimer\'s Disease'
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

  // Today's schedule (next 2-3 items only)
  const todaySchedule = [
    { time: '2:00 PM', title: 'Afternoon Medication', type: 'medication', isNext: true },
    { time: '4:00 PM', title: 'Physical Therapy', type: 'appointment' },
    { time: '6:00 PM', title: 'Dinner & Evening Meds', type: 'meal' }
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'medication': return Pill;
      case 'appointment': return Calendar;
      case 'meal': return Heart;
      default: return Clock;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'medication': return '#3B82F6';
      case 'appointment': return '#8B5CF6';
      case 'meal': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="home-page">
      {/* Patient Identity Section - Top Priority */}
      <div className="patient-identity">
        <div className="patient-photo">
          <User size={32} />
        </div>
        <div className="patient-info">
          <h1 className="patient-name">{patientData.name}</h1>
          <span className="patient-stage">{patientData.stage}</span>
        </div>
      </div>

      {/* Critical Information Cards Grid */}
      <div className="home-cards-grid">
        {/* Medical Overview Card */}
        <div className="home-card medical-card">
          <div className="card-header">
            <Pill size={16} />
            <span>Medical Overview</span>
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
              <span>{medicalInfo.allergies.join(', ')}</span>
            </div>
            <div className="doctor-info">
              <User size={12} />
              <span>{medicalInfo.physician.name}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Card */}
        <div className="home-card contacts-card">
          <div className="card-header">
            <Phone size={16} />
            <span>Emergency Contacts</span>
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
                <Phone size={16} className="call-icon" />
              </a>
            ))}
          </div>
        </div>

        {/* Today's Schedule Card - Spans full width */}
        <div className="home-card schedule-card">
          <div className="card-header">
            <Calendar size={16} />
            <span>Today's Schedule</span>
          </div>
          <div className="card-content schedule-content">
            {todaySchedule.map((item, idx) => {
              const Icon = getTypeIcon(item.type);
              const color = getTypeColor(item.type);
              return (
                <div 
                  key={idx} 
                  className={`schedule-item ${item.isNext ? 'next-up' : ''}`}
                >
                  <div 
                    className="schedule-icon" 
                    style={{ background: `${color}15`, color: color }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="schedule-info">
                    <span className="schedule-title">{item.title}</span>
                    <span className="schedule-time">{item.time}</span>
                  </div>
                  {item.isNext && (
                    <span className="next-badge">Next</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="home-card actions-card">
          <div className="quick-actions-grid">
            <button className="quick-action-item">
              <FileText size={18} />
              <span>Care Plan</span>
            </button>
            <button className="quick-action-item">
              <Heart size={18} />
              <span>Memories</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
