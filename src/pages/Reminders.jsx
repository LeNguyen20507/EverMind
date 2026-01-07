/**
 * Reminders Page - Functional Reminder Management
 * FAB on bottom right for add/edit
 * Full CRUD functionality with local state
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
  X,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';

const Reminders = () => {
  // State for reminders
  const [reminders, setReminders] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    type: 'medication',
    note: ''
  });

  const reminderTypes = [
    { id: 'medication', label: 'Medication', icon: Pill, color: '#3B82F6' },
    { id: 'appointment', label: 'Appointment', icon: Calendar, color: '#8B5CF6' },
    { id: 'meal', label: 'Meal', icon: Utensils, color: '#10B981' },
    { id: 'activity', label: 'Activity', icon: Activity, color: '#F59E0B' },
  ];

  const filterCategories = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'medication', label: 'Meds', icon: Pill },
    { id: 'appointment', label: 'Appts', icon: Calendar },
    { id: 'activity', label: 'Activities', icon: Activity },
    { id: 'meal', label: 'Meals', icon: Utensils },
  ];

  const getTypeInfo = (type) => {
    return reminderTypes.find(t => t.id === type) || reminderTypes[0];
  };

  // Open modal for new reminder
  const handleAddNew = () => {
    setEditingReminder(null);
    setFormData({ title: '', time: '', type: 'medication', note: '' });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      time: reminder.time,
      type: reminder.type,
      note: reminder.note || ''
    });
    setShowModal(true);
  };

  // Save reminder (create or update)
  const handleSave = () => {
    if (!formData.title.trim() || !formData.time.trim()) return;

    if (editingReminder) {
      // Update existing
      setReminders(prev => prev.map(r => 
        r.id === editingReminder.id 
          ? { ...r, ...formData }
          : r
      ));
    } else {
      // Create new
      const newReminder = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setReminders(prev => [...prev, newReminder]);
    }
    
    setShowModal(false);
    setFormData({ title: '', time: '', type: 'medication', note: '' });
    setEditingReminder(null);
  };

  // Delete reminder
  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setCompletedIds(prev => prev.filter(cid => cid !== id));
  };

  // Toggle completion
  const toggleComplete = (id) => {
    if (completedIds.includes(id)) {
      setCompletedIds(prev => prev.filter(cid => cid !== id));
    } else {
      setCompletedIds(prev => [...prev, id]);
    }
  };

  // Filter reminders
  const filteredReminders = activeFilter === 'all'
    ? reminders
    : reminders.filter(r => r.type === activeFilter);

  // Sort by time
  const sortedReminders = [...filteredReminders].sort((a, b) => 
    a.time.localeCompare(b.time)
  );

  const pendingReminders = sortedReminders.filter(r => !completedIds.includes(r.id));
  const completedReminders = sortedReminders.filter(r => completedIds.includes(r.id));

  return (
    <div className="reminders-page">
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

      {/* Empty State */}
      {reminders.length === 0 && (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No Reminders Yet</h3>
          <p>Tap the + button to add your first reminder</p>
        </div>
      )}

      {/* Pending Reminders */}
      {pendingReminders.length > 0 && (
        <section className="reminders-section">
          <div className="section-header">
            <h2 className="section-label today">TODAY</h2>
            <span className="reminder-count">{pendingReminders.length} pending</span>
          </div>
          
          <div className="reminders-list">
            {pendingReminders.map((reminder) => {
              const typeInfo = getTypeInfo(reminder.type);
              const Icon = typeInfo.icon;
              
              return (
                <div key={reminder.id} className="reminder-card">
                  <button 
                    className="complete-checkbox"
                    onClick={() => toggleComplete(reminder.id)}
                    style={{ borderColor: typeInfo.color }}
                  >
                  </button>
                  
                  <div className="reminder-main">
                    <div className="reminder-header">
                      <span className="reminder-time">{reminder.time}</span>
                      <div 
                        className="reminder-type-badge" 
                        style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}
                      >
                        <Icon size={12} />
                      </div>
                    </div>
                    <h3 className="reminder-title">{reminder.title}</h3>
                    {reminder.note && (
                      <p className="reminder-note">💡 {reminder.note}</p>
                    )}
                  </div>

                  <div className="reminder-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(reminder)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <section className="reminders-section completed-section">
          <div className="section-header">
            <h2 className="section-label completed">COMPLETED</h2>
            <span className="reminder-count">{completedReminders.length} done</span>
          </div>
          
          <div className="reminders-list">
            {completedReminders.map((reminder) => {
              const typeInfo = getTypeInfo(reminder.type);
              const Icon = typeInfo.icon;
              
              return (
                <div key={reminder.id} className="reminder-card completed">
                  <button 
                    className="complete-checkbox checked"
                    onClick={() => toggleComplete(reminder.id)}
                    style={{ borderColor: typeInfo.color, background: typeInfo.color }}
                  >
                    <Check size={14} color="white" />
                  </button>
                  
                  <div className="reminder-main">
                    <div className="reminder-header">
                      <span className="reminder-time">{reminder.time}</span>
                      <div 
                        className="reminder-type-badge" 
                        style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}
                      >
                        <Icon size={12} />
                      </div>
                    </div>
                    <h3 className="reminder-title">{reminder.title}</h3>
                  </div>

                  <div className="reminder-actions">
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAddNew}>
        <Plus size={28} />
      </button>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingReminder ? 'Edit Reminder' : 'New Reminder'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Title Input */}
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g., Take morning medication"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Time Input */}
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              {/* Type Selection */}
              <div className="form-group">
                <label>Type</label>
                <div className="type-selector">
                  {reminderTypes.map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      className={`type-option ${formData.type === id ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: id }))}
                      style={{ 
                        borderColor: formData.type === id ? color : 'transparent',
                        background: formData.type === id ? `${color}10` : 'var(--neutral-100)'
                      }}
                    >
                      <Icon size={18} style={{ color: formData.type === id ? color : 'var(--text-muted)' }} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Input */}
              <div className="form-group">
                <label>Note (optional)</label>
                <textarea
                  placeholder="Any additional notes..."
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={handleSave}
                disabled={!formData.title.trim() || !formData.time.trim()}
              >
                <Save size={18} />
                {editingReminder ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
