# PeerPulse

**PeerPulse** is a full-stack peer collaboration platform built as a personal portfolio project by **Rishabh Kabra** — an Electronics and Communication Engineering student specializing in full-stack web development and analytics.

## Features

- Peer feed, discussions, projects, and course reviews
- Real-time chat (Socket.IO)
- AI assistant (PeerBot) powered by OpenAI
- ML-powered comment moderation (hate/spam detection via Keras models)
- Microsoft Azure AD sign-in (optional; local dev auth available without Azure)

## Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Tailwind CSS, Socket.IO client |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| ML Pipeline | Python, TensorFlow/Keras, NLTK |
| Auth | Azure MSAL (production) / local JWT (development) |

## Local setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI in `server/.env`
- Python 3 with pip (for ML moderation; optional fallback if unavailable)
- OpenAI API key (optional, for PeerBot)

### Seed the database

```bash
cd server
npm run seed
```

### Development (separate ports)

```bash
# Terminal 1 — backend on :8080
cd server
npm install
npm start

# Terminal 2 — frontend on :3000
cd client
npm install
npm start
```

### Production (unified single port)

```bash
cd client
npm install
npm run build

cd ../server
npm install
npm run start:prod
```

Open **http://localhost:8080** — React UI and Express API run together.

## Author

**Rishabh Kabra** — ECE | Full-Stack Web Development & Analytics
