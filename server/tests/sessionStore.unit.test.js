/**
 * Session Store Unit Tests
 * 
 * Tests the in-memory session storage module in isolation.
 * These are pure unit tests - no network, no integration.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createSession,
  getSession,
  updateCode,
  updateLanguage,
  sessionExists,
  getSessionCount,
  cleanupSessions
} from '../src/store/sessionStore.js';

describe('Session Store Unit Tests', () => {
  // Note: Since sessionStore uses a module-level Map, tests may affect each other
  // This is acceptable for unit tests as we're testing the actual behavior

  describe('createSession', () => {
    it('should create a session with the given ID', () => {
      const sessionId = 'test-session-create-1';
      const session = createSession(sessionId);

      expect(session).toBeDefined();
      expect(session.id).toBe(sessionId);
    });

    it('should initialize session with default code comment', () => {
      const sessionId = 'test-session-create-2';
      const session = createSession(sessionId);

      expect(session.code).toBe('// Start coding here...\n');
    });

    it('should initialize session with javascript as default language', () => {
      const sessionId = 'test-session-create-3';
      const session = createSession(sessionId);

      expect(session.language).toBe('javascript');
    });

    it('should set createdAt timestamp', () => {
      const sessionId = 'test-session-create-4';
      const before = new Date().toISOString();
      const session = createSession(sessionId);
      const after = new Date().toISOString();

      expect(session.createdAt).toBeDefined();
      expect(session.createdAt >= before).toBe(true);
      expect(session.createdAt <= after).toBe(true);
    });
  });

  describe('getSession', () => {
    it('should return existing session', () => {
      const sessionId = 'test-session-get-1';
      createSession(sessionId);

      const session = getSession(sessionId);
      expect(session).not.toBeNull();
      expect(session.id).toBe(sessionId);
    });

    it('should return null for non-existent session', () => {
      const session = getSession('non-existent-session-id');
      expect(session).toBeNull();
    });
  });

  describe('updateCode', () => {
    it('should update code for existing session', () => {
      const sessionId = 'test-session-code-1';
      createSession(sessionId);

      const newCode = 'console.log("Hello!");';
      const result = updateCode(sessionId, newCode);

      expect(result).toBe(true);
      expect(getSession(sessionId).code).toBe(newCode);
    });

    it('should return false for non-existent session', () => {
      const result = updateCode('non-existent', 'some code');
      expect(result).toBe(false);
    });

    it('should handle empty code', () => {
      const sessionId = 'test-session-code-2';
      createSession(sessionId);

      const result = updateCode(sessionId, '');
      expect(result).toBe(true);
      expect(getSession(sessionId).code).toBe('');
    });

    it('should handle multiline code', () => {
      const sessionId = 'test-session-code-3';
      createSession(sessionId);

      const multilineCode = `function hello() {
  console.log("Hello!");
}`;
      updateCode(sessionId, multilineCode);
      expect(getSession(sessionId).code).toBe(multilineCode);
    });
  });

  describe('updateLanguage', () => {
    it('should update language for existing session', () => {
      const sessionId = 'test-session-lang-1';
      createSession(sessionId);

      const result = updateLanguage(sessionId, 'python');

      expect(result).toBe(true);
      expect(getSession(sessionId).language).toBe('python');
    });

    it('should return false for non-existent session', () => {
      const result = updateLanguage('non-existent', 'python');
      expect(result).toBe(false);
    });
  });

  describe('sessionExists', () => {
    it('should return true for existing session', () => {
      const sessionId = 'test-session-exists-1';
      createSession(sessionId);

      expect(sessionExists(sessionId)).toBe(true);
    });

    it('should return false for non-existent session', () => {
      expect(sessionExists('definitely-not-exists')).toBe(false);
    });
  });

  describe('getSessionCount', () => {
    it('should return number of sessions', () => {
      const initialCount = getSessionCount();
      
      createSession('test-count-1');
      createSession('test-count-2');

      expect(getSessionCount()).toBe(initialCount + 2);
    });
  });
  describe('cleanupSessions', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should remove expired sessions', () => {
      const sessionId = 'expired-session';
      createSession(sessionId);
      
      // Fast forward 25 hours
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);
      
      const removed = cleanupSessions();
      expect(removed).toBeGreaterThan(0);
      expect(sessionExists(sessionId)).toBe(false);
    });

    it('should keep active sessions', () => {
      const sessionId = 'active-session';
      createSession(sessionId);
      
      // Fast forward 23 hours
      vi.advanceTimersByTime(23 * 60 * 60 * 1000);
      
      cleanupSessions();
      expect(sessionExists(sessionId)).toBe(true);
    });

    it('should update timestamp on code change', () => {
      const sessionId = 'active-code-session';
      createSession(sessionId);
      
      // Advance 20 hours
      vi.advanceTimersByTime(20 * 60 * 60 * 1000);
      
      updateCode(sessionId, 'new code');
      
      // Advance another 5 hours (total 25 from start, but 5 from update)
      vi.advanceTimersByTime(5 * 60 * 60 * 1000);
      
      cleanupSessions();
      expect(sessionExists(sessionId)).toBe(true);
    });
  });
});
