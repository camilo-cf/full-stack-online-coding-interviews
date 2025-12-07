/**
 * useSocket Hook - Socket.IO Connection Management
 * 
 * Handles:
 * - Socket connection lifecycle
 * - Session joining
 * - Event subscriptions
 * - Cleanup on unmount
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// Socket.IO server URL (uses Vite proxy in development)
const SOCKET_URL = '/';

/**
 * Custom hook for real-time Socket.IO communication
 * 
 * @param {string} sessionId - The session ID to join
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onSessionState - Called when initial state is received
 * @param {Function} callbacks.onCodeUpdate - Called when code changes from other clients
 * @param {Function} callbacks.onLanguageUpdate - Called when language changes from other clients
 * @param {Function} callbacks.onOutputUpdate - Called when execution output changes from other clients
 * @param {Function} callbacks.onPresenceUpdate - Called when user presence/activity changes
 * @param {Function} callbacks.onError - Called when an error occurs
 */
export function useSocket(sessionId, callbacks) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Store callbacks in a ref to avoid reconnection on callback changes
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!sessionId) return;

    console.log('[useSocket] Connecting to socket server...');

    // Create socket connection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('[useSocket] Connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);

      // Join the session room
      socket.emit('join-session', { sessionId });
    });

    socket.on('disconnect', (reason) => {
      console.log('[useSocket] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[useSocket] Connection error:', error);
      setConnectionError('Unable to connect to server');
      setIsConnected(false);
    });

    // Session event handlers
    socket.on('session-state', (data) => {
      console.log('[useSocket] Received session state:', data);
      callbacksRef.current.onSessionState?.(data);
    });

    socket.on('code-update', (data) => {
      console.log('[useSocket] Received code update');
      callbacksRef.current.onCodeUpdate?.(data.code);
    });

    socket.on('language-update', (data) => {
      console.log('[useSocket] Received language update:', data.language);
      callbacksRef.current.onLanguageUpdate?.(data.language);
    });

    socket.on('output-update', (data) => {
      console.log('[useSocket] Received output update from remote');
      callbacksRef.current.onOutputUpdate?.(data);
    });

    socket.on('presence-update', (data) => {
      // Don't log every update as it can be frequent
      callbacksRef.current.onPresenceUpdate?.(data);
    });

    socket.on('error', (data) => {
      console.error('[useSocket] Server error:', data.message);
      callbacksRef.current.onError?.(data.message);
    });

    // Cleanup on unmount
    return () => {
      console.log('[useSocket] Cleaning up socket connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId]);

  /**
   * Emit a code change to the server
   */
  const emitCodeChange = useCallback((code) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('code-change', { sessionId, code });
    }
  }, [sessionId]);

  /**
   * Emit a language change to the server
   */
  const emitLanguageChange = useCallback((language) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('language-change', { sessionId, language });
    }
  }, [sessionId]);

  /**
   * Emit an output update to the server (for syncing execution results)
   */
  const emitOutputChange = useCallback((output, error, isRunning) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('output-change', { sessionId, output, error, isRunning });
    }
  }, [sessionId]);

  /**
   * Emit activity status change
   */
  const emitActivityChange = useCallback((isActive) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('activity-change', { sessionId, isActive });
    }
  }, [sessionId]);

  return {
    isConnected,
    connectionError,
    emitCodeChange,
    emitLanguageChange,
    emitOutputChange,
    emitActivityChange
  };
}
