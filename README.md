# Ritmo de Estudos — Study Tracker

A mobile-first full-stack application (PWA/iOS ready) designed to track multiple study goals in parallel — technical books, certifications, online courses, and work documentation — complete with time goals, progress tracking, study pacing, and target completion ETA forecasting.

---

## Tech Stack

- **Backend:** NestJS 11, TypeORM, PostgreSQL 18, `class-validator`
- **Frontend:** React 19, Vite, TypeScript, Vanilla CSS Design System
- **Database:** PostgreSQL 18 with UUID v7 primary keys for time-orderable IDs
- **Tooling:** TypeScript, npm workspaces, Docker Compose, ESLint, Prettier

---

## Project Structure

```
study-tracker/
├── apps/
│   ├── backend/             # NestJS REST API application
│   │   ├── src/
│   │   │   ├── study-items/  # Study Items module, entities, controllers & services
│   │   │   ├── progress-logs/# Progress log tracking module & entities
│   │   │   ├── database/     # TypeORM config, migrations, and seed scripts
│   │   │   └── health/       # Health check controller
│   └── frontend/            # React + Vite web application
│       ├── src/
│       │   ├── components/   # UI components (StudyCard, ProgressSheet, Charts)
│       │   ├── views/        # Main views (Dashboard, Detail, Create/Edit, Settings)
│       │   ├── services/     # API client for backend communication
│       │   └── utils/        # ETA calculation logic & formatters
├── docs/                    # Specification & UI design guide
└── docker-compose.yml       # Docker environment for PostgreSQL & backend
```

---

## Quickstart

### Prerequisites
- Node.js 20+
- PostgreSQL running locally (via [Postgres.app](https://postgresapp.com/) or Docker)

### Setup & Launch

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

3. **Start PostgreSQL Container (Optional if using Docker):**
   ```bash
   docker compose up -d postgres
   ```

4. **Initialize Database, Run Migrations & Seed Data:**
   ```bash
   npm run --workspace @study-tracker/backend db:setup
   ```

5. **Start Development Servers (Backend + Frontend):**
   ```bash
   npm run dev
   ```

Default Access URLs:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **API Health Check:** [http://localhost:3000/health/ready](http://localhost:3000/health/ready)

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/study-items` | Fetch all study items with historical progress logs |
| `GET` | `/study-items/:id` | Fetch single study item details with logs |
| `POST` | `/study-items` | Create a new study item |
| `PUT` | `/study-items/:id` | Update study item details |
| `DELETE` | `/study-items/:id` | Archive / delete a study item |
| `POST` | `/study-items/:id/logs` | Record a progress log (updates current progress & status) |
| `PATCH` | `/study-items/:id/toggle-pause` | Toggle item status between `active` and `paused` |

---

## Database Management Commands

```bash
# Run database setup (Create database if missing, run migrations, run seed data)
npm run --workspace @study-tracker/backend db:setup

# Ensure database exists
npm run --workspace @study-tracker/backend db:ensure

# Run pending migrations
npm run --workspace @study-tracker/backend migration:run

# Revert last migration
npm run --workspace @study-tracker/backend migration:revert

# Run seed scripts
npm run --workspace @study-tracker/backend db:seed
```

---

## Development Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start both NestJS backend and Vite frontend concurrently |
| `npm run dev:backend` | Start backend dev server with watch mode |
| `npm run dev:frontend` | Start frontend Vite dev server |
| `npm run build` | Build all workspaces (frontend & backend) for production |
| `npm run lint` | Run ESLint across all workspaces |
| `npm run test` | Run backend Jest test suite |
| `npm run docker:up` | Build and launch full environment using Docker Compose |
| `npm run docker:down` | Stop Docker Compose services |
