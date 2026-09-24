# SkillSwap

A creator gig marketplace for the Creator Economy track.

## Hackathon ID

**AZIS-NEA3TC**

## Required Features

- Post a Gig
- Browse & Search
- Book a Gig
- Creator Dashboard
- My Bookings

## Authentication

No authentication (login/signup) is implemented. Graders can access every feature directly without creating an account.

## Tech Stack

- Frontend: React + Vite
- UI: Bootstrap 5 + custom CSS
- Backend: Node.js + Express
- Database: MongoDB / Mongoose
- HTTP client: Axios

## Standard API

This project exposes a REST API for the marketplace workflow. The final Standard API declaration should be set according to the exact hackathon track specification if the track provides a separate required API contract.

## API Endpoints

- `GET /api/health`
- `GET /api/gigs`
- `GET /api/gigs/:id`
- `POST /api/gigs`
- `GET /api/bookings`
- `GET /api/bookings?email=client@example.com`
- `POST /api/bookings`
- `PATCH /api/bookings/:id/status`

## Run Locally

### Backend

```bash
cd server
npm install
cp .env.example .env
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Environment variables

Server `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/skillswap
PORT=5000
CLIENT_URL=http://localhost:5173
```

Client `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Access

No credentials are required. Use the navigation to test all five required features.

## Submission checklist

- [ ] Public deployed URL
- [ ] Public GitHub repository
- [x] Hackathon ID in root README
- [x] No authentication
- [ ] Confirm Standard API status against the track specification
