# CLAUDE.md

AI Invoice Template Generator — a chat interface where users describe a Paraguayan invoice template and the AI generates it as live HTML.

## Monorepo structure

```
ai_template_builder/
├── back-end/    # Node 22 + Express + TypeScript + PostgreSQL (see back-end/CLAUDE.md)
├── front-end/   # React + Vite + shadcn/ui + TailwindCSS v4 (see front-end/CLAUDE.md)
├── dev.sh       # starts both services for local development
└── memory/      # project memory files (Claude Code context)
```

## Running locally

```bash
./dev.sh   # starts back-end (port 3000) and front-end (port 3001) concurrently
```

Or start each separately — see `back-end/CLAUDE.md` and `front-end/CLAUDE.md` for their individual commands.

## Key design decisions

- **Paywall**: Non-admin users get exactly 1 free AI prompt. Enforced atomically server-side (`ai_prompts_used` column). Client caches the paywalled state per user in `localStorage`.
- **AI model**: DeepSeek V3 (`deepseek-chat`) and R1 (`deepseek-reasoner`) via OpenAI-compatible SDK. R1 does not support `response_format: json_object`.
- **Token strategy**: 15-min JWT access tokens in React memory + 7-day HttpOnly cookie refresh tokens. Frontend auto-refreshes at 13-min intervals and intercepts 401s.
- **Paraguay focus**: Templates target Paraguay's SIFEN invoice format. Company presets hold RUC, timbrado, and other Paraguay-specific fields.
- **Languages**: Full EN / ES / PT i18n via `LanguageContext` + `translations.ts`. No hard-coded UI strings.

## See also

- `back-end/CLAUDE.md` — backend architecture, modules, env vars, migrations, testing
- `front-end/CLAUDE.md` — frontend architecture, routing, auth, i18n, component structure
- `memory/project_state.md` — detailed feature status and what remains to be built
