/**
 * In-memory session storage
 * 
 * Stores all active sessions in a Map for quick access.
 * In production, this would be replaced with Redis or a database.
 */

// Map to store sessions: sessionId -> { code, language }
const sessions = new Map();

/**
 * Create a new session with default values
 * @param {string} sessionId - UUID for the session
 * @returns {Object} The created session object
 */
export function createSession(sessionId) {
  const session = {
    id: sessionId,
    code: '// Start coding here...\n',
    language: 'javascript',
    createdAt: new Date().toISOString()
  };
  
  sessions.set(sessionId, session);
  console.log(`[SessionStore] Created session: ${sessionId}`);
  
  return session;
}

/**
 * Get a session by ID
 * @param {string} sessionId - UUID of the session
 * @returns {Object|null} The session object or null if not found
 */
export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Update the code in a session
 * @param {string} sessionId - UUID of the session
 * @param {string} code - New code content
 * @returns {boolean} True if update was successful
 */
export function updateCode(sessionId, code) {
  const session = sessions.get(sessionId);
  if (!session) {
    console.warn(`[SessionStore] Session not found for code update: ${sessionId}`);
    return false;
  }
  
  session.code = code;
  console.log(`[SessionStore] Updated code in session: ${sessionId} (${code.length} chars)`);
  return true;
}

/**
 * Update the language in a session
 * @param {string} sessionId - UUID of the session
 * @param {string} language - New language selection
 * @returns {boolean} True if update was successful
 */
export function updateLanguage(sessionId, language) {
  const session = sessions.get(sessionId);
  if (!session) {
    console.warn(`[SessionStore] Session not found for language update: ${sessionId}`);
    return false;
  }
  
  session.language = language;
  console.log(`[SessionStore] Updated language in session: ${sessionId} -> ${language}`);
  return true;
}

/**
 * Check if a session exists
 * @param {string} sessionId - UUID of the session
 * @returns {boolean} True if session exists
 */
export function sessionExists(sessionId) {
  return sessions.has(sessionId);
}

/**
 * Get the total number of active sessions (for debugging)
 * @returns {number} Number of active sessions
 */
export function getSessionCount() {
  return sessions.size;
}
