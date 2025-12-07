/**
 * Express + Socket.IO Server Entry Point
 * 
 * This is the main server file that:
 * - Sets up Express with CORS
 * - Creates HTTP server for Socket.IO
 * - Mounts REST API routes
 * - Initializes Socket.IO with event handlers
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import sessionRoutes from './routes/sessions.js';
import { registerSocketHandlers } from './socket/handlers.js';

// Configuration
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Security Middleware
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

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

// REST API Routes
app.use('/api/sessions', sessionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(distPath));

  // Handle SPA routing - return index.html for unknown paths (excluding API)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Register Socket.IO event handlers
registerSocketHandlers(io);

// Start server
httpServer.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Interview Platform Server`);
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO: ws://localhost:${PORT}`);
  console.log(`🌐 Accepting clients from: ${CLIENT_URL}`);
  console.log('='.repeat(50));
});

// Handle server errors
httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('='.repeat(50));
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('');
    console.error('To fix this, either:');
    console.error(`  1. Kill the process using port ${PORT}:`);
    console.error(`     lsof -ti:${PORT} | xargs kill -9`);
    console.error('');
    console.error('  2. Or use a different port:');
    console.error(`     PORT=3002 npm run dev`);
    console.error('='.repeat(50));
    process.exit(1);
  } else {
    console.error('[Server] Error:', error);
    process.exit(1);
  }
});
