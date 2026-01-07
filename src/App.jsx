/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component with Routing
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Reminders, Learn, Profile } from './pages';

function App() {
  return (
    <div className="app-container">
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />
      
      {/* Main Routes - 3 tabs only */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
