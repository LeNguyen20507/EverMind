/**
 * EmergencyModal Component
 * Full-screen emergency overlay with calming features and medical info
 */

import { useState } from 'react';
import { 
  Phone, 
  AlertCircle, 
  Heart, 
  Music, 
  Image, 
  Video, 
  Mic,
  X,
  ArrowLeft,
  Sparkles,
  FileText,
  User,
  Pill,
  AlertTriangle
} from 'lucide-react';

const EmergencyModal = ({ isOpen, onClose, patientInfo }) => {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'calming', 'medical'
  const [selectedMemory, setSelectedMemory] = useState(null);

  if (!isOpen) return null;

  // Calming memory categories
  const calmingCategories = [
    { 
      id: 'music', 
      icon: Music, 
      title: 'Favorite Music', 
      color: '#8B5CF6',
      items: [
        { name: 'Classic Jazz Collection', note: 'Usually calms within 2 mins' },
        { name: 'Frank Sinatra Playlist', note: 'Favorite from younger years' },
        { name: 'Piano Relaxation', note: 'Good for evening' }
      ]
    },
    { 
      id: 'photos', 
      icon: Image, 
      title: 'Photo Memories', 
      color: '#EC4899',
      items: [
        { name: 'Family Vacation 1985', note: 'Beach trip memories' },
        { name: 'Wedding Album', note: 'Strong positive response' },
        { name: 'Grandchildren Photos', note: 'Recent favorites' }
      ]
    },
    { 
      id: 'videos', 
      icon: Video, 
      title: 'Video Messages', 
      color: '#3B82F6',
      items: [
        { name: 'Message from Sarah', note: 'Daughter\'s reassurance video' },
        { name: 'Family Gathering 2024', note: 'Birthday celebration' }
      ]
    },
    { 
      id: 'voices', 
      icon: Mic, 
      title: 'Familiar Voices', 
      color: '#10B981',
      items: [
        { name: 'Mary\'s Voice Recording', note: 'Spouse\'s comforting message' },
        { name: 'Grandchildren Saying Hello', note: 'Usually brings smiles' }
      ]
    }
  ];

  const renderMainView = () => (
    <>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
        }}>
          <AlertCircle size={36} />
        </div>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          marginBottom: '4px',
          fontFamily: 'Outfit, sans-serif'
        }}>
          Emergency Assistance
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          For {patientInfo.name}
        </p>
      </div>

      {/* Emergency Call Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {/* Call 911 */}
        <a
          href="tel:911"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px',
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            borderRadius: '16px',
            textDecoration: 'none',
            color: 'white',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)',
            transition: 'transform 0.2s'
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Phone size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>Call 911</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Emergency Services</div>
          </div>
        </a>

        {/* Call Doctor */}
        <a
          href={`tel:${patientInfo.doctorPhone}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: '16px',
            textDecoration: 'none',
            color: 'white',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>Call Doctor</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{patientInfo.doctorName}</div>
          </div>
        </a>

        {/* Call Emergency Contact */}
        <a
          href={`tel:${patientInfo.emergencyContacts[0]?.phone}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px',
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
            borderRadius: '16px',
            textDecoration: 'none',
            color: 'white',
            boxShadow: '0 4px 16px rgba(20, 184, 166, 0.35)',
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Phone size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>Call Emergency Contact</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {patientInfo.emergencyContacts[0]?.name} - {patientInfo.emergencyContacts[0]?.role}
            </div>
          </div>
        </a>
      </div>

      {/* Secondary Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Calming Memories Button */}
        <button
          onClick={() => setCurrentView('calming')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '20px 16px',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            border: '2px solid #E9D5FF',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Heart size={28} style={{ color: '#A855F7' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#7C3AED', textAlign: 'center' }}>
            Show Calming Memories
          </span>
        </button>

        {/* Medical Info Button */}
        <button
          onClick={() => setCurrentView('medical')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '20px 16px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '2px solid #FCD34D',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <FileText size={28} style={{ color: '#D97706' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#B45309', textAlign: 'center' }}>
            Show Medical Info
          </span>
        </button>
      </div>
    </>
  );

  const renderCalmingView = () => (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            setCurrentView('main');
            setSelectedMemory(null);
          }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--neutral-100)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Calming Memories
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Help calm {patientInfo.name}
          </p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '20px',
        border: '1px solid #99F6E4'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} style={{ color: '#0D9488' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0D9488' }}>AI Suggestion</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#134E4A' }}>
          Try playing "Frank Sinatra Playlist" - this usually helps calm {patientInfo.name} within a few minutes.
        </p>
      </div>

      {/* Memory Categories */}
      {selectedMemory ? (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '16px',
            padding: '12px',
            background: `${selectedMemory.color}15`,
            borderRadius: '12px'
          }}>
            <selectedMemory.icon size={24} style={{ color: selectedMemory.color }} />
            <span style={{ fontSize: '1rem', fontWeight: '600', color: selectedMemory.color }}>
              {selectedMemory.title}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedMemory.items.map((item, idx) => (
              <button
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'white',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.note}
                  </div>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: selectedMemory.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <selectedMemory.icon size={18} />
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedMemory(null)}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '16px',
              background: 'var(--neutral-100)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Categories
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {calmingCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedMemory(category)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '24px 16px',
                background: `${category.color}10`,
                border: `2px solid ${category.color}30`,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <category.icon size={26} />
              </div>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: category.color,
                textAlign: 'center'
              }}>
                {category.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );

  const renderMedicalView = () => (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentView('main')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--neutral-100)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Medical Information
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Show to emergency responders
          </p>
        </div>
      </div>

      {/* Patient Info Header */}
      <div style={{
        background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>
          {patientInfo.name}
        </div>
        <div style={{ fontSize: '1rem', opacity: 0.9 }}>
          {patientInfo.condition} • Age {patientInfo.age}
        </div>
      </div>

      {/* Allergies - Critical */}
      <div style={{
        background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        border: '2px solid #EF4444',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '10px',
          color: '#DC2626'
        }}>
          <AlertTriangle size={20} />
          <span style={{ fontSize: '1rem', fontWeight: '700' }}>ALLERGIES</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#991B1B' }}>
          {patientInfo.allergies.join(' • ')}
        </div>
      </div>

      {/* Current Medications */}
      <div style={{
        background: 'white',
        border: '1px solid var(--neutral-200)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '12px',
          color: 'var(--primary-600)'
        }}>
          <Pill size={20} />
          <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>Current Medications</span>
        </div>
        {patientInfo.medications.map((med, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: idx < patientInfo.medications.length - 1 ? '1px solid var(--neutral-100)' : 'none'
          }}>
            <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {med.name}
            </span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {med.dosage} - {med.time}
            </span>
          </div>
        ))}
      </div>

      {/* Doctor Contact */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '1px solid #93C5FD',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '8px',
          color: '#2563EB'
        }}>
          <User size={20} />
          <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>Primary Physician</span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1E40AF', marginBottom: '4px' }}>
          {patientInfo.doctorName}
        </div>
        <div style={{ fontSize: '0.95rem', color: '#1E40AF' }}>
          {patientInfo.doctorPhone}
        </div>
      </div>

      {/* Behavioral Notes */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        border: '1px solid #FCD34D',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '10px',
          color: '#B45309'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>Important Notes</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {patientInfo.criticalInfo.map((info, idx) => (
            <li key={idx} style={{ fontSize: '0.9rem', color: '#92400E', marginBottom: '6px', lineHeight: '1.4' }}>
              {info}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          animation: 'slideUp 0.3s ease-out'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--neutral-100)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Content based on current view */}
        {currentView === 'main' && renderMainView()}
        {currentView === 'calming' && renderCalmingView()}
        {currentView === 'medical' && renderMedicalView()}
      </div>
    </div>
  );
};

export default EmergencyModal;
