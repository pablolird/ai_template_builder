# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # start with hot-reload (reads .env)
pnpm build          # compile TypeScript → dist/
pnpm type-check     # tsc --noEmit, no emit
pnpm lint           # eslint
pnpm lint:fix       # eslint --fix
pnpm format         # prettier --write
pnpm format:check   # prettier --check

# Docker
pnpm docker:qa:up      # build + start QA stack (foreground)
pnpm docker:qa:down
pnpm docker:qa:logs
pnpm docker:prod:up    # build + start prod stack (detached)
pnpm docker:prod:down
pnpm docker:prod:logs
```

## Architecture

**Runtime:** Node 22, TypeScript (ESM, `moduleResolution: nodenext`). All relative imports must use `.js` extensions even in `.ts` source files. Top-level `await` is used in `src/index.ts`.

**Entry point:** `src/index.ts` — registers CORS, JSON body parser, mounts routers, runs migrations at startup, then starts listening.

**Layer convention inside `src/auth/`:**
- `auth.router.ts` — mounts routes, no logic
- `auth.controller.ts` — parses/validates request with Zod, calls service, maps errors to HTTP status codes
- `auth.service.ts` — all business logic and DB queries
- `auth.middleware.ts` — `authenticate` middleware; verifies access token, sets `req.user`
- `auth.types.ts` — shared interfaces (`User`, `JwtAccessPayload`, `JwtRefreshPayload`, `TokenPair`)

Follow the same router/controller/service split when adding new feature modules.

**Database:** `pg.Pool` singleton in `src/db/db.ts`, connected via `DATABASE_URL`. Migrations run automatically at startup via `src/db/migrate.ts`, which applies `.sql` files from `src/db/migrations/` in filename order and tracks them in a `schema_migrations` table. New migrations go in that folder as `NNN_description.sql`.

**Auth flow:**
- Access tokens (15 min, `JWT_ACCESS_SECRET`) — sent as `Authorization: Bearer <token>`
- Refresh tokens (7 days, `JWT_REFRESH_SECRET`) — stored in the DB by `jti` UUID; rotated on every use so each refresh token is single-use
- `req.user` is typed via `src/types/express.d.ts` (`{ id, username, email }`)

**Docker:** Multi-stage `Dockerfile` (builder → runner). SQL migration files are not emitted by `tsc`, so the Dockerfile manually copies `src/db/migrations/` into `dist/db/migrations/`. pnpm is installed via `npm install -g pnpm` (not corepack) to avoid semver range rejection. Three compose files: `docker-compose.yml` (base), `.qa.yml` (exposes ports, no restart), `.prod.yml` (restart: always, DB port hidden).

## Required env vars

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Signs access tokens |
| `JWT_REFRESH_SECRET` | Signs refresh tokens |
| `CORS_ORIGIN` | Allowed frontend origin (default: `http://localhost:3001`) |
| `PORT` | Server port (default: `3000`) |

Copy `.env.example` → `.env` for local dev. Docker environments use `.env.qa` / `.env.prod`.
