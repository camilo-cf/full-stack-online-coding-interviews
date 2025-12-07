# CodeCollab - Collaborative Coding Interview Platform

A real-time collaborative coding interview platform built with React, Express, and Socket.IO.

![CodeCollab](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 🔗 **Create & Share Sessions** - Generate unique session links to share with candidates
- 👥 **Real-time Collaboration** - Code together with live sync (like Google Docs for code)
- 🌐 **Multiple Languages** - Support for JavaScript, Python, and more
- ⚡ **Instant Updates** - Changes appear immediately for all connected users
- 🎨 **Premium Dark UI** - Modern, distraction-free coding environment

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Styling | Vanilla CSS (Dark Theme) |

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── index.css       # Global styles
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # REST API endpoints
│   │   ├── socket/         # Socket.IO handlers
│   │   └── store/          # In-memory session storage
│   └── openapi.yaml        # API specification
│
└── package.json            # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository (if applicable)
cd full-stack-online-coding-interviews

# Install all dependencies (both client and server)
npm run install:all
```

### Running Locally

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

## API Reference

See [server/openapi.yaml](server/openapi.yaml) for the full API specification.

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create a new session |
| GET | `/api/sessions/:id` | Get session details |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-session` | Client → Server | Join a session room |
| `session-state` | Server → Client | Initial session state |
| `code-change` | Client → Server | Send code update |
| `code-update` | Server → Client | Receive code update |
| `language-change` | Client → Server | Change language |
| `language-update` | Server → Client | Receive language update |

## Future Enhancements

- [ ] Syntax highlighting (Monaco Editor or CodeMirror)
- [ ] Code execution (sandboxed runtime)
- [ ] Video/audio chat integration
- [ ] Session persistence (database storage)
- [ ] User authentication

## License

MIT License - See LICENSE file for details.
