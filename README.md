# AI Invoice Template Generator

A full-stack web application for generating and customizing Paraguayan invoice templates (facturas) using AI. Users describe what they want in a chat interface and the AI produces ready-to-print HTML invoice templates compliant with Paraguay's SIFEN/SET requirements.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4, shadcn/ui, React Query |
| Backend | Node.js 22, TypeScript (ESM), Express 5 |
| Database | PostgreSQL 17 |
| AI | DeepSeek API (`deepseek-chat` / `deepseek-reasoner`) |
| Auth | JWT access tokens (in-memory) + refresh tokens (HttpOnly cookie, single-use rotation) |
| Tests | Vitest + supertest (backend integration tests against a real DB) |
| CI | GitHub Actions |

## Project structure

```
├── back-end/       Express API
│   ├── src/
│   │   ├── auth/           Register, login, refresh, logout
│   │   ├── presets/        User company presets (RUC, timbrado, etc.)
│   │   ├── templates/      Saved invoice templates
│   │   ├── conversations/  AI chat history
│   │   ├── ai/             DeepSeek integration
│   │   └── db/             pg pool, migrations
│   └── src/tests/          Integration test suite
└── front-end/      React SPA
    └── src/
        ├── routes/         Home (chat), Login, Templates
        ├── components/     Shared UI components
        └── context/        Auth context
```

## Local development

### Prerequisites

- Node.js 22+
- pnpm 11+
- Docker (for Postgres)

### Setup

```bash
# 1. Copy and fill in env vars
cp back-end/.env.example back-end/.env

# 2. Start Postgres, run migrations, and launch both servers
./dev.sh
```

`dev.sh` starts a Postgres container via Docker Compose, waits for it to be healthy, then opens the backend (`localhost:3000`) and frontend (`localhost:3001`) in a tmux session.

### Environment variables

All required variables are documented in `back-end/.env.example`. The key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens (generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens (generate separately) |
| `DEEPSEEK_API_KEY` | API key from [platform.deepseek.com](https://platform.deepseek.com) |
| `CORS_ORIGIN` | Frontend origin (default: `http://localhost:3001`) |

The frontend reads `VITE_API_BASE_URL` from a `.env` file in `front-end/`.

## Running tests

The test suite hits a real Postgres instance. Spin one up and pass its URL:

```bash
# Start a throwaway test DB
docker run -d --name test_db \
  -e POSTGRES_DB=test_db -e POSTGRES_USER=test_user -e POSTGRES_PASSWORD=test_password \
  -p 5433:5432 postgres:17-alpine

# Run tests
cd back-end
DATABASE_URL=postgresql://test_user:test_password@localhost:5433/test_db pnpm test

# Tear down
docker stop test_db && docker rm test_db
```

## Deployment

Docker Compose files are provided for QA and production:

```bash
# QA (ports exposed, no auto-restart)
cd back-end
pnpm docker:qa:up

# Production (DB port hidden, restart: always, 512 MB memory limit)
pnpm docker:prod:up
```

Both environments require a populated `.env.qa` / `.env.prod` file alongside the compose files.
