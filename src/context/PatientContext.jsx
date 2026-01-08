import { createContext, useContext, useState, useEffect } from 'react';

// Patient data - in a real app this would come from an API/MCP server
const patientsData = {
  patient_001: {
    id: 'patient_001',
    name: 'Nguyen Huynh',
    preferredName: 'Nguyen',
    age: 18,
    stage: 'Hackathon Participant',
    location: 'San Jose, California',
    avatar: '👨‍💻',
    color: '#14B8A6', // teal
    medications: [],
    allergies: [],
    favoriteSongs: [
      { title: 'Lofi Hip Hop', artist: 'ChilledCow', type: 'song', calming: 'very_high' },
      { title: 'Blinding Lights', artist: 'The Weeknd', type: 'song', calming: 'high' },
      { title: 'Sunflower', artist: 'Post Malone', type: 'song', calming: 'high' }
    ],
    voiceRecordings: [],
    // Hackathon specific data
    hackathonProject: 'ADTreat - Alzheimer\'s Emergency Calming App',
    hackathonDeadline: '1/11/2026',
    hackathonTasks: [
      'Finalize VAPI voice integration',
      'Polish UI/UX',
      'Test with demo patients',
      'Prepare presentation slides',
      'Record demo video'
    ],
    stressors: ['deadline pressure', 'debugging issues', 'presentation anxiety'],
    copingStrategies: ['taking breaks', 'listening to music', 'talking it through']
  },
  patient_002: {
    id: 'patient_002',
    name: 'Harold Chen',
    preferredName: 'Harry',
    age: 82,
    stage: 'Early Alzheimer\'s',
    location: 'San Francisco, California',
    avatar: '👴',
    color: '#3B82F6', // blue
    medications: [
      { name: 'Donepezil', dosage: '5mg daily' },
      { name: 'Vitamin E', dosage: '400 IU daily' }
    ],
    allergies: ['Shellfish'],
    favoriteSongs: [
      { title: 'The Moon Represents My Heart', artist: 'Teresa Teng', type: 'song', calming: 'very_high' },
      { title: 'Unchained Melody', artist: 'Righteous Brothers', type: 'song', calming: 'high' },
      { title: 'What a Wonderful World', artist: 'Louis Armstrong', type: 'song', calming: 'high' }
    ],
    voiceRecordings: [
      { title: 'Linda\'s Good Morning', from: 'Wife Linda', type: 'recording' },
      { title: 'Michael Checking In', from: 'Son Michael', type: 'recording' }
    ]
  },
  patient_003: {
    id: 'patient_003',
    name: 'Eleanor Washington',
    preferredName: 'Ellie',
    age: 85,
    stage: 'Moderate-Severe Alzheimer\'s',
    location: 'Atlanta, Georgia',
    avatar: '👵🏿',
    color: '#A855F7', // purple
    medications: [
      { name: 'Donepezil', dosage: '10mg daily' },
      { name: 'Memantine', dosage: '14mg daily' },
      { name: 'Sertraline', dosage: '50mg daily' }
    ],
    allergies: ['Aspirin', 'Latex'],
    favoriteSongs: [
      { title: 'Amazing Grace', artist: 'Traditional Hymn', type: 'song', calming: 'very_high' },
      { title: 'His Eye Is On The Sparrow', artist: 'Gospel Hymn', type: 'song', calming: 'very_high' },
      { title: 'Precious Lord, Take My Hand', artist: 'Thomas Dorsey', type: 'song', calming: 'high' }
    ],
    voiceRecordings: [
      { title: 'Marcus\'s Prayer', from: 'Son Rev. Marcus', type: 'recording' },
      { title: 'Great-Grandson Isaiah', from: 'Isaiah (age 4)', type: 'recording' }
    ]
  }
};

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [currentPatientId, setCurrentPatientId] = useState('patient_001');
  const [patients] = useState(patientsData);

  const currentPatient = patients[currentPatientId];

  const switchPatient = (patientId) => {
    if (patients[patientId]) {
      setCurrentPatientId(patientId);
      // Save to localStorage for persistence
      localStorage.setItem('currentPatientId', patientId);
    }
  };

  // Load saved patient on mount
  useEffect(() => {
    const savedPatientId = localStorage.getItem('currentPatientId');
    if (savedPatientId && patients[savedPatientId]) {
      setCurrentPatientId(savedPatientId);
    }
  }, []);

  const value = {
    currentPatient,
    currentPatientId,
    patients: Object.values(patients),
    switchPatient
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

export default PatientContext;
