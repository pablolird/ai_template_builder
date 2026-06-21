# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # tsc -b && vite build
pnpm lint         # eslint
pnpm tsc --noEmit # type-check only (no test suite exists yet)
```

Add shadcn components with:
```bash
pnpm dlx shadcn@latest add <component>
```

## Architecture

**Entry point:** `src/main.tsx` — mounts the provider tree and declares all routes.

**Provider order (outermost → innermost):**
`ThemeProvider` (next-themes) → `BrowserRouter` → `QueryClientProvider` → `AuthProvider` → routes

### Authentication (`src/context/AuthContext.tsx`)

- Access token is stored in **React state (in-memory only)** — never localStorage.
- Refresh token is sent via **HttpOnly cookie** automatically by the browser.
- On mount, `AuthContext` fires a React Query `useQuery` to `POST /refresh_token` to restore the session.
- Login, register, and logout are React Query **mutations** that update the query cache key `["session"]` on success.
- `getAccessToken()` is exposed for use in authenticated fetch calls.
- 401 handling for subsequent API calls should intercept and call `POST /refresh_token` before retrying — this logic lives in each fetch call for now.
- `VITE_API_BASE_URL` env var must be set; all endpoints are `${API_URL}/<path>`.

### Routing (`src/routes/`)

- `ProtectedRoute.tsx` — shows a spinner while `authLoading` is true, then renders `<Outlet />`. The redirect-to-login guard is currently **commented out** (disabled for development).
- `Login.tsx` — public route with shadcn `Tabs` for login and register forms. Uses `react-hook-form` + `zod` v4 for validation. Note: use `z.email()` top-level (not `z.string().email()`, which is deprecated in zod v4).
- `Home.tsx` — protected route. Contains the full page layout: `SidebarProvider` wrapping a shadcn `Sidebar` on the left and the chat panel on the right.

### Home page layout (`src/routes/Home.tsx`)

Three vertical sections inside a `flex flex-col h-screen` container:
1. **Header bar** — sidebar trigger, title, `ModeToggle`
2. **Messages area** — `div` with `flex-1 min-h-0 overflow-y-auto` (plain div, not shadcn `ScrollArea`, which doesn't handle flex height correctly)
3. **Input area** — a single rounded border container: `Textarea` on top, a bottom toolbar row with model `Select`, preset `Select`, and send `Button`

### Theming

`ThemeProvider` from `next-themes` applies a `dark` / `light` class to `<html>`. The `ModeToggle` component (`src/components/ModeToggle.tsx`) exposes a dropdown with Light / Dark / System options. CSS variables are defined in `src/index.css` using the shadcn zinc palette with oklch colors.

### Shadcn setup

- Style: `radix-vega`, icon library: `lucide`
- Config: `components.json` at root
- All shadcn components go in `src/components/ui/`
- Custom (non-shadcn) components go in `src/components/`
- TailwindCSS v4 (plugin-based, no `tailwind.config.js`); config lives entirely in `src/index.css`

### Path aliases

`@/` maps to `src/`. Configured in both `vite.config.ts` (resolve.alias) and `tsconfig.app.json` (paths). Both configs include `"ignoreDeprecations": "6.0"` to suppress the TS6 `baseUrl` deprecation warning.
