/**
 * Activity Tracker Utility
 * Tracks and stores caregiver activities for MCP server access
 * Stores mood logs, conversation notes, and emergency context
 */

// Storage keys for different data types
const STORAGE_KEYS = {
  MOODS: 'care_tracking:moods',
  CONVERSATIONS: 'care_tracking:conversations',
  EMERGENCY_CONTEXT: 'care_tracking:emergency_context',
  ACTIVITIES: 'care_tracking:activities'
};

/**
 * Track an activity (generic)
 * @param {string} type - Activity type (MOOD_CHECKIN, CONVERSATION, etc.)
 * @param {object} metadata - Activity data
 * @param {string} patientId - Patient identifier
 */
export const trackActivity = (type, metadata, patientId = 'default') => {
  const activities = getStoredData(STORAGE_KEYS.ACTIVITIES) || [];

  const activity = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    metadata,
    patientId,
    date: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString()
  };

  activities.unshift(activity);

  // Keep last 100 activities per patient
  const filteredActivities = activities.filter(a => a.patientId === patientId).slice(0, 100);
  const otherActivities = activities.filter(a => a.patientId !== patientId);

  setStoredData(STORAGE_KEYS.ACTIVITIES, [...filteredActivities, ...otherActivities]);

  return activity;
};

/**
 * Get recent activities
 * @param {number} days - Number of days to look back
 * @param {string} patientId - Patient identifier
 */
export const getRecentActivities = (days = 7, patientId = 'default') => {
  const activities = getStoredData(STORAGE_KEYS.ACTIVITIES) || [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return activities
    .filter(a => a.patientId === patientId)
    .filter(a => new Date(a.timestamp) >= cutoffDate)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// ===== MOOD TRACKING =====

/**
 * Log a mood entry for a specific date
 * @param {string} patientId - Patient identifier
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {object} moodData - { mood, timeOfDay, note, loggedAt }
 */
export const logMood = (patientId, date, moodData) => {
  const key = `${STORAGE_KEYS.MOODS}:${patientId}`;
  const allMoods = getStoredData(key) || {};

  // Get existing moods for this date or create new array
  const dayMoods = allMoods[date] || [];

  const entry = {
    id: `mood_${Date.now()}`,
    ...moodData,
    loggedAt: moodData.loggedAt || new Date().toISOString()
  };

  dayMoods.push(entry);
  allMoods[date] = dayMoods;

  setStoredData(key, allMoods);

  // Also track as activity for MCP
  trackActivity('MOOD_CHECKIN', { mood: moodData.mood, note: moodData.note, date }, patientId);

  return entry;
};

/**
 * Get moods for a specific date
 */
export const getMoodsForDate = (patientId, date) => {
  const key = `${STORAGE_KEYS.MOODS}:${patientId}`;
  const allMoods = getStoredData(key) || {};
  return allMoods[date] || [];
};

/**
 * Get mood history for date range
 */
export const getMoodHistory = (patientId, days = 7) => {
  const key = `${STORAGE_KEYS.MOODS}:${patientId}`;
  const allMoods = getStoredData(key) || {};

  const history = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);

    const dayMoods = allMoods[dateStr] || [];

    // Get predominant mood for the day
    const predominantMood = getPredominantMood(dayMoods);

    history.push({
      date: dateStr,
      displayDate: formatDisplayDate(date),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      moods: dayMoods,
      predominantMood,
      moodCount: dayMoods.length
    });
  }

  return history;
};

/**
 * Update an existing mood entry
 */
export const updateMood = (patientId, date, moodId, updates) => {
  const key = `${STORAGE_KEYS.MOODS}:${patientId}`;
  const allMoods = getStoredData(key) || {};

  if (allMoods[date]) {
    allMoods[date] = allMoods[date].map(m =>
      m.id === moodId ? { ...m, ...updates } : m
    );
    setStoredData(key, allMoods);
  }
};

/**
 * Delete a mood entry
 */
export const deleteMoodLog = (patientId, date, moodId) => {
  const key = `${STORAGE_KEYS.MOODS}:${patientId}`;
  const allMoods = getStoredData(key) || {};

  if (allMoods[date]) {
    allMoods[date] = allMoods[date].filter(m => m.id !== moodId);
    setStoredData(key, allMoods);
  }
};

// ===== CONVERSATION NOTES =====

/**
 * Add a conversation note
 */
export const addConversationNote = (patientId, date, noteData) => {
  const key = `${STORAGE_KEYS.CONVERSATIONS}:${patientId}`;
  const allNotes = getStoredData(key) || {};

  const dayNotes = allNotes[date] || [];

  const entry = {
    id: `conv_${Date.now()}`,
    ...noteData,
    timestamp: noteData.timestamp || new Date().toISOString()
  };

  dayNotes.push(entry);
  allNotes[date] = dayNotes;

  setStoredData(key, allNotes);

  // Track as activity
  trackActivity('CONVERSATION_NOTE', { note: noteData.text, date }, patientId);

  return entry;
};

/**
 * Get conversation notes for a date
 */
export const getConversationNotes = (patientId, date) => {
  const key = `${STORAGE_KEYS.CONVERSATIONS}:${patientId}`;
  const allNotes = getStoredData(key) || {};
  return allNotes[date] || [];
};

/**
 * Delete a conversation note
 */
export const deleteConversationNote = (patientId, date, noteId) => {
  const key = `${STORAGE_KEYS.CONVERSATIONS}:${patientId}`;
  const allNotes = getStoredData(key) || {};

  if (allNotes[date]) {
    allNotes[date] = allNotes[date].filter(n => n.id !== noteId);
    setStoredData(key, allNotes);
  }
};

/**
 * Update a conversation note
 */
export const updateConversationNote = (patientId, date, noteId, updates) => {
  const key = `${STORAGE_KEYS.CONVERSATIONS}:${patientId}`;
  const allNotes = getStoredData(key) || {};

  if (allNotes[date]) {
    allNotes[date] = allNotes[date].map(n =>
      n.id === noteId ? { ...n, ...updates } : n
    );
    setStoredData(key, allNotes);
  }
};

// ===== EMERGENCY CONTEXT =====

/**
 * Save emergency context (persists across days)
 */
export const saveEmergencyContext = (patientId, contextData) => {
  const key = `${STORAGE_KEYS.EMERGENCY_CONTEXT}:${patientId}`;

  const entry = {
    text: contextData.text,
    tags: contextData.tags || [],
    lastUpdated: new Date().toISOString()
  };

  setStoredData(key, entry);

  // Track as activity
  trackActivity('EMERGENCY_CONTEXT_UPDATED', { preview: contextData.text?.slice(0, 50) }, patientId);

  return entry;
};

/**
 * Get emergency context
 */
export const getEmergencyContext = (patientId) => {
  const key = `${STORAGE_KEYS.EMERGENCY_CONTEXT}:${patientId}`;
  return getStoredData(key) || { text: '', tags: [], lastUpdated: null };
};

// ===== MCP DATA EXPORT =====

/**
 * Get all tracking data for MCP server consumption
 * This is what the AI will access during conversations
 */
export const getMCPTrackingData = (patientId) => {
  const moodHistory = getMoodHistory(patientId, 14); // Last 2 weeks
  const emergencyContext = getEmergencyContext(patientId);
  const recentActivities = getRecentActivities(7, patientId);

  // Get recent conversation notes
  const convKey = `${STORAGE_KEYS.CONVERSATIONS}:${patientId}`;
  const allConversations = getStoredData(convKey) || {};

  // Get last 3 days of conversation notes
  const recentConversations = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const notes = allConversations[dateStr] || [];
    if (notes.length > 0) {
      recentConversations.push({ date: dateStr, notes });
    }
  }

  // Calculate simple stats
  const moodStats = calculateMoodStats(moodHistory);

  return {
    patientId,
    exportedAt: new Date().toISOString(),
    emergencyContext,
    recentMoods: moodHistory.slice(0, 7),
    moodStats,
    recentConversations,
    recentActivities: recentActivities.slice(0, 20)
  };
};

// ===== HELPER FUNCTIONS =====

const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return null;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (formatDate(date) === formatDate(today)) {
    return 'Today';
  } else if (formatDate(date) === formatDate(yesterday)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
};

const getPredominantMood = (moods) => {
  if (!moods || moods.length === 0) return null;

  // Count occurrences
  const counts = {};
  moods.forEach(m => {
    counts[m.mood] = (counts[m.mood] || 0) + 1;
  });

  // Find most frequent
  let maxCount = 0;
  let predominant = null;

  Object.entries(counts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      predominant = mood;
    }
  });

  return predominant;
};

const calculateMoodStats = (history) => {
  const moodCounts = { great: 0, good: 0, okay: 0, difficult: 0, very_hard: 0 };
  let totalDays = 0;

  history.forEach(day => {
    if (day.predominantMood) {
      moodCounts[day.predominantMood] = (moodCounts[day.predominantMood] || 0) + 1;
      totalDays++;
    }
  });

  // Calculate streaks
  let currentStreak = 0;
  let longestGoodStreak = 0;

  for (const day of history) {
    if (day.predominantMood === 'great' || day.predominantMood === 'good') {
      currentStreak++;
      longestGoodStreak = Math.max(longestGoodStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    totalDaysLogged: totalDays,
    moodCounts,
    goodDays: moodCounts.great + moodCounts.good,
    okayDays: moodCounts.okay,
    difficultDays: moodCounts.difficult + moodCounts.very_hard,
    longestGoodStreak
  };
};

export default {
  trackActivity,
  getRecentActivities,
  logMood,
  getMoodsForDate,
  getMoodHistory,
  updateMood,
  deleteMoodLog,
  addConversationNote,
  getConversationNotes,
  deleteConversationNote,
  updateConversationNote,
  saveEmergencyContext,
  getEmergencyContext,
  getMCPTrackingData
};
