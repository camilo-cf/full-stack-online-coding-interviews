/**
 * Test Server Setup
 * 
 * Creates an isolated Express + Socket.IO server instance for testing.
 * Uses dynamic port assignment to avoid conflicts.
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import sessionRoutes from '../src/routes/sessions.js';
import { registerSocketHandlers } from '../src/socket/handlers.js';

/**
 * Create a test server instance
 * @returns {Object} { app, httpServer, io, getUrl }
 */
export function createTestServer() {
  const app = express();

  // Middleware
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  // Security Middleware (Mirroring production)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "cdn.jsdelivr.net"],
        connectSrc: ["'self'", "ws:", "wss:", "data:", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.jsdelivr.net"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        workerSrc: ["'self'", "blob:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate limiting (Mirroring production)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', apiLimiter);

  // Routes
  app.use('/api/sessions', sessionRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  // Register Socket.IO handlers
  registerSocketHandlers(io);

  // Start server on dynamic port
  let serverUrl = '';
  
  const start = () => {
    return new Promise((resolve) => {
      httpServer.listen(0, () => {
        const address = httpServer.address();
        serverUrl = `http://localhost:${address.port}`;
        console.log(`[TestServer] Running on ${serverUrl}`);
        resolve(serverUrl);
      });
    });
  };

  const stop = () => {
    return new Promise((resolve) => {
      io.close(() => {
        httpServer.close(() => {
          console.log('[TestServer] Stopped');
          resolve();
        });
      });
    });
  };

  const getUrl = () => serverUrl;

  return { app, httpServer, io, start, stop, getUrl };
}
