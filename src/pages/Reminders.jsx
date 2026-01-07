/**
 * Reminders Page - Scrollable List-Based
 * Grouped by time/category with comprehensive reminder management
 */

import { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Pill, 
  Calendar, 
  Utensils,
  Activity,
  Clock,
  Check,
  ChevronRight,
  Filter,
  Trash2,
  Edit3
} from 'lucide-react';

const Reminders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [completedReminders, setCompletedReminders] = useState([]);

  // Today's reminders
  const todayReminders = [
    { 
      id: 1,
      time: '8:00 AM', 
      title: 'Morning Medication - Donepezil', 
      type: 'medication',
      context: 'Take with breakfast',
      note: 'John prefers taking pills with orange juice',
      benefit: 'Helps with memory'
    },
    { 
      id: 2,
      time: '10:00 AM', 
      title: 'Morning Walk', 
      type: 'activity',
      context: '15-minute walk in the garden',
      note: 'Best time for outdoor activities',
      benefit: 'Improves mood and circulation'
    },
    { 
      id: 3,
      time: '12:00 PM', 
      title: 'Lunch', 
      type: 'meal',
      context: 'Light lunch with hydration',
      note: 'Prefers soft foods',
      benefit: 'Nutrition and energy'
    },
    { 
      id: 4,
      time: '2:00 PM', 
      title: 'Afternoon Medication - Memantine', 
      type: 'medication',
      context: 'Second dose',
      note: 'Can be taken with or without food',
      benefit: 'Helps with cognition'
    },
    { 
      id: 5,
      time: '4:00 PM', 
      title: 'Physical Therapy Session', 
      type: 'appointment',
      context: 'With Dr. Johnson',
      note: 'Wear comfortable clothes',
      benefit: 'Maintains mobility'
    },
  ];

  // Upcoming reminders (next 7 days)
  const upcomingReminders = [
    { id: 6, date: 'Tomorrow', time: '9:00 AM', title: 'Doctor Appointment', type: 'appointment' },
    { id: 7, date: 'Wed, Jan 8', time: '2:00 PM', title: 'Memory Exercise Session', type: 'activity' },
    { id: 8, date: 'Fri, Jan 10', time: '10:00 AM', title: 'Pharmacy Pickup', type: 'medication' },
  ];

  // Recurring reminders
  const recurringReminders = [
    { id: 9, pattern: 'Daily', time: '8:00 PM', title: 'Evening Medication', type: 'medication' },
    { id: 10, pattern: 'Every Mon/Wed/Fri', time: '3:00 PM', title: 'Brain Games', type: 'activity' },
    { id: 11, pattern: 'Weekly', time: '10:00 AM', title: 'Video Call with Family', type: 'activity' },
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'medication': return Pill;
      case 'appointment': return Calendar;
      case 'meal': return Utensils;
      case 'activity': return Activity;
      default: return Bell;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'medication': return '#3B82F6';
      case 'appointment': return '#8B5CF6';
      case 'meal': return '#10B981';
      case 'activity': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const toggleComplete = (id) => {
    if (completedReminders.includes(id)) {
      setCompletedReminders(prev => prev.filter(r => r !== id));
    } else {
      setCompletedReminders(prev => [...prev, id]);
    }
  };

  const filterCategories = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'medication', label: 'Meds', icon: Pill },
    { id: 'appointment', label: 'Appts', icon: Calendar },
    { id: 'activity', label: 'Activities', icon: Activity },
    { id: 'meal', label: 'Meals', icon: Utensils },
  ];

  const filteredTodayReminders = activeFilter === 'all' 
    ? todayReminders 
    : todayReminders.filter(r => r.type === activeFilter);

  return (
    <div className="reminders-page">
      {/* Add New Reminder Button */}
      <button className="add-reminder-btn">
        <Plus size={22} />
        <span>Add New Reminder</span>
      </button>

      {/* Filter Categories */}
      <div className="filter-bar">
        {filterCategories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`filter-chip ${activeFilter === id ? 'active' : ''}`}
            onClick={() => setActiveFilter(id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TODAY Section */}
      <section className="reminders-section">
        <div className="section-header">
          <h2 className="section-label today">TODAY</h2>
          <span className="reminder-count">{filteredTodayReminders.length} reminders</span>
        </div>
        
        <div className="reminders-list">
          {filteredTodayReminders.map((reminder) => {
            const Icon = getTypeIcon(reminder.type);
            const color = getTypeColor(reminder.type);
            const isCompleted = completedReminders.includes(reminder.id);
            
            return (
              <div 
                key={reminder.id} 
                className={`reminder-card ${isCompleted ? 'completed' : ''}`}
              >
                <button 
                  className={`complete-checkbox ${isCompleted ? 'checked' : ''}`}
                  onClick={() => toggleComplete(reminder.id)}
                  style={{ borderColor: color, background: isCompleted ? color : 'transparent' }}
                >
                  {isCompleted && <Check size={14} color="white" />}
                </button>
                
                <div className="reminder-main">
                  <div className="reminder-header">
                    <span className="reminder-time">{reminder.time}</span>
                    <div className="reminder-type-badge" style={{ background: `${color}15`, color }}>
                      <Icon size={12} />
                    </div>
                  </div>
                  <h3 className="reminder-title">{reminder.title}</h3>
                  <p className="reminder-context">{reminder.context}</p>
                  {reminder.note && (
                    <p className="reminder-note">💡 {reminder.note}</p>
                  )}
                  <p className="reminder-benefit">{reminder.benefit}</p>
                </div>

                <div className="reminder-actions">
                  <button className="action-btn edit">
                    <Edit3 size={16} />
                  </button>
                  <button className="action-btn delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING Section */}
      <section className="reminders-section">
        <div className="section-header">
          <h2 className="section-label upcoming">UPCOMING</h2>
          <span className="reminder-count">Next 7 days</span>
        </div>
        
        <div className="reminders-list compact">
          {upcomingReminders.map((reminder) => {
            const Icon = getTypeIcon(reminder.type);
            const color = getTypeColor(reminder.type);
            
            return (
              <div key={reminder.id} className="reminder-card compact">
                <div className="reminder-type-icon" style={{ background: `${color}15`, color }}>
                  <Icon size={18} />
                </div>
                <div className="reminder-main">
                  <div className="reminder-date">{reminder.date} • {reminder.time}</div>
                  <h3 className="reminder-title">{reminder.title}</h3>
                </div>
                <ChevronRight size={18} className="chevron" />
              </div>
            );
          })}
        </div>
      </section>

      {/* RECURRING Section */}
      <section className="reminders-section">
        <div className="section-header">
          <h2 className="section-label recurring">RECURRING</h2>
          <span className="reminder-count">Weekly patterns</span>
        </div>
        
        <div className="reminders-list compact">
          {recurringReminders.map((reminder) => {
            const Icon = getTypeIcon(reminder.type);
            const color = getTypeColor(reminder.type);
            
            return (
              <div key={reminder.id} className="reminder-card compact">
                <div className="reminder-type-icon" style={{ background: `${color}15`, color }}>
                  <Icon size={18} />
                </div>
                <div className="reminder-main">
                  <div className="reminder-pattern">{reminder.pattern} • {reminder.time}</div>
                  <h3 className="reminder-title">{reminder.title}</h3>
                </div>
                <ChevronRight size={18} className="chevron" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Completed Section */}
      {completedReminders.length > 0 && (
        <section className="reminders-section completed-section">
          <div className="section-header">
            <h2 className="section-label completed">COMPLETED TODAY</h2>
            <span className="reminder-count">{completedReminders.length} done</span>
          </div>
          <p className="completed-message">
            ✓ {completedReminders.length} reminder(s) marked as complete. Great job!
          </p>
        </section>
      )}
    </div>
  );
};

export default Reminders;
