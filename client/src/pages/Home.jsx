/**
 * Home Page - Landing Page with Session Creation
 * 
 * Features:
 * - Hero section with app branding
 * - Create Session CTA button
 * - Animated background elements
 * - Premium glassmorphism design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import './Home.css';

// Server URL for API calls (uses Vite proxy in development)
const API_URL = '/api';

function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new session and navigate to it
   */
  const handleCreateSession = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      console.log('[Home] Session created:', data.id);
      
      // Navigate to the new session
      navigate(`/session/${data.id}`);
    } catch (err) {
      console.error('[Home] Error creating session:', err);
      setError('Unable to create session. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="home">
      {/* Theme toggle in corner */}
      <div className="home__theme-toggle">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      {/* Animated background orbs */}
      <div className="home__bg-orbs">
        <div className="home__orb home__orb--1"></div>
        <div className="home__orb home__orb--2"></div>
        <div className="home__orb home__orb--3"></div>
      </div>

      {/* Main content */}
      <main className="home__content">
        {/* Logo / Brand */}
        <div className="home__brand animate-fade-in">
          <div className="home__logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3L4 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 3L10 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="home__title">
            <span className="gradient-text">CodeCollab</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="home__tagline animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Real-time collaborative coding interviews.<br />
          Code together, anywhere.
        </p>

        {/* Feature highlights */}
        <div className="home__features animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="home__feature">
            <span className="home__feature-icon">🔗</span>
            <span>Share a link</span>
          </div>
          <div className="home__feature">
            <span className="home__feature-icon">👥</span>
            <span>Code together</span>
          </div>
          <div className="home__feature">
            <span className="home__feature-icon">⚡</span>
            <span>Real-time sync</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="home__cta animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button 
            className="home__create-btn"
            onClick={handleCreateSession}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="home__spinner"></span>
                Creating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create Interview Session
              </>
            )}
          </button>
          
          {error && (
            <p className="home__error">{error}</p>
          )}
        </div>

        {/* Footer */}
        <footer className="home__footer animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>Collaborative Coding Interview Platform</p>
        </footer>
      </main>
    </div>
  );
}

export default Home;
