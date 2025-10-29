# SQL Runner App - AI Agent Instructions

## Architecture Overview
This is a full-stack web application for executing SQL queries against SQLite databases:
- Frontend: Next.js application (`frontend/`) handling query input and result display
- Backend: Flask API (`backend/`) managing database connections and query execution
- Communication: REST API with JSON payloads between frontend and backend

## Key Components

### Backend (`backend/`)
- Entry point: `app.py` - Flask application with `/execute` endpoint
- Database: SQLite connection management in `get_db_connection()`
- Query handling:
  - SELECT queries return JSON results
  - Other queries (INSERT/UPDATE/DELETE) return success message
  - Error handling returns 400 status with error details

### Frontend (`frontend/`)
- Main component: `src/components/QueryRunner.tsx` - React component for query execution
- API integration: `src/pages/api/query.ts` - Next.js API route forwarding requests to backend
- State management: Uses React's useState for query input and results

## Development Workflow

### Setup
1. Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py  # Runs on http://localhost:5000
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### API Conventions
- Endpoint: POST `/execute`
- Request format: `{ "query": "SELECT * FROM table" }`
- Response format:
  - SELECT: `[{ "column": "value", ... }]`
  - Others: `{ "message": "Query executed successfully" }`
  - Errors: `{ "error": "Error message" }`

## Common Patterns
1. Error Handling:
   - Backend uses try-catch with specific SQLite error handling
   - Frontend displays errors in UI with setError state
2. Database Access:
   - Always use `get_db_connection()` for SQLite connections
   - Connections are automatically closed in finally block

## Integration Points
1. Frontend-Backend Communication:
   - Frontend sends POST requests to `/api/query`
   - Backend expects JSON with `query` field
2. Database:
   - Located at `backend/database/database.db`
   - Uses SQLite3 with Row factory for dictionary-like results