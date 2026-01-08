import { X, Check, User } from 'lucide-react';
import { usePatient } from '../context/PatientContext';

const PatientSwitcher = ({ isOpen, onClose }) => {
  const { patients, currentPatientId, switchPatient } = usePatient();

  const handleSelectPatient = (patientId) => {
    switchPatient(patientId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="patient-switcher-overlay" onClick={onClose}>
      <div className="patient-switcher-modal" onClick={e => e.stopPropagation()}>
        <div className="patient-switcher-header">
          <h2>Switch Patient</h2>
          <button className="patient-switcher-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="patient-switcher-list">
          {patients.map((patient) => (
            <button
              key={patient.id}
              className={`patient-switcher-item ${currentPatientId === patient.id ? 'active' : ''}`}
              onClick={() => handleSelectPatient(patient.id)}
              style={{ '--patient-color': patient.color }}
            >
              <div 
                className="patient-switcher-avatar"
                style={{ background: patient.color, borderColor: patient.color }}
              >
                {patient.avatarUrl ? (
                  <img src={patient.avatarUrl} alt={patient.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>{patient.initials}</span>
                )}
              </div>
              
              <div className="patient-switcher-info">
                <span className="patient-switcher-name">{patient.preferredName}</span>
                <span className="patient-switcher-details">
                  {patient.name} • Age {patient.age}
                </span>
                <span className="patient-switcher-stage">{patient.stage}</span>
              </div>

              {currentPatientId === patient.id && (
                <div className="patient-switcher-check" style={{ background: patient.color }}>
                  <Check size={16} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="patient-switcher-footer">
          <p>Select a patient to view their care information</p>
        </div>
      </div>
    </div>
  );
};

export default PatientSwitcher;
