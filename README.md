# SkillSwap

A creator gig marketplace for the **Creator Economy** track.

## Live Demo

- Frontend: https://skillswap-team24.vercel.app/
- API: https://skillswap-api-3k6e.onrender.com/ (health check: `/api/health`)

**Hackathon ID:** `AZIS-NEA3TC`

## Required Features

- Post a Gig
- Browse & Search
- Book a Gig
- Creator Dashboard
- My Bookings

## Authentication

No authentication (login/signup) is implemented. Graders can access every feature directly without creating an account.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React + Vite |
| UI | Bootstrap 5 + custom CSS |
| Backend | Node.js + Express |
| Database | MongoDB / Mongoose |
| HTTP client | Axios |

## Standard API

This project exposes a REST API for the marketplace workflow. The final Standard API declaration should be set according to the exact hackathon track specification if the track provides a separate required API contract.

### API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/gigs` | List all gigs |
| GET | `/api/gigs/:id` | Get a single gig |
| POST | `/api/gigs` | Create a gig |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings?email=client@example.com` | List bookings for a client email |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id/status` | Update a booking's status |

## Run Locally

Clone the repository first:

```bash
git clone https://github.com/uditanshusiingh/SkillSwap.git
cd SkillSwap
```

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

### Environment Variables

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

## Deployment

- **Frontend (Vercel):** set `VITE_API_URL` to the deployed API base URL, e.g. `https://skillswap-api-3k6e.onrender.com/api`.
- **Backend (Render):** set `MONGO_URI` and `PORT`, and set `CLIENT_URL` to the deployed frontend URL (`https://skillswap-team24.vercel.app`) so CORS allows requests from it.

## Demo Access

No credentials are required. Use the navigation to test all five required features.

## Submission Checklist

- Public deployed URL: https://skillswap-team24.vercel.app/
- Public GitHub repository
- Hackathon ID in root README
- No authentication
- Confirm Standard API status against the track specification
