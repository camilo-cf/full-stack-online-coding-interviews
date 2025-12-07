/**
 * Session Page - Collaborative Coding Session
 * 
 * Main interview session view featuring:
 * - Real-time code editor synced across clients
 * - Language selector shared across clients
 * - Connection status indicator
 * - Share link functionality
 */
import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket.js';
import { useTheme } from '../hooks/useTheme.js';
import CodeEditor from '../components/CodeEditor.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import './Session.css';

function Session() {
  const { id: sessionId } = useParams();
  const { theme, toggleTheme } = useTheme();
  
  // Local state for code and language
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  /**
   * Socket event handlers
   */
  const handleSessionState = useCallback((data) => {
    console.log('[Session] Received initial state');
    setCode(data.code);
    setLanguage(data.language);
    setIsLoading(false);
  }, []);

  const handleCodeUpdate = useCallback((newCode) => {
    console.log('[Session] Code updated by another client');
    setCode(newCode);
  }, []);

  const handleLanguageUpdate = useCallback((newLanguage) => {
    console.log('[Session] Language updated by another client:', newLanguage);
    setLanguage(newLanguage);
  }, []);

  const handleError = useCallback((message) => {
    console.error('[Session] Socket error:', message);
  }, []);

  // Connect to socket
  const { isConnected, connectionError, emitCodeChange, emitLanguageChange } = useSocket(
    sessionId,
    {
      onSessionState: handleSessionState,
      onCodeUpdate: handleCodeUpdate,
      onLanguageUpdate: handleLanguageUpdate,
      onError: handleError
    }
  );

  /**
   * Handle local code change
   */
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    emitCodeChange(newCode);
  }, [emitCodeChange]);

  /**
   * Handle local language change
   */
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    emitLanguageChange(newLanguage);
  }, [emitLanguageChange]);

  /**
   * Copy session link to clipboard
   */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[Session] Failed to copy link:', err);
    }
  }, []);

  return (
    <div className="session">
      {/* Header */}
      <header className="session__header">
        <div className="session__header-left">
          <Link to="/" className="session__logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3L4 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 3L10 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="gradient-text">CodeCollab</span>
          </Link>
        </div>

        <div className="session__header-center">
          <div className="session__session-info">
            <span className="session__session-label">Session</span>
            <code className="session__session-id">{sessionId.slice(0, 8)}...</code>
          </div>
        </div>

        <div className="session__header-right">
          {/* Connection status */}
          <div className={`session__status ${isConnected ? 'session__status--connected' : 'session__status--disconnected'}`}>
            <span className="session__status-dot"></span>
            <span className="session__status-text">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>

          {/* Theme toggle */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {/* Share button */}
          <button 
            className="session__share-btn"
            onClick={handleCopyLink}
            title="Copy session link"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Share
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="session__main">
        {/* Toolbar */}
        <div className="session__toolbar">
          <LanguageSelector
            value={language}
            onChange={handleLanguageChange}
            disabled={!isConnected}
          />
          
          {connectionError && (
            <div className="session__error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {connectionError}
            </div>
          )}
        </div>

        {/* Code editor */}
        <div className="session__editor">
          {isLoading ? (
            <div className="session__loading">
              <div className="session__loading-spinner"></div>
              <p>Loading session...</p>
            </div>
          ) : (
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              disabled={!isConnected}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Session;
