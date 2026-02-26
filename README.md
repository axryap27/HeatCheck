# HeatCheck 🏀

Real-time crowdsourced basketball court finder. Players ping their location to mark courts as active, creating live heat maps that show where games are happening right now.

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Browser (Next.js)                      │
│                                                                │
│  ┌──────────────┐   TanStack Query   ┌──────────────────────┐  │
│  │  react-map-gl │  (REST polling)   │  CourtChat / Crew UI │  │
│  │  HeatMap      │◄──────────────────│  Zustand store       │  │
│  │  CourtMarker  │                   │  socket.io-client    │  │
│  └──────┬────────┘                   └──────────┬───────────┘  │
│         │  click                                │ WebSocket    │
└─────────┼───────────────────────────────────────┼──────────────┘
          │ HTTP                                  │ WS
          ▼                                       ▼
┌───────────────────────────────────────────────────────────────┐
│                  FastAPI + python-socketio                    │
│                                                               │
│  GET /api/courts          POST /api/ping                      │
│  GET /api/courts/:id      GET /api/courts/:id/chat            │
│                                                               │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  courts.py │  │   ping.py    │  │      events.py       │   │
│  │  (router)  │  │   (router)   │  │  (socket handlers)   │   │
│  └─────┬──────┘  └──────┬───────┘  └──────────┬───────────┘   │
│        │                │                      │              │
│        ▼                ▼                      ▼              │
│  ┌─────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  db.py  │  │ heat.py          │  │  chat_service.py     │  │
│  │asyncpg  │  │ proximity.py     │  │  privacy.py          │  │
│  │  pool   │  │ (services)       │  │  (services)          │  │
│  └────┬────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────┼────────────────┼────────────────────────┼─────────────┘
        │                │                        │
        ▼                ▼                        ▼
┌───────────────┐ ┌──────────────────────────────────────────────┐
│  PostgreSQL   │ │                   Redis                      │
│  + PostGIS    │ │                                              │
│               │ │  pings:{court_id}  → sorted set (UNIX ts)    │
│  courts table │ │  chat:{court_id}:messages → list             │
│  (locations,  │ │  sid:{sid}         → session_id              │
│   metadata)   │ │  rooms:{sid}       → set of court_ids        │
└───────────────┘ └──────────────────────────────────────────────┘
```

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Docker setup)
- **Or** for manual setup:
  - Python 3.12+
  - Node.js 20+
  - PostgreSQL 15 with PostGIS 3.3 extension
  - Redis 7+
- A [Mapbox](https://account.mapbox.com/) access token

## Quickstart with Docker

```bash
# 1. Clone and enter the repo
git clone https://github.com/axryap27/HeatCheck.git
cd HeatCheck
# 2. Copy the environment file and fill in your Mapbox token
cp .env.example .env
# Edit .env and set NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
# 3. Start all services
docker-compose up --build
# 4. (First run only) Seed the database with NYC courts
docker-compose exec server python ../scripts/seed.py
```

Services:
| Service | URL |
|---|---|
| Next.js client | http://localhost:3000 |
| FastAPI server | http://localhost:8000 |
| API docs (Swagger) | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |