/**
 * Reminders Page
 * Medication & daily task reminders management
 */

import { PageLayout } from '../components';
import { 
  Bell, 
  Plus, 
  Pill, 
  Droplets, 
  Moon,
  Clock,
  Repeat,
  CheckCircle,
  Code
} from 'lucide-react';

const Reminders = () => {
  // Placeholder reminder types
  const reminderTypes = [
    { 
      icon: Pill, 
      type: 'medication',
      title: 'Medication Reminders',
      description: 'Track and manage medication schedules',
      count: 3
    },
    { 
      icon: Droplets, 
      type: 'hydration',
      title: 'Hydration Reminders',
      description: 'Stay hydrated throughout the day',
      count: 5
    },
    { 
      icon: Moon, 
      type: 'rest',
      title: 'Rest Reminders',
      description: 'Scheduled rest and relaxation times',
      count: 2
    },
  ];

  // Placeholder upcoming reminders
  const upcomingReminders = [
    { time: '8:00 AM', task: 'Take morning vitamins', type: 'medication', status: 'pending' },
    { time: '9:30 AM', task: 'Drink water (Glass 1)', type: 'hydration', status: 'pending' },
    { time: '12:00 PM', task: 'Lunch medication', type: 'medication', status: 'pending' },
    { time: '2:00 PM', task: 'Afternoon nap', type: 'rest', status: 'pending' },
    { time: '4:00 PM', task: 'Drink water (Glass 4)', type: 'hydration', status: 'pending' },
  ];

  // Planned features
  const plannedFeatures = [
    'Create, Read, Update, Delete (CRUD) reminder operations',
    'Push notification system integration',
    'Recurring reminders (daily, weekly, custom)',
    'Time-based alerts with sound options',
    'Medication dosage tracking',
    'Caregiver notification sync',
    'Reminder completion history',
    'Smart reminder suggestions based on patterns',
  ];

  return (
    <PageLayout
      title="Reminders"
      description="Manage medication schedules, hydration, and daily task reminders for better care."
      icon={Bell}
      bunnyImage="/assets/bunny4.svg"
      themeColor="#F5A86B"
    >
      {/* Add Reminder Button */}
      <button className="btn btn-primary btn-large" style={{ marginBottom: '20px' }}>
        <Plus size={20} />
        Add New Reminder
      </button>

      {/* Reminder Categories */}
      <section className="section">
        <h3 className="section-title">
          <Clock size={20} />
          Reminder Categories
        </h3>
        {reminderTypes.map(({ icon: Icon, type, title, description, count }, index) => (
          <div key={index} className="reminder-item" style={{ cursor: 'pointer' }}>
            <div className={`reminder-icon ${type}`}>
              <Icon size={20} />
            </div>
            <div className="reminder-content">
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
            <span className="reminder-time">{count} active</span>
          </div>
        ))}
      </section>

      {/* Upcoming Reminders */}
      <section className="section">
        <h3 className="section-title">
          <Repeat size={20} />
          Upcoming Today
        </h3>
        {upcomingReminders.map((reminder, index) => (
          <div key={index} className="reminder-item">
            <div className={`reminder-icon ${reminder.type}`}>
              {reminder.type === 'medication' && <Pill size={20} />}
              {reminder.type === 'hydration' && <Droplets size={20} />}
              {reminder.type === 'rest' && <Moon size={20} />}
            </div>
            <div className="reminder-content">
              <h4>{reminder.task}</h4>
              <p>Tap to mark complete</p>
            </div>
            <span className="reminder-time">{reminder.time}</span>
          </div>
        ))}
      </section>
    </PageLayout>
  );
};

export default Reminders;
