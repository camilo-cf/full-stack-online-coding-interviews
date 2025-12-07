/**
 * App Component - Main Router Setup
 * 
 * Defines the application routes:
 * - / : Home page with session creation
 * - /session/:id : Collaborative coding session
 */
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Session from './pages/Session.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session/:id" element={<Session />} />
    </Routes>
  );
}

export default App;
