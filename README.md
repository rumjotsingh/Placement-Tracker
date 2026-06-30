# Placement-Tracker

PlaceTrack Pro – Placement Preparation & Campus Recruitment Management Platform.

## Stack

- **Backend:** Node.js, Express, MongoDB, JWT
- **Frontend:** React, TypeScript, Tailwind CSS, TanStack Query

## Run locally

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

- API: http://localhost:8080
- App: http://localhost:5173

## Seed users

```bash
cd backend && node src/scripts/seedUsers.js
```

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@placetrack.edu | admin123 |
| Coordinator | coordinator@placetrack.edu | coord123 |

Copy `backend/.env.example` to `backend/.env` and set your MongoDB URI and secrets before running.
