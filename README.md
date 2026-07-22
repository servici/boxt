# DramaBox — Short Drama Streaming Web Platform

A full-stack, mobile-first web application for streaming short drama series (DramaBox / ReelShort style vertical 9:16 video player), featuring episode unlocks with a coin wallet system, user and admin JWT authentication, full admin dashboard, PostgreSQL database, and Docker containerization.

---

## Features

- 📱 **9:16 Vertical Video Player**: TikTok / Reels style vertical video container, touch swipe up/down gesture support, keyboard navigation, tap-to-play/pause, live scrubber, and episode selector drawer.
- 🔓 **Episode Unlock & Coin Wallet**: First N episodes free per series, remaining episodes locked with coin requirement. Instant unlock deduction from user's coin wallet.
- 💳 **Coin Store (`/pricing`)**: Tiered coin packages with instant simulated checkout and confetti purchase celebration.
- 👤 **User Profile (`/profile`)**: Manage account credentials, view live coin balance, watch history, and unlocked episodes collection.
- 🛡️ **Admin Control Panel (`/admin`)**:
  - **Overview Stats**: Real-time metrics for users, total revenue, series views, and top watched dramas.
  - **Series Manager (`/admin/series`)**: Full CRUD (create, edit, delete series, upload poster URL, set category & status).
  - **Episode Manager (`/admin/episodes`)**: Full CRUD for episodes (configure video stream URL, free/paid toggle, coin cost, ordering).
- 🔐 **JWT Auth**: Secure HTTP-only cookies and Authorization bearer tokens with bcrypt password hashing and role-based middleware protection (`USER` & `ADMIN`).
- 🐳 **Docker Ready**: Fully containerized with `docker-compose.yml` for PostgreSQL + Next.js App service.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Lucide Icons, Framer Motion, canvas-confetti, HLS.js
- **Backend**: Next.js App Router API Routes (`/api/...`)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Deployment**: Docker, Docker Compose

---

## Quick Start (Local Setup)

### Prerequisites

- Node.js 18+ or 20+
- PostgreSQL database running locally OR Docker Desktop

### 1. Clone & Install Dependencies

```bash
cd DRAMA
npm install
```

### 2. Configure Environment Variables

Create `.env` file (or copy from `.env.example`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/drama_db?schema=public"
JWT_SECRET="super-secret-drama-jwt-key-2026-change-in-production"
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_FREE_EPISODES=3
```

### 3. Run Database Migrations & Seed Sample Data

```bash
# Push Prisma schema to PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed sample series (3 series, 10 episodes each, test user & admin)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts (Seed Data)

| Role | Email | Password | Coin Balance | Description |
|---|---|---|---|---|
| **User** | `user@drama.com` | `user123` | 150 Coins | Standard user with starter coins |
| **Admin** | `admin@drama.com` | `admin123` | 1000 Coins | Full access to `/admin` dashboard |

---

## Docker Setup (One-Command Deployment)

To run the application along with a PostgreSQL container via Docker Compose:

```bash
docker-compose up --build -d
```

Once running:
- Web App: `http://localhost:3000`
- Database: `localhost:5432`

To run database migrations & seed inside Docker:

```bash
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed
```

To stop containers:

```bash
docker-compose down
```

---

## Database Schema Overview

```sql
series (
  id, title, description, coverImage, category, status, viewsCount, createdAt, updatedAt
)

episodes (
  id, seriesId (FK), episodeNumber, title, videoUrl, isFree, coinCost, duration, createdAt, updatedAt
)

users (
  id, email, passwordHash, name, role, coinsBalance, createdAt, updatedAt
)

unlocks (
  id, userId (FK), episodeId (FK), unlockedAt
)

purchases (
  id, userId (FK), amount, coinsAdded, paymentMethod, createdAt
)

watch_history (
  id, userId (FK), episodeId (FK), progress, updatedAt
)
```

---

## API Endpoints Summary

- `POST /api/auth/register` — Register new user (+50 starter bonus coins)
- `POST /api/auth/login` — Login user/admin
- `POST /api/auth/logout` — Logout user
- `GET /api/auth/me` — Fetch current logged-in user profile & wallet
- `GET /api/series` — Get series catalog with search & category filters
- `GET /api/series/:id` — Get series detail & episode list with unlock status
- `GET /api/episodes/:id` — Get episode detail & stream URL (if unlocked or free)
- `POST /api/unlock` — Unlock paid episode with coins
- `POST /api/purchase-coins` — Purchase coins package
- `GET /api/user/history` — Fetch user watch history & unlocked episodes
- `GET /api/admin/stats` — Admin metrics dashboard
- `POST /api/admin/series` — Admin: Add series
- `PUT /api/admin/series/:id` — Admin: Edit series
- `DELETE /api/admin/series/:id` — Admin: Delete series
- `POST /api/admin/episodes` — Admin: Add episode
- `PUT /api/admin/episodes/:id` — Admin: Edit episode
- `DELETE /api/admin/episodes/:id` — Admin: Delete episode
