# SkillSwap

A creator gig marketplace for the **Creator Economy** track.

## Live Demo

- Frontend: https://skillswap-team24.vercel.app/
- API: https://skillswap-api-3k6e.onrender.com/ (health check: `/api/health`)

> The API runs on Render's free tier, so the first request after a period of inactivity can take up to ~60 seconds while the server wakes up. The app shows a "server is waking up" message during this time.

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

## API Endpoints

The backend exposes a REST API for the marketplace workflow.

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
SEED_ON_START=false
```

Set `SEED_ON_START=true` to add a few sample gigs on startup when the database has none. You can also run `npm run seed` in `server/` (add `-- --force` to insert them even if gigs already exist).

Client `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

- **Frontend (Vercel):** set `VITE_API_URL` to the deployed API base URL, e.g. `https://skillswap-api-3k6e.onrender.com/api`.
- **Backend (Render):** set `MONGO_URI` and `PORT`, and set `CLIENT_URL` to the deployed frontend URL (`https://skillswap-team24.vercel.app`, no trailing slash needed). CORS only allows requests from the origin(s) listed there; use a comma-separated list for more than one. If `CLIENT_URL` is not set, all origins are allowed (local development only). Set `SEED_ON_START=true` once so the marketplace is not empty for first-time visitors (sample gigs are only added while the database has no gigs).

## Demo Access

No credentials are required. Use the navigation to test all five required features.

The Creator Dashboard shows every booking request by default. Because there is no login, creators can type their name in the optional "Filter by creator name" box to see only the bookings for their own gigs.

## Submission Checklist

- Public deployed URL: https://skillswap-team24.vercel.app/
- Public GitHub repository
- Hackathon ID in root README
- No authentication
