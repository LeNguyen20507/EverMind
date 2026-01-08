import { createContext, useContext, useState, useEffect } from 'react';

// Patient data - Real Alzheimer's and Dementia cases
// Based on clinical presentations and care scenarios
const patientsData = {
  patient_001: {
    id: 'patient_001',
    name: 'Margaret Thompson',
    preferredName: 'Maggie',
    age: 78,
    stage: 'Early-Stage Alzheimer\'s',
    location: 'Portland, Oregon',
    initials: 'MT',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Margaret&backgroundColor=14b8a6',
    color: '#14B8A6', // teal
    diagnosis: 'Diagnosed 2024 with mild cognitive impairment progressing to early Alzheimer\'s',
    medications: [
      { name: 'Donepezil (Aricept)', dosage: '5mg once daily' },
      { name: 'Vitamin E', dosage: '400 IU daily' },
      { name: 'Omega-3', dosage: '1000mg daily' }
    ],
    allergies: ['Penicillin'],
    doctorName: 'Dr. Sarah Mitchell',
    doctorPhone: '503-555-0142',
    emergencyContacts: [
      { name: 'Robert Thompson', relationship: 'Husband', phone: '503-555-0198' },
      { name: 'Jennifer Adams', relationship: 'Daughter', phone: '503-555-0176' }
    ],
    favoriteSongs: [
      { title: 'Moon River', artist: 'Andy Williams', type: 'song', calming: 'very_high' },
      { title: 'Unforgettable', artist: 'Nat King Cole', type: 'song', calming: 'very_high' },
      { title: 'What a Wonderful World', artist: 'Louis Armstrong', type: 'song', calming: 'high' }
    ],
    voiceRecordings: [
      { title: 'Good Morning Maggie', from: 'Husband Robert', type: 'recording' },
      { title: 'We Love You Grandma', from: 'Grandchildren', type: 'recording' }
    ],
    comfortMemories: ['Teaching elementary school for 35 years', 'Summer trips to the Oregon coast', 'Baking cookies with grandchildren'],
    triggers: ['Loud sudden noises', 'Being rushed', 'Unfamiliar environments'],
    calmingStrategies: ['Looking at family photo album', 'Listening to 1960s music', 'Holding her favorite blue cardigan']
  },
  patient_002: {
    id: 'patient_002',
    name: 'William "Bill" O\'Connor',
    preferredName: 'Bill',
    age: 81,
    stage: 'Moderate Alzheimer\'s',
    location: 'Boston, Massachusetts',
    initials: 'WO',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William&backgroundColor=3b82f6',
    color: '#3B82F6', // blue
    diagnosis: 'Diagnosed 2022, moderate stage with sundowning episodes',
    medications: [
      { name: 'Donepezil (Aricept)', dosage: '10mg once daily' },
      { name: 'Memantine (Namenda)', dosage: '10mg twice daily' },
      { name: 'Trazodone', dosage: '50mg at bedtime for sleep' }
    ],
    allergies: ['Sulfa drugs', 'Shellfish'],
    doctorName: 'Dr. Michael Chen',
    doctorPhone: '617-555-0134',
    emergencyContacts: [
      { name: 'Mary O\'Connor', relationship: 'Wife', phone: '617-555-0189' },
      { name: 'Patrick O\'Connor', relationship: 'Son', phone: '617-555-0156' }
    ],
    favoriteSongs: [
      { title: 'Danny Boy', artist: 'Traditional Irish', type: 'song', calming: 'very_high' },
      { title: 'Sweet Caroline', artist: 'Neil Diamond', type: 'song', calming: 'high' },
      { title: 'My Way', artist: 'Frank Sinatra', type: 'song', calming: 'high' }
    ],
    voiceRecordings: [
      { title: 'Mary\'s Reassurance', from: 'Wife Mary', type: 'recording' },
      { title: 'Dad, It\'s Patrick', from: 'Son Patrick', type: 'recording' }
    ],
    comfortMemories: ['Working as a firefighter for 30 years', 'Coaching Little League baseball', 'Sunday dinners with family'],
    triggers: ['Evening time (sundowning)', 'Crowds', 'Changes in routine'],
    calmingStrategies: ['Watching Red Sox games', 'Looking at firefighter memorabilia', 'Walking in the garden with Mary']
  },
  patient_003: {
    id: 'patient_003',
    name: 'Dorothy Mae Johnson',
    preferredName: 'Dot',
    age: 84,
    stage: 'Moderate-Severe Alzheimer\'s',
    location: 'Nashville, Tennessee',
    initials: 'DJ',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dorothy&backgroundColor=a855f7',
    color: '#A855F7', // purple
    diagnosis: 'Diagnosed 2020, requires assistance with daily activities',
    medications: [
      { name: 'Donepezil (Aricept)', dosage: '23mg once daily' },
      { name: 'Memantine (Namenda XR)', dosage: '28mg once daily' },
      { name: 'Sertraline (Zoloft)', dosage: '50mg daily for anxiety' },
      { name: 'Melatonin', dosage: '3mg at bedtime' }
    ],
    allergies: ['Aspirin', 'Latex', 'Codeine'],
    doctorName: 'Dr. Angela Williams',
    doctorPhone: '615-555-0128',
    emergencyContacts: [
      { name: 'Rev. Marcus Johnson', relationship: 'Son', phone: '615-555-0167' },
      { name: 'Lisa Johnson-Brown', relationship: 'Daughter', phone: '615-555-0145' }
    ],
    favoriteSongs: [
      { title: 'Amazing Grace', artist: 'Traditional Hymn', type: 'song', calming: 'very_high' },
      { title: 'His Eye Is On The Sparrow', artist: 'Mahalia Jackson', type: 'song', calming: 'very_high' },
      { title: 'Precious Lord, Take My Hand', artist: 'Thomas Dorsey', type: 'song', calming: 'high' }
    ],
    voiceRecordings: [
      { title: 'Morning Prayer', from: 'Son Rev. Marcus', type: 'recording' },
      { title: 'I Love You Great-Grandma', from: 'Isaiah (age 5)', type: 'recording' },
      { title: 'Lisa\'s Evening Call', from: 'Daughter Lisa', type: 'recording' }
    ],
    comfortMemories: ['Singing in the church choir for 50 years', 'Teaching Sunday school', 'Making her famous peach cobbler'],
    triggers: ['Being alone', 'Darkness', 'Not recognizing surroundings'],
    calmingStrategies: ['Hymns and gospel music', 'Holding her worn Bible', 'Photos of church family']
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
