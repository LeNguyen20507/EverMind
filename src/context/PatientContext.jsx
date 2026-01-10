import { createContext, useContext, useState, useEffect } from 'react';

// Storage keys
const STORAGE_KEYS = {
  PATIENTS: 'evermind_patients',
  CURRENT_PATIENT: 'evermind_currentPatientId',
  HAS_ONBOARDED: 'evermind_hasOnboarded',
  MOOD_LOGS: 'evermind_moodLogs',
  CONVERSATION_NOTES: 'evermind_conversationNotes',
  EMERGENCY_CONTEXT: 'evermind_emergencyContext'
};

// Generate unique patient ID
const generatePatientId = () => `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generate initials from name
const getInitials = (name) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Generate avatar URL - use anonymous avatar if no name provided
const getAvatarUrl = (name, color) => {
  if (!name || name === 'New Patient') {
    // Anonymous/default avatar
    return `https://api.dicebear.com/7.x/shapes/svg?seed=anonymous&backgroundColor=neutral`;
  }
  const seed = name.replace(/\s+/g, '');
  const bgColor = color.replace('#', '');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${bgColor}`;
};

// Color palette for new patients
const patientColors = ['#14B8A6', '#3B82F6', '#A855F7', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#6366F1'];

// Default demo patient data - Real Alzheimer's and Dementia cases
const defaultPatientsData = {
  patient_001: {
    id: 'patient_001',
    name: 'Margaret Thompson',
    preferredName: 'Maggie',
    age: 78,
    stage: 'Early-Stage Alzheimer\'s',
    location: 'Portland, Oregon',
    initials: 'MT',
    initials: 'MT',
    avatarUrl: '/avatars/margaret.png',
    color: '#14B8A6',
    color: '#14B8A6',
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
    reminders: [],
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
    calmingStrategies: ['Looking at family photo album', 'Listening to 1960s music', 'Holding her favorite blue cardigan'],
    favoriteThings: {
      food: 'Homemade apple pie',
      place: 'Oregon coast beaches',
      activity: 'Gardening',
      person: 'Grandchildren',
      era: '1960s',
      color: 'Blue'
    }
  },
  patient_002: {
    id: 'patient_002',
    name: 'William "Bill" O\'Connor',
    preferredName: 'Bill',
    age: 81,
    stage: 'Moderate Alzheimer\'s',
    location: 'Boston, Massachusetts',
    initials: 'WO',
    initials: 'WO',
    avatarUrl: '/avatars/bill.png',
    color: '#3B82F6', // blue
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
    reminders: [],
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
    calmingStrategies: ['Watching Red Sox games', 'Looking at firefighter memorabilia', 'Walking in the garden with Mary'],
    favoriteThings: {
      food: 'Clam chowder',
      place: 'Fenway Park',
      activity: 'Baseball',
      person: 'Mary',
      era: '1970s',
      color: 'Red'
    }
  },
  patient_003: {
    id: 'patient_003',
    name: 'Dorothy Mae Johnson',
    preferredName: 'Dot',
    age: 84,
    stage: 'Moderate-Severe Alzheimer\'s',
    location: 'Nashville, Tennessee',
    initials: 'DJ',
    initials: 'DJ',
    avatarUrl: '/avatars/dorothy.png',
    color: '#A855F7', // purple
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
    reminders: [],
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
    calmingStrategies: ['Hymns and gospel music', 'Holding her worn Bible', 'Photos of church family'],
    favoriteThings: {
      food: 'Peach cobbler',
      place: 'Church',
      activity: 'Singing hymns',
      person: 'Church family',
      era: '1950s',
      color: 'Purple'
    }
  }
};

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState({});
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mood and tracking data storage
  const [moodLogs, setMoodLogs] = useState({});
  const [conversationNotes, setConversationNotes] = useState({});
  const [emergencyContext, setEmergencyContext] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      const savedCurrentPatient = localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT);
      const savedHasOnboarded = localStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED);
      const savedMoodLogs = localStorage.getItem(STORAGE_KEYS.MOOD_LOGS);
      const savedConversationNotes = localStorage.getItem(STORAGE_KEYS.CONVERSATION_NOTES);
      const savedEmergencyContext = localStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTEXT);

      if (savedPatients) {
        setPatients(JSON.parse(savedPatients));
      } else {
        // Load demo data for first time
        setPatients(defaultPatientsData);
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatientsData));
      }

      if (savedCurrentPatient) {
        setCurrentPatientId(savedCurrentPatient);
      } else {
        setCurrentPatientId('patient_001');
      }

      if (savedHasOnboarded === 'true') {
        setHasOnboarded(true);
      }

      if (savedMoodLogs) setMoodLogs(JSON.parse(savedMoodLogs));
      if (savedConversationNotes) setConversationNotes(JSON.parse(savedConversationNotes));
      if (savedEmergencyContext) setEmergencyContext(JSON.parse(savedEmergencyContext));
    } catch (error) {
      console.error('Error loading patient data:', error);
      setPatients(defaultPatientsData);
      setCurrentPatientId('patient_001');
    }
    setIsLoading(false);
  }, []);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && Object.keys(patients).length > 0) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
  }, [patients, isLoading]);

  // Get current patient object
  const currentPatient = patients[currentPatientId] || null;

  // Switch to different patient
  const switchPatient = (patientId) => {
    if (patients[patientId]) {
      setCurrentPatientId(patientId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT, patientId);
    }
  };

  // Add new patient
  const addPatient = (patientData) => {
    const id = generatePatientId();
    const colorIndex = Object.keys(patients).length % patientColors.length;
    const color = patientColors[colorIndex];

    const newPatient = {
      id,
      name: patientData.name || 'New Patient',
      preferredName: patientData.preferredName || patientData.name?.split(' ')[0] || 'Patient',
      age: patientData.age || 0,
      stage: patientData.stage || 'Not Specified',
      location: patientData.location || '',
      initials: getInitials(patientData.name || 'NP'),
      avatarUrl: getAvatarUrl(patientData.name || 'Patient', color),
      color,
      diagnosis: patientData.diagnosis || '',
      medications: patientData.medications || [],
      allergies: patientData.allergies || [],
      doctorName: patientData.doctorName || '',
      doctorPhone: patientData.doctorPhone || '',
      emergencyContacts: patientData.emergencyContacts || [],
      favoriteSongs: patientData.favoriteSongs || [],
      voiceRecordings: patientData.voiceRecordings || [],
      comfortMemories: patientData.comfortMemories || [],
      triggers: patientData.triggers || [],
      calmingStrategies: patientData.calmingStrategies || [],
      favoriteThings: patientData.favoriteThings || {},
      reminders: [],
      createdAt: new Date().toISOString()
    };

    setPatients(prev => ({ ...prev, [id]: newPatient }));
    setCurrentPatientId(id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT, id);
    return newPatient;
  };

  // Update existing patient
  const updatePatient = (patientId, updates) => {
    if (patients[patientId]) {
      setPatients(prev => ({
        ...prev,
        [patientId]: { ...prev[patientId], ...updates, updatedAt: new Date().toISOString() }
      }));
    }
  };

  // Delete patient
  const deletePatient = (patientId) => {
    if (patients[patientId] && Object.keys(patients).length > 1) {
      const newPatients = { ...patients };
      delete newPatients[patientId];
      setPatients(newPatients);
      if (currentPatientId === patientId) {
        switchPatient(Object.keys(newPatients)[0]);
      }
    }
  };

  // Mark onboarding complete
  const completeOnboarding = () => {
    setHasOnboarded(true);
    localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
  };

  // Skip to demo mode
  const skipToDemo = () => {
    setPatients(defaultPatientsData);
    setCurrentPatientId('patient_001');
    completeOnboarding();
  };

  // Reset app
  const resetApp = () => {
    localStorage.clear();
    setPatients(defaultPatientsData);
    setCurrentPatientId('patient_001');
    setHasOnboarded(false);
  };

  // ============ REMINDER METHODS ============
  const addReminder = (patientId, reminder) => {
    if (patients[patientId]) {
      const updatedPatient = {
        ...patients[patientId],
        reminders: [...(patients[patientId].reminders || []), reminder],
        updatedAt: new Date().toISOString()
      };
      setPatients(prev => ({ ...prev, [patientId]: updatedPatient }));
    }
  };

  const updateReminder = (patientId, reminder) => {
    if (patients[patientId] && patients[patientId].reminders) {
      const updatedReminders = patients[patientId].reminders.map(r =>
        r.id === reminder.id ? reminder : r
      );
      const updatedPatient = {
        ...patients[patientId],
        reminders: updatedReminders,
        updatedAt: new Date().toISOString()
      };
      setPatients(prev => ({ ...prev, [patientId]: updatedPatient }));
    }
  };

  const deleteReminder = (patientId, reminderId) => {
    if (patients[patientId] && patients[patientId].reminders) {
      const updatedReminders = patients[patientId].reminders.filter(r => r.id !== reminderId);
      const updatedPatient = {
        ...patients[patientId],
        reminders: updatedReminders,
        updatedAt: new Date().toISOString()
      };
      setPatients(prev => ({ ...prev, [patientId]: updatedPatient }));
    }
  };

  // ============ TRACKING DATA METHODS ============
  const saveMoodLog = (patientId, date, moodData) => {
    const key = `${patientId}:${date}`;
    const newMoodLogs = { ...moodLogs, [key]: { ...moodLogs[key], ...moodData, lastUpdated: new Date().toISOString() } };
    setMoodLogs(newMoodLogs);
    localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(newMoodLogs));
  };

  const getMoodLog = (patientId, date) => moodLogs[`${patientId}:${date}`] || null;

  const getMoodHistory = (patientId, days = 7) => {
    const history = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      history.push({ date: dateStr, ...getMoodLog(patientId, dateStr) });
    }
    return history;
  };

  const saveConversationNotes = (patientId, date, notes) => {
    const key = `${patientId}:${date}`;
    const newNotes = { ...conversationNotes, [key]: notes };
    setConversationNotes(newNotes);
    localStorage.setItem(STORAGE_KEYS.CONVERSATION_NOTES, JSON.stringify(newNotes));
  };

  const getConversationNotes = (patientId, date) => conversationNotes[`${patientId}:${date}`] || [];

  const saveEmergencyContextData = (patientId, context) => {
    const newContext = { ...emergencyContext, [patientId]: { text: context, lastUpdated: new Date().toISOString() } };
    setEmergencyContext(newContext);
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTEXT, JSON.stringify(newContext));
  };

  const getEmergencyContextData = (patientId) => emergencyContext[patientId] || { text: '', lastUpdated: null };

  // Get all patient data for MCP/AI context
  const getPatientDataForAI = (patientId) => {
    const patient = patients[patientId];
    if (!patient) return null;
    const today = new Date().toISOString().split('T')[0];
    return {
      patient,
      recentMoods: getMoodHistory(patientId, 7),
      todayNotes: getConversationNotes(patientId, today),
      emergencyInfo: getEmergencyContextData(patientId)
    };
  };

  const value = {
    currentPatient, currentPatientId, patients: Object.values(patients), patientsMap: patients, isLoading,
    switchPatient, addPatient, updatePatient, deletePatient,
    hasOnboarded, completeOnboarding, skipToDemo, resetApp,
    addReminder, updateReminder, deleteReminder,
    saveMoodLog, getMoodLog, getMoodHistory,
    saveConversationNotes, getConversationNotes,
    saveEmergencyContext: saveEmergencyContextData, getEmergencyContext: getEmergencyContextData,
    getPatientDataForAI
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
