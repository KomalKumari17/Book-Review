# Book-Review

A full-stack Book Review application with a FastAPI backend and a Next.js frontend.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn
- Redis (for caching)

---

## Backend (FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **(Optional) Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Start Redis server** (if not already running):
   ```bash
   redis-server
   ```
5. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   - Swagger docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

---

## Frontend (Next.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

---

## Environment Variables

- **Backend:**
  - To use a custom Redis URL, set the `REDIS_URL` environment variable (default: `redis://localhost:6379/0`).
- **Frontend:**
  - If you need to configure the API URL, set it in your frontend's API utility (see `frontend/lib/api.ts`).

---

## Project Structure

- `backend/` - FastAPI app, database, and API logic
- `frontend/` - Next.js app (React + Tailwind CSS)

---

## License

MIT