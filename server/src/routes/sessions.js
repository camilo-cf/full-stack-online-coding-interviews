/**
 * Session REST API Routes
 * 
 * Handles HTTP endpoints for session management:
 * - POST /api/sessions - Create a new session
 * - GET /api/sessions/:id - Get session details
 */

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSession } from '../store/sessionStore.js';

const router = Router();

/**
 * POST /api/sessions
 * Creates a new coding session with a unique ID
 */
router.post('/', (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = createSession(sessionId);
    
    console.log(`[API] Created new session: ${sessionId}`);
    
    res.status(201).json({
      id: session.id,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('[API] Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * GET /api/sessions/:id
 * Retrieves the current state of a session
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const session = getSession(id);
    
    if (!session) {
      console.warn(`[API] Session not found: ${id}`);
      return res.status(404).json({ error: 'Session not found' });
    }
    
    console.log(`[API] Retrieved session: ${id}`);
    
    res.json({
      id: session.id,
      code: session.code,
      language: session.language
    });
  } catch (error) {
    console.error('[API] Error retrieving session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

export default router;
