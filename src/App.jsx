/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component
 * MCP + VAPI Integration for grounding conversations
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Tracking } from './pages';
import VoiceSession from './components/VoiceSession';
import { usePatient } from './context/PatientContext';

function App() {
  const { isLoading } = usePatient();

  // Show loading state
  if (isLoading) {
    return (
      <div className="app-container loading-container">
        <div className="loading-spinner">
          <img src="/assets/name.svg" alt="EverMind" className="loading-logo" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/voice-session" element={<VoiceSession />} />
      </Routes>
    </div>
  );
}

export default App;
