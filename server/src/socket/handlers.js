/**
 * Socket.IO Event Handlers
 * 
 * Handles real-time communication for collaborative coding:
 * - join-session: Join a session room
 * - code-change: Broadcast code updates
 * - language-change: Broadcast language updates
 */

import { 
  getSession, 
  updateCode, 
  updateLanguage, 
  sessionExists 
} from '../store/sessionStore.js';

/**
 * Register all Socket.IO event handlers
 * @param {Server} io - Socket.IO server instance
 */
export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    
    // Track which session this socket is in
    let currentSessionId = null;

    /**
     * Handle joining a session
     * Client sends: { sessionId: string }
     * Server responds with: session-state { code, language } or error
     */
    socket.on('join-session', (data) => {
      const { sessionId } = data;
      
      if (!sessionId) {
        socket.emit('error', { message: 'Session ID is required' });
        return;
      }
      
      // Check if session exists
      if (!sessionExists(sessionId)) {
        console.warn(`[Socket] Client tried to join non-existent session: ${sessionId}`);
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Leave previous session if any
      if (currentSessionId) {
        socket.leave(currentSessionId);
        console.log(`[Socket] Client ${socket.id} left session: ${currentSessionId}`);
      }
      
      // Join the new session room
      socket.join(sessionId);
      currentSessionId = sessionId;
      
      // Get current session state
      const session = getSession(sessionId);
      
      console.log(`[Socket] Client ${socket.id} joined session: ${sessionId}`);
      
      // Send current state to the joining client
      socket.emit('session-state', {
        code: session.code,
        language: session.language
      });
    });

    /**
     * Handle code changes
     * Client sends: { sessionId: string, code: string }
     * Server broadcasts: code-update { code } to other clients in room
     */
    socket.on('code-change', (data) => {
      const { sessionId, code } = data;
      
      if (!sessionId || code === undefined) {
        socket.emit('error', { message: 'Invalid code change data' });
        return;
      }
      
      // Update the session store
      const updated = updateCode(sessionId, code);
      
      if (!updated) {
        socket.emit('error', { message: 'Failed to update code' });
        return;
      }
      
      // Broadcast to all OTHER clients in the room (not the sender)
      socket.to(sessionId).emit('code-update', { code });
    });

    /**
     * Handle language changes
     * Client sends: { sessionId: string, language: string }
     * Server broadcasts: language-update { language } to other clients in room
     */
    socket.on('language-change', (data) => {
      const { sessionId, language } = data;
      
      if (!sessionId || !language) {
        socket.emit('error', { message: 'Invalid language change data' });
        return;
      }
      
      // Validate language
      const validLanguages = ['javascript', 'python', 'other'];
      if (!validLanguages.includes(language)) {
        socket.emit('error', { message: 'Invalid language selection' });
        return;
      }
      
      // Update the session store
      const updated = updateLanguage(sessionId, language);
      
      if (!updated) {
        socket.emit('error', { message: 'Failed to update language' });
        return;
      }
      
      // Broadcast to all OTHER clients in the room (not the sender)
      socket.to(sessionId).emit('language-update', { language });
    });

    /**
     * Handle client disconnect
     */
    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      if (currentSessionId) {
        console.log(`[Socket] Client ${socket.id} left session on disconnect: ${currentSessionId}`);
      }
    });
  });
}
