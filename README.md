<div align="center">

# Facturia

### AI-powered invoice template generator for Paraguay's SIFEN system

*Describe the invoice you want. Get print-ready HTML in seconds.*

[![CI](https://github.com/pablolird/ai_template_builder/actions/workflows/ci.yml/badge.svg)](https://github.com/pablolird/ai_template_builder/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

https://github.com/user-attachments/assets/91763d27-c605-4bfc-83c2-e2651d723fa4

</div>

---

## What is Facturia?

Facturia is a chat-based SaaS tool that turns a plain-language description into a fully structured, print-ready Paraguayan invoice template — no accounting knowledge required.

You describe what you need ("professional invoice for a consulting service, dark header, my logo in the top right"), Facturia generates it, and you can keep refining it through conversation. Every template respects Paraguay's mandatory SIFEN/SET invoice requirements out of the box: Condición de Venta, three-column IVA breakdown (Exentas / Gravado 5% / Gravado 10%), and the correct totals block.

---

## Features

**AI Invoice Generation**
- Natural-language chat interface — describe any template, get live HTML
- Two AI models: **DeepSeek V3** (fast) and **DeepSeek R1 Reasoner** (deeper reasoning)
- Edit mode: follow-up messages apply minimal patches, not full regenerations
- Company logo auto-injected into every template

**Paraguay SIFEN Compliance**
- Mandatory Condición de Venta (Contado / Crédito) field
- Three-column IVA breakdown enforced on every template
- Correct totals block: Exentas, IVA 5%, IVA 10%, Total General
- Company presets with RUC and timbrado validation

**Company Presets**
- Save your razón social, RUC, timbrado, address, and logo once
- Preset is injected automatically into every generation
- Full CRUD — create, edit, delete presets from the sidebar

**Template Library**
- Save, rename, download, and preview any generated template
- Responsive card grid with live scaled previews
- Download as self-contained HTML ready to print or share

**Multi-language UI**
- Full translations in English, Spanish, and Portuguese
- Instant language switch, persisted across sessions

**Polished UX**
- Realistic invoice skeleton animation while AI generates
- Split-pane layout: chat left, live preview right
- Mobile-responsive with Chat / Preview tab switcher
- Light, Dark, and System themes

**Production-ready Auth**
- 15-min access tokens (in-memory, never localStorage) + 7-day HttpOnly cookie refresh tokens
- Single-use refresh token rotation (prevents replay attacks)
- Admin role bypasses paywall; user role gets 1 free generation

---

## Demo

<img width="1512" height="864" alt="image" src="https://github.com/user-attachments/assets/647d4c89-d849-4316-a58a-c026f36db38f" />

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 · Vite 8 · TypeScript · TailwindCSS v4 · shadcn/ui · TanStack Query v5 |
| Backend | Node.js 22 · Express 5 · TypeScript (ESM) |
| Database | PostgreSQL 17 via `pg.Pool` · auto-run SQL migrations |
| AI | DeepSeek API (`deepseek-chat` · `deepseek-reasoner`) via OpenAI-compatible SDK |
| Auth | JWT · bcryptjs · HttpOnly cookie refresh tokens with JTI rotation |
| Validation | Zod v4 (frontend + backend) · react-hook-form |
| Testing | Vitest · supertest · 43 integration tests against a real DB |
| CI/CD | GitHub Actions · Docker multi-stage builds · 3 Compose environments |

---

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 11+
- Docker (for Postgres)
- A [DeepSeek API key](https://platform.deepseek.com)

### Setup

```bash
# 1. Clone
git clone https://github.com/pablolird/ai_template_builder.git
cd ai_template_builder

# 2. Copy and fill in environment variables
cp back-end/.env.example back-end/.env
# Edit back-end/.env — set DATABASE_URL, JWT secrets, and DEEPSEEK_API_KEY

# 3. Start everything
./dev.sh
```

`dev.sh` spins up a Postgres container, waits for it to be healthy, then starts the backend on `:3000` and the frontend on `:3001`.

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for 15-min access tokens |
| `JWT_REFRESH_SECRET` | Secret for 7-day refresh tokens |
| `DEEPSEEK_API_KEY` | From [platform.deepseek.com](https://platform.deepseek.com) |
| `CORS_ORIGIN` | Frontend origin (default: `http://localhost:3001`) |
| `VITE_API_BASE_URL` | Backend URL for the frontend (set in `front-end/.env`) |

Generate JWT secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Project structure

```
ai_template_builder/
├── back-end/
│   └── src/
│       ├── auth/           Register, login, refresh, logout
│       ├── presets/        Company presets (RUC, timbrado, logo)
│       ├── templates/      Saved invoice templates
│       ├── conversations/  AI chat history + messages
│       ├── ai/             DeepSeek integration + system prompt
│       ├── users/          Profile, password change, account deletion
│       └── db/             pg pool + SQL migrations (auto-applied on startup)
└── front-end/
    └── src/
        ├── routes/         Home (chat), Login, Templates, Profile, Settings
        ├── components/     BrandName, PresetSheet, TemplateGenerating, ChatMessage…
        ├── context/        AuthContext, LanguageContext
        └── lib/            api.ts (authenticated fetch), translations.ts
```

---

## Running tests

The backend test suite hits a real Postgres instance. 43 integration tests cover auth, presets, templates, conversations, and AI (DeepSeek mocked).

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

---

## Deployment

Docker Compose files are included for QA and production environments:

```bash
cd back-end

# QA — ports exposed, no restart policy
pnpm docker:qa:up

# Production — DB port hidden, restart: always
pnpm docker:prod:up
```

Populate `back-end/.env.qa` or `back-end/.env.prod` before running.

---

## License

[MIT](LICENSE) © 2026 Pablo Lird
