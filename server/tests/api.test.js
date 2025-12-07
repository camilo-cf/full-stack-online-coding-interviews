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
