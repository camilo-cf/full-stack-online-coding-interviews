/**
 * REST API Integration Tests
 * 
 * Tests the HTTP endpoints for session management:
 * - POST /api/sessions - Create a new session
 * - GET /api/sessions/:id - Get session details
 * - GET /health - Health check
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestServer } from './setup.js';

describe('REST API Integration Tests', () => {
  let server;
  let app;

  beforeAll(async () => {
    server = createTestServer();
    await server.start();
    app = server.app;
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Security Headers', () => {
    it('should include strictly configured Content-Security-Policy', async () => {
      const response = await request(app).get('/health');
      
      const csp = response.headers['content-security-policy'];
      expect(csp).toBeDefined();
      
      // Verify critical security directives
      expect(csp).toContain("default-src 'self'");
      
      // Verify external sources allowed for functionality (Monaco, Pyodide)
      expect(csp).toContain("cdn.jsdelivr.net"); // Scripts & Styles
      expect(csp).toContain("fonts.googleapis.com"); // Fonts
    });

    it('should include Rate Limiting headers on API routes', async () => {
      // Rate limiter is mounted on /api/
      const response = await request(app).get('/api/sessions/rate-limit-check').expect(404);
      
      // Standard headers are used (legacyHeaders: false)
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });
  });

  describe('POST /api/sessions', () => {
    it('should create a new session and return a valid session ID', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message', 'Session created successfully');
      
      // Verify the ID looks like a UUID (8-4-4-4-12 format)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(response.body.id).toMatch(uuidRegex);
    });

    it('should create multiple unique sessions', async () => {
      const response1 = await request(app).post('/api/sessions').expect(201);
      const response2 = await request(app).post('/api/sessions').expect(201);

      expect(response1.body.id).not.toBe(response2.body.id);
    });
  });

  describe('GET /api/sessions/:id', () => {
    it('should return session data for a valid session', async () => {
      // First create a session
      const createResponse = await request(app)
        .post('/api/sessions')
        .expect(201);

      const sessionId = createResponse.body.id;

      // Then retrieve it
      const getResponse = await request(app)
        .get(`/api/sessions/${sessionId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(getResponse.body).toHaveProperty('id', sessionId);
      expect(getResponse.body).toHaveProperty('code');
      expect(getResponse.body).toHaveProperty('language', 'javascript');
    });

    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/sessions/non-existent-session-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Session not found');
    });
  });
});
