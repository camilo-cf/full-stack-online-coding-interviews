/**
 * Socket.IO Integration Tests
 * 
 * Tests real-time communication for collaborative coding:
 * - join-session: Join a session and receive initial state
 * - code-change: Broadcast code updates to other clients
 * - language-change: Broadcast language updates to other clients
 * - Session isolation: Changes in one session don't affect others
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { io as ioc } from 'socket.io-client';
import request from 'supertest';
import { createTestServer } from './setup.js';

describe('Socket.IO Integration Tests', () => {
  let server;
  let serverUrl;
  let sockets = [];

  // Helper to create a connected socket client
  const createClient = () => {
    return new Promise((resolve) => {
      const socket = ioc(serverUrl, {
        transports: ['websocket'],
        forceNew: true
      });
      socket.on('connect', () => {
        sockets.push(socket);
        resolve(socket);
      });
    });
  };

  // Helper to create a session via API
  const createSession = async () => {
    const response = await request(server.app).post('/api/sessions');
    return response.body.id;
  };

  // Helper to disconnect all sockets
  const disconnectAll = () => {
    sockets.forEach(socket => {
      if (socket.connected) {
        socket.disconnect();
      }
    });
    sockets = [];
  };

  beforeAll(async () => {
    server = createTestServer();
    serverUrl = await server.start();
  });

  afterAll(async () => {
    disconnectAll();
    await server.stop();
  });

  afterEach(() => {
    disconnectAll();
  });

  describe('join-session', () => {
    it('should receive session state when joining a valid session', async () => {
      const sessionId = await createSession();
      const client = await createClient();

      const sessionState = await new Promise((resolve) => {
        client.on('session-state', resolve);
        client.emit('join-session', { sessionId });
      });

      expect(sessionState).toHaveProperty('code');
      expect(sessionState).toHaveProperty('language', 'javascript');
    });

    it('should receive error when joining non-existent session', async () => {
      const client = await createClient();

      const error = await new Promise((resolve) => {
        client.on('error', resolve);
        client.emit('join-session', { sessionId: 'fake-session-id' });
      });

      expect(error).toHaveProperty('message', 'Session not found');
    });
  });

  describe('code-change', () => {
    it('should broadcast code changes to other clients in the same session', async () => {
      const sessionId = await createSession();
      
      // Connect two clients
      const client1 = await createClient();
      const client2 = await createClient();

      // Both clients join the session
      await new Promise((resolve) => {
        client1.on('session-state', resolve);
        client1.emit('join-session', { sessionId });
      });

      await new Promise((resolve) => {
        client2.on('session-state', resolve);
        client2.emit('join-session', { sessionId });
      });

      // Client 2 listens for code updates
      const codeUpdatePromise = new Promise((resolve) => {
        client2.on('code-update', resolve);
      });

      // Client 1 emits a code change
      const newCode = 'console.log("Hello from test!");';
      client1.emit('code-change', { sessionId, code: newCode });

      // Wait for client 2 to receive the update
      const update = await codeUpdatePromise;
      expect(update).toHaveProperty('code', newCode);
    });

    it('should NOT send code update back to the sender', async () => {
      const sessionId = await createSession();
      const client = await createClient();

      // Join session
      await new Promise((resolve) => {
        client.on('session-state', resolve);
        client.emit('join-session', { sessionId });
      });

      // Listen for code updates (should NOT receive own update)
      let receivedOwnUpdate = false;
      client.on('code-update', () => {
        receivedOwnUpdate = true;
      });

      // Emit code change
      client.emit('code-change', { sessionId, code: 'test code' });

      // Wait a bit and verify no update was received
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(receivedOwnUpdate).toBe(false);
    });
  });

  describe('language-change', () => {
    it('should broadcast language changes to other clients in the same session', async () => {
      const sessionId = await createSession();
      
      // Connect two clients
      const client1 = await createClient();
      const client2 = await createClient();

      // Both clients join the session
      await new Promise((resolve) => {
        client1.on('session-state', resolve);
        client1.emit('join-session', { sessionId });
      });

      await new Promise((resolve) => {
        client2.on('session-state', resolve);
        client2.emit('join-session', { sessionId });
      });

      // Client 2 listens for language updates
      const languageUpdatePromise = new Promise((resolve) => {
        client2.on('language-update', resolve);
      });

      // Client 1 changes the language
      client1.emit('language-change', { sessionId, language: 'python' });

      // Wait for client 2 to receive the update
      const update = await languageUpdatePromise;
      expect(update).toHaveProperty('language', 'python');
    });
  });

  describe('Session Isolation', () => {
    it('should NOT broadcast changes to clients in different sessions', async () => {
      // Create two different sessions
      const sessionId1 = await createSession();
      const sessionId2 = await createSession();
      
      // Connect clients to different sessions
      const client1 = await createClient();
      const client2 = await createClient();

      // Client 1 joins session 1
      await new Promise((resolve) => {
        client1.on('session-state', resolve);
        client1.emit('join-session', { sessionId: sessionId1 });
      });

      // Client 2 joins session 2
      await new Promise((resolve) => {
        client2.on('session-state', resolve);
        client2.emit('join-session', { sessionId: sessionId2 });
      });

      // Client 2 listens for code updates (should NOT receive any)
      let receivedUpdate = false;
      client2.on('code-update', () => {
        receivedUpdate = true;
      });

      // Client 1 emits a code change in session 1
      client1.emit('code-change', { 
        sessionId: sessionId1, 
        code: 'code for session 1' 
      });

      // Wait and verify client 2 did NOT receive the update
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(receivedUpdate).toBe(false);
    });
  });
});
