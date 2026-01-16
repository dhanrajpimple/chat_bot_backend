# 🩺 Veterinary Chatbot Backend

This is the backend service for the Veterinary Chatbot SDK. It handles conversational logic, appointment booking, and persistent storage using MongoDB.

## 🚀 Features
- **AI-Powered Core**: Integrated with Google Gemini 1.5 Flash for intelligent veterinary Q&A.
- **Contextual Memory**: Tracks session-based conversations using UUIDs.
- **Smart Appointment Booking**: Automated flow to capture pet details and owner contact info.
- **Resilient Persistence**: Connects to MongoDB with an automatic in-memory fallback for local development without a database.
- **Validation**: Strict request validation using `express-validator`.
- **Security**: Hardened with `helmet` and CORS configuration.

## 🛠️ Tech Stack
- **Runtime**: Node.js (Express)
- **Language**: JavaScript (ESM/CommonJS)
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: `@google/generative-ai`

## 📂 Directory Structure
```text
src/
├── app.js            # Main entry point and middleware setup
├── config/           # Database, Gemini, and environment constants
├── controllers/      # Request handlers (Chat, Bookings, Health)
├── models/           # Mongoose schemas (Appointment, Message, Conversation)
├── routes/           # API endpoint definitions
└── services/         # Business logic (AI orchestration, DB persistence)
```

## ⚙️ Setup & Installation

### 1. Environment Variables
Create a `.env` file in the root of the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
```bash
npm start
```
By default, the server runs on `http://localhost:5000`.

## 📡 API Endpoints

### Chat
- `POST /api/chat/message`: Send a message to the bot.
- `GET /api/chat/history/:sessionId`: Retrieve history for a specific session.

### Appointments
- `POST /api/appointments`: Create a new appointment record.

### System
- `GET /api/health`: Check if the backend is alive.

## 🐳 Docker Support
Build and run via Docker:
```bash
docker build -t chatbot-backend .
docker run -p 5000:5000 --env-file .env chatbot-backend
```

## 📄 License
ISC
