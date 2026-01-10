/**
 * Tracking Page - Care Log
 * Simple, focused interface for caregivers to log daily interactions
 * Tracks mood and notes (conversations, observations, emergency context)
 * Data flows to MCP server for AI access
 */

import { useState, useEffect, useRef } from 'react';
import {
  Smile,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Save,
  Plus,
  Trash2,
  Clock,
  Calendar,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  FileText
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import {
  logMood,
  getMoodsForDate,
  getMoodHistory,
  addConversationNote,
  getConversationNotes,
  deleteConversationNote,
  saveEmergencyContext,
  getEmergencyContext,
  deleteMoodLog
} from '../utils/activityTracker';

// Mood options with emojis
const MOODS = [
  { id: 'great', emoji: '😊', label: 'Great', color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'good', emoji: '🙂', label: 'Good', color: '#3B82F6', bgColor: '#EFF6FF' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#F59E0B', bgColor: '#FFFBEB' },
  { id: 'difficult', emoji: '😟', label: 'Difficult', color: '#F97316', bgColor: '#FFF7ED' },
  { id: 'very_hard', emoji: '😢', label: 'Very Hard', color: '#EF4444', bgColor: '#FEF2F2' }
];

// Quick tags for notes
const QUICK_TAGS = [
  { id: 'conversation', text: '💬 Conversation', color: '#3B82F6' },
  { id: 'behavior', text: '📋 Behavior', color: '#8B5CF6' },
  { id: 'medical', text: '💊 Medical', color: '#EF4444' },
  { id: 'sleep', text: '😴 Sleep', color: '#6366F1' },
  { id: 'eating', text: '🍽️ Eating', color: '#F59E0B' },
  { id: 'emergency', text: '⚠️ Emergency Info', color: '#DC2626' }
];

// Conversation prompts
const CONVERSATION_PROMPTS = [
  "Ask about their favorite meal as a kid",
  "Talk about family members they remember",
  "Ask about their old job or hobbies",
  "Show old photos and ask questions",
  "Play their favorite music and observe reaction"
];

const Tracking = () => {
  const { currentPatient } = usePatient();
  const patientId = currentPatient?.id || 'default';
  const patientName = currentPatient?.preferredName || currentPatient?.name || 'Patient';

  // Date navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = currentDate.toISOString().split('T')[0];

  // Mood state
  const [selectedMood, setSelectedMood] = useState(null);
  const [quickNote, setQuickNote] = useState('');
  const [todaysMoods, setTodaysMoods] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showMoodSaved, setShowMoodSaved] = useState(false);

  // Conversation notes state
  const [conversationNotes, setConversationNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedTag, setSelectedTag] = useState('conversation');
  const [showPrompts, setShowPrompts] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showNoteSaved, setShowNoteSaved] = useState(false);

  // Refs
  const noteInputRef = useRef(null);

  // Load data on mount and date change
  useEffect(() => {
    loadDateData();
    loadMoodHistory();
  }, [patientId, dateStr]);

  const loadDateData = () => {
    const moods = getMoodsForDate(patientId, dateStr);
    setTodaysMoods(moods);

    const notes = getConversationNotes(patientId, dateStr);
    setConversationNotes(notes);

    // Reset selections when changing dates
    setSelectedMood(null);
    setQuickNote('');
  };

  const loadMoodHistory = () => {
    const history = getMoodHistory(patientId, 7);
    setMoodHistory(history);
  };

  // Date navigation
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    // Don't go past today
    if (newDate <= new Date()) {
      setCurrentDate(newDate);
    }
  };

  const isToday = () => {
    const today = new Date();
    return dateStr === today.toISOString().split('T')[0];
  };

  const formatDateDisplay = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return `Today, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return `Yesterday, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Mood handling
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (!selectedMood) return;

    const timeOfDay = getTimeOfDay();
    const moodEntry = logMood(patientId, dateStr, {
      mood: selectedMood.id,
      timeOfDay,
      note: quickNote.trim(),
      loggedAt: new Date().toISOString()
    });

    setTodaysMoods(prev => [...prev, moodEntry]);
    setSelectedMood(null);
    setQuickNote('');
    setShowMoodSaved(true);

    // Refresh history
    loadMoodHistory();

    setTimeout(() => setShowMoodSaved(false), 2000);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const formatMoodTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Conversation notes handling
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    const note = addConversationNote(patientId, dateStr, {
      text: newNoteText.trim(),
      tag: selectedTag,
      timestamp: new Date().toISOString()
    });

    setConversationNotes(prev => [...prev, note]);
    setNewNoteText('');
    setShowNoteSaved(true);
    setTimeout(() => setShowNoteSaved(false), 2000);
  };

  const handleDeleteNote = (noteId) => {
    deleteConversationNote(patientId, dateStr, noteId);
    setConversationNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handlePromptClick = (prompt) => {
    setNewNoteText(prompt);
    setSelectedTag('conversation');
    noteInputRef.current?.focus();
  };

  // Voice recording (simulated)
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setNewNoteText(prev => prev + " [Voice note recorded]");
      }, 2000);
    }
  };

  // Get tag info helper
  const getTagInfo = (tagId) => {
    return QUICK_TAGS.find(t => t.id === tagId) || QUICK_TAGS[0];
  };

  // Get mood color class
  const getMoodBgClass = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId);
    if (!mood) return '';
    if (moodId === 'great' || moodId === 'good') return 'mood-good-bg';
    if (moodId === 'okay') return 'mood-okay-bg';
    return 'mood-difficult-bg';
  };

  const handleDeleteMood = (moodId) => {
    deleteMoodLog(patientId, dateStr, moodId);
    setTodaysMoods(prev => prev.filter(m => m.id !== moodId));
    loadMoodHistory(); // Refresh history grid
  };

  return (
    <div className="tracking-page">
      {/* SECTION 1: Quick Mood Log */}
      <section className="tracking-section mood-section">
        <div className="section-header-row">
          <h2 className="section-title">
            <Smile size={20} />
            Today's Mood Tracker
          </h2>
        </div>

        {/* Date Navigation */}
        <div className="date-navigator">
          <button className="date-nav-btn" onClick={goToPreviousDay}>
            <ChevronLeft size={20} />
            <span>Yesterday</span>
          </button>

          <div className="current-date-display">
            <Calendar size={16} />
            <span>{formatDateDisplay()}</span>
          </div>

          <button
            className="date-nav-btn"
            onClick={goToNextDay}
            disabled={isToday()}
          >
            <span>Tomorrow</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Previously logged moods for this day */}
        {todaysMoods.length > 0 && (
          <div className="logged-moods">
            <span className="logged-label">Logged today:</span>
            <div className="mood-timeline">
              {todaysMoods.map((entry, idx) => {
                const mood = MOODS.find(m => m.id === entry.mood);
                return (
                  <div key={idx} className="mood-timeline-item">
                    <span className="timeline-time">{entry.timeOfDay}:</span>
                    <span className="timeline-emoji">{mood?.emoji}</span>
                    {entry.note && <span className="timeline-note">"{entry.note}"</span>}
                    <button
                      className="delete-note-btn"
                      onClick={() => handleDeleteMood(entry.id)}
                      style={{ marginLeft: '4px', width: '20px', height: '20px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mood Selection Buttons */}
        <div className="mood-buttons-row">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              className={`mood-btn ${selectedMood?.id === mood.id ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood)}
              style={{
                '--mood-color': mood.color,
                '--mood-bg': mood.bgColor
              }}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Notes Field */}
        <div className="quick-note-field">
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value.slice(0, 300))}
            placeholder={`How was ${patientName} today? Any changes?`}
            className="quick-note-input"
            rows={2}
          />
          <span className="char-count">{quickNote.length}/300</span>
        </div>

        {/* Save Button */}
        <div className="mood-actions">
          <button
            className="save-mood-btn"
            onClick={handleSaveMood}
            disabled={!selectedMood}
          >
            {showMoodSaved ? (
              <>
                <Check size={18} />
                Mood Logged!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Log
              </>
            )}
          </button>
        </div>
      </section>

      {/* SECTION 2: Notes & Context (merged conversations + emergency info) */}
      <section className="tracking-section notes-section">
        <div className="section-header-row">
          <h2 className="section-title">
            <FileText size={20} />
            Notes & Context
          </h2>
        </div>

        <p className="section-description">
          Log daily observations, conversations, or important info that may help during emergencies.
        </p>

        {/* Tag Selection */}
        <div className="note-tags-row">
          {QUICK_TAGS.map(tag => (
            <button
              key={tag.id}
              className={`note-tag-btn ${selectedTag === tag.id ? 'selected' : ''}`}
              onClick={() => setSelectedTag(tag.id)}
              style={{ '--tag-color': tag.color }}
            >
              {tag.text}
            </button>
          ))}
        </div>

        {/* Add New Note */}
        <div className="add-note-form">
          <div className="note-input-wrapper" style={{ position: 'relative' }}>
            <textarea
              ref={noteInputRef}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value.slice(0, 500))}
              placeholder={selectedTag === 'emergency'
                ? "Important info for doctors or responders..."
                : `What did you observe or talk about with ${patientName}?`
              }
              className="note-input"
              rows={3}
              style={{ paddingRight: '50px' }}
            />
            <button
              className={`voice-input-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                width: '36px',
                height: '36px',
                marginBottom: '0',
                background: isRecording ? 'var(--accent-error)' : 'var(--neutral-100)',
                color: isRecording ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <div className="note-actions">
            <span className="char-count">{newNoteText.length}/500</span>
            <button
              className="add-note-btn"
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
            >
              {showNoteSaved ? (
                <>
                  <Check size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Note
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conversation Prompts */}
        <div className="prompts-section">
          <button
            className="prompts-toggle"
            onClick={() => setShowPrompts(!showPrompts)}
          >
            <Sparkles size={16} />
            Conversation ideas
            {showPrompts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showPrompts && (
            <div className="prompts-list">
              {CONVERSATION_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  className="prompt-chip"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Existing Notes */}
        <div className="conversation-notes-list">
          {conversationNotes.length === 0 ? (
            <div className="empty-notes">
              <FileText size={24} strokeWidth={1.5} />
              <p>No notes for this day yet.</p>
            </div>
          ) : (
            conversationNotes.map(note => {
              const tagInfo = getTagInfo(note.tag);
              return (
                <div key={note.id} className="conversation-note-card" style={{ '--tag-color': tagInfo.color }}>
                  <div className="note-header">
                    <span className="note-tag-label">{tagInfo.text}</span>
                    <span className="note-timestamp">
                      <Clock size={12} />
                      {formatMoodTime(note.timestamp)}
                    </span>
                    <button
                      className="delete-note-btn"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* SECTION 3: Mood History & Patterns */}
      <section className="tracking-section history-section">
        <div className="section-header-row">
          <h2 className="section-title">
            <Calendar size={20} />
            Mood History
          </h2>
        </div>

        {/* 7-Day Quick View */}
        <div className="mood-history-grid">
          {moodHistory.map((day, idx) => {
            const mood = day.predominantMood ? MOODS.find(m => m.id === day.predominantMood) : null;
            return (
              <div
                key={idx}
                className={`history-day-card ${getMoodBgClass(day.predominantMood)}`}
                onClick={() => setCurrentDate(new Date(day.date))}
              >
                <span className="history-day-name">{day.dayOfWeek}</span>
                <span className="history-day-emoji">
                  {mood?.emoji || '—'}
                </span>
                <span className="history-day-date">
                  {new Date(day.date).getDate()}
                </span>
                {day.moodCount > 1 && (
                  <span className="mood-count-dot">{day.moodCount}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Simple Pattern Insights */}
        <div className="pattern-insights">
          {(() => {
            const goodDays = moodHistory.filter(d => d.predominantMood === 'great' || d.predominantMood === 'good').length;
            const okayDays = moodHistory.filter(d => d.predominantMood === 'okay').length;
            const difficultDays = moodHistory.filter(d => d.predominantMood === 'difficult' || d.predominantMood === 'very_hard').length;
            const loggedDays = moodHistory.filter(d => d.predominantMood).length;

            return (
              <div className="insights-summary">
                <p className="insight-text">
                  <strong>This week:</strong> {goodDays} good day{goodDays !== 1 ? 's' : ''}, {okayDays} okay day{okayDays !== 1 ? 's' : ''}, {difficultDays} difficult day{difficultDays !== 1 ? 's' : ''}
                </p>
                {loggedDays < 7 && (
                  <p className="insight-text muted">
                    {7 - loggedDays} day{7 - loggedDays !== 1 ? 's' : ''} not yet logged
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
};

export default Tracking;
