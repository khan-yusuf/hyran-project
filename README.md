# Hyran Project

Full-stack application with React + TypeScript frontend and FastAPI backend.

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- TanStack Query (React Query) for data fetching
- Native Fetch API

**Backend:**
- Python 3.x
- FastAPI
- Uvicorn (ASGI server)
- Pydantic for data validation

## Project Structure

```
hyran-project/
├── backend/
│   ├── src/
│   │   └── app.py              # FastAPI application
│   └── requirements.txt        # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.ts       # API client with fetch
    │   ├── types/
    │   │   └── index.ts        # TypeScript types
    │   ├── App.tsx             # Main component
    │   └── main.tsx            # Entry point
    └── vite.config.ts          # Vite config with proxy
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip3 install -r requirements.txt
```

4. Run the server:
```bash
uvicorn src.app:app --reload --port 8000
```

Backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the dev server:
```bash
npm run dev
```

Frontend will be available at http://localhost:5173

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item

## Development Workflow

1. Start backend server (port 8000)
2. Start frontend dev server (port 5173)
3. Frontend proxies `/api/*` requests to backend automatically
4. Both support hot reload - changes reflect immediately

## Features Demonstrated

- Full-stack TypeScript/Python integration
- API proxy configuration (avoiding CORS issues)
- React Query for data fetching and caching
- Type-safe API client with native fetch
- Pydantic models for backend validation
- In-memory data store (easily replaceable with database)

## Next Steps

Consider adding:
- Database integration (PostgreSQL, SQLite, etc.)
- Authentication and authorization
- State management (if complexity grows)
- Error boundaries and better error handling
- Loading states and skeletons
- Form handling and validation
- Testing (pytest for backend, Vitest for frontend)
- Docker setup for easy deployment

## Interview Ready

This setup demonstrates:
- Clean architecture and separation of concerns
- Modern tooling and best practices
- Type safety across the stack
- Efficient development workflow
- Extensible foundation for features
