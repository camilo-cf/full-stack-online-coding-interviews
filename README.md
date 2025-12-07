# CodeCollab - Collaborative Coding Interview Platform

A real-time collaborative coding interview platform built with React, Express, and Socket.IO. Create interview sessions, share links with candidates, and code together in real-time.

## Features

- 🔗 **Create & Share Sessions** - Generate unique session links to share with candidates
- 👥 **Real-time Collaboration** - Code together with live sync (like Google Docs for code)
- 🌐 **Multiple Languages** - Support for JavaScript, Python, and more
- 🎨 **Dark/Light Theme** - Toggle between themes with localStorage persistence
- ⚡ **Instant Updates** - Changes appear immediately for all connected users

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Testing | Vitest + Supertest + socket.io-client |

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   └── pages/          # Page components
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # REST API endpoints
│   │   ├── socket/         # Socket.IO handlers
│   │   └── store/          # In-memory session storage
│   ├── tests/              # Integration tests
│   │   ├── api.test.js     # REST API tests
│   │   ├── socket.test.js  # Socket.IO tests
│   │   └── setup.js        # Test server factory
│   └── package.json
│
└── package.json            # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/camilo-cf/full-stack-online-coding-interviews.git
cd full-stack-online-coding-interviews

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

You'll need **two terminal windows**:

**Terminal 1 - Start the Backend:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:3001`

**Terminal 2 - Start the Frontend:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`

### Usage

1. Open your browser to `http://localhost:5173`
2. Click **"Create Interview Session"**
3. Share the session URL with your candidate
4. Start coding together! 🎉

## Running Tests

The project includes integration tests for the backend API and Socket.IO real-time communication.

### Test Stack

- **Vitest** - Fast test runner with ES modules support
- **Supertest** - HTTP assertions for REST API testing
- **socket.io-client** - Client library for Socket.IO integration tests

### Execute Tests

```bash
cd server
npm test
```

Or run tests in watch mode during development:
```bash
cd server
npm run test:watch
```

### What's Tested

**REST API Tests (`tests/api.test.js`):**
- Health check endpoint returns status OK
- POST `/api/sessions` creates a new session with valid UUID
- Each session gets a unique ID
- GET `/api/sessions/:id` returns session data
- GET returns 404 for non-existent sessions

**Socket.IO Tests (`tests/socket.test.js`):**
- Clients receive session state when joining
- Error returned when joining non-existent session
- Code changes broadcast to other clients in same session
- Sender does NOT receive their own code update
- Language changes broadcast to other clients
- **Session isolation**: Changes in one session do NOT affect other sessions

## API Reference

See [server/openapi.yaml](server/openapi.yaml) for the full API specification.

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create a new session |
| GET | `/api/sessions/:id` | Get session details |
| GET | `/health` | Health check |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-session` | Client → Server | Join a session room |
| `session-state` | Server → Client | Initial session state |
| `code-change` | Client → Server | Send code update |
| `code-update` | Server → Client | Receive code update |
| `language-change` | Client → Server | Change language |
| `language-update` | Server → Client | Receive language update |

## License

MIT License
