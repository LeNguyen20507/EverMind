/**
 * Profile Page
 * User settings and information management
 */

import { PageLayout } from '../components';
import { 
  User, 
  Settings,
  Bell,
  Shield,
  Phone,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle,
  Code,
  AlertTriangle,
  Heart,
  Calendar,
  MapPin,
  Mail,
  Pill,
  Activity,
  Brain,
  Users,
  Clock,
  FileText,
  Info
} from 'lucide-react';

const Profile = () => {
  // Patient data
  const patientData = {
    name: 'John Doe',
    age: 72,
    diagnosis: 'Moderate Alzheimer\'s Disease',
    stage: 'Stage 5',
    diagnosedDate: 'June 2024',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs']
  };

  const medications = [
    { name: 'Donepezil', dosage: '10mg', time: '8:00 AM' },
    { name: 'Memantine', dosage: '5mg', time: 'Twice daily' }
  ];

  const caregivers = [
    { name: 'Mary Doe', relation: 'Spouse', phone: '+1 (555) 123-4567', isPrimary: true },
    { name: 'Sarah Johnson', relation: 'Daughter', phone: '+1 (555) 987-6543', isPrimary: false }
  ];

  const emergencyContacts = [
    { name: 'Dr. Sarah Smith', role: 'Primary Physician', phone: '+1 (555) 234-5678' },
    { name: 'Memorial Hospital', phone: '911' }
  ];

  return (
    <PageLayout
      title="Patient Profile"
      description={`${patientData.name} • Age ${patientData.age}`}
      icon={User}
      bunnyImage="/assets/bunny5.svg"
      themeColor="#F7839B"
    >
      {/* Patient Overview Card */}
      <section className="section">
        <div className="card-grid">
          <div className="stat-card">
            <div className="stat-card-icon">
              <Brain size={20} />
            </div>
            <h3>{patientData.stage}</h3>
            <p>{patientData.diagnosis}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Heart size={20} />
            </div>
            <h3>{patientData.bloodType}</h3>
            <p>Blood Type</p>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
          Diagnosed {patientData.diagnosedDate}
        </p>
      </section>

      {/* Medications & Allergies */}
      <section className="section">
        <h3 className="section-title">
          <Pill size={20} />
          Medications & Allergies
        </h3>
        
        {/* Allergies Warning */}
        <div style={{
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          marginBottom: '14px'
        }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#991B1B', marginBottom: '4px' }}>
            ⚠️ Allergies
          </p>
          <p style={{ fontSize: '0.85rem', color: '#991B1B' }}>
            {patientData.allergies.join(', ')}
          </p>
        </div>

        {/* Medications */}
        {medications.map((med, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: index < medications.length - 1 ? '1px solid var(--neutral-200)' : 'none'
          }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '2px' }}>
                {med.name}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {med.dosage}
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-500)', fontWeight: '500' }}>
              {med.time}
            </span>
          </div>
        ))}
      </section>

      {/* Caregivers */}
      <section className="section">
        <h3 className="section-title">
          <Users size={20} />
          Care Team
        </h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          {caregivers.map((caregiver, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: caregiver.isPrimary ? 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' : 'var(--bg-secondary)',
              border: caregiver.isPrimary ? '1px solid #93C5FD' : '1px solid var(--neutral-200)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={20} style={{ color: 'var(--primary-400)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '2px' }}>
                  {caregiver.name}
                  {caregiver.isPrimary && (
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '0.7rem',
                      background: '#3B82F6',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      PRIMARY
                    </span>
                  )}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {caregiver.relation}
                </p>
              </div>
              <a href={`tel:${caregiver.phone}`} style={{
                padding: '8px 12px',
                background: 'white',
                border: '1px solid var(--neutral-300)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--primary-500)',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Phone size={14} />
                Call
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="section">
        <h3 className="section-title">
          <AlertTriangle size={20} />
          Emergency
        </h3>
        
        {emergencyContacts.map((contact, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: index < emergencyContacts.length - 1 ? '1px solid var(--neutral-200)' : 'none'
          }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '2px' }}>
                {contact.name}
              </h4>
              {contact.role && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {contact.role}
                </p>
              )}
            </div>
            <a href={`tel:${contact.phone}`} style={{
              padding: '8px 16px',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              color: '#991B1B',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              {contact.phone}
            </a>
          </div>
        ))}
      </section>

      {/* Settings */}
      <button 
        className="btn btn-secondary btn-large" 
        style={{ marginBottom: '20px' }}
      >
        <Settings size={20} />
        Edit Profile
      </button>
    </PageLayout>
  );
};

export default Profile;
