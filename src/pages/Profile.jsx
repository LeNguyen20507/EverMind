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
  AlertTriangle
} from 'lucide-react';

const Profile = () => {
  // Placeholder user data
  const userData = {
    name: 'John Caregiver',
    role: 'Primary Caregiver',
    email: 'john.caregiver@email.com',
    joined: 'January 2026'
  };

  // Settings sections
  const settingsItems = [
    { icon: Bell, title: 'Notifications', description: 'Manage alert preferences', path: '/settings/notifications' },
    { icon: Shield, title: 'Privacy & Security', description: 'Account security settings', path: '/settings/privacy' },
    { icon: Globe, title: 'Language', description: 'English (US)', path: '/settings/language' },
    { icon: HelpCircle, title: 'Help & Support', description: 'FAQs and contact support', path: '/settings/help' },
  ];

  // Emergency contacts placeholder
  const emergencyContacts = [
    { name: 'Dr. Smith', relation: 'Primary Physician', phone: '+1 (555) 123-4567' },
    { name: 'Mary Caregiver', relation: 'Secondary Caregiver', phone: '+1 (555) 987-6543' },
  ];

  return (
    <PageLayout
      title="Profile"
      description="Manage your account settings, emergency contacts, and app preferences."
      icon={User}
    >
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <h2 className="profile-name">{userData.name}</h2>
        <p className="profile-role">{userData.role}</p>
      </div>

      {/* Emergency Contacts */}
      <section className="section">
        <h3 className="section-title">
          <Phone size={20} />
          Emergency Contacts
        </h3>
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="emergency-card">
            <h4>
              <AlertTriangle size={14} />
              {contact.name}
            </h4>
            <p>{contact.relation} • {contact.phone}</p>
          </div>
        ))}
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
          + Add Emergency Contact
        </button>
      </section>

      {/* Settings */}
      <section className="section">
        <h3 className="section-title">
          <Settings size={20} />
          Settings
        </h3>
        {settingsItems.map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="settings-item">
            <div className="settings-icon">
              <Icon size={20} />
            </div>
            <div className="settings-content">
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
            <ChevronRight size={20} className="settings-arrow" />
          </div>
        ))}
      </section>

      {/* Account Info */}
      <section className="section">
        <h3 className="section-title">
          <User size={20} />
          Account Information
        </h3>
        <div style={{ padding: '8px 0' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
            <strong>Email:</strong> {userData.email}
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
            <strong>Member since:</strong> {userData.joined}
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            <strong>Role:</strong> {userData.role}
          </p>
        </div>
      </section>

      {/* Logout Button */}
      <button 
        className="btn btn-secondary btn-large" 
        style={{ 
          color: 'var(--accent-error)', 
          borderColor: 'var(--accent-error)',
          marginBottom: '20px'
        }}
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </PageLayout>
  );
};

export default Profile;
