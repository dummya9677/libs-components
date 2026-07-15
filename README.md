# Enterprise Chat UI

Production-ready React frontend scaffold for an enterprise AI chatbot. Integrates with a FastAPI backend (not included). The frontend owns UI, routing, Redux, authentication flow, and API stubs only.

## Stack

- React 18 + TypeScript (strict)
- Vite 5
- Redux Toolkit + RTK Query
- React Router DOM
- react-oidc-context + oidc-client-ts
- Vitest + ESLint 9

## Quick start (demo auth — no SSO)

```bash
npm install
cp .env.example .env   # VITE_MOCK_AUTH=true by default
npm run dev
```

1. Open `http://localhost:5173` — you are redirected to `/login`
2. Click **Sign in as demo user**
3. Use the app; click the **logout** icon (top-right) to sign out

No backend or SSO is required in demo mode.

## How protected routes work

All app pages sit behind `ProtectedRoute` in `src/routes/index.tsx`:

```tsx
<ProtectedRoute>
  <AppShell />
</ProtectedRoute>
```

- **Not signed in** → redirect to `/login`
- **Signed in** → show sidebar, agents, and chat
- Auth state lives in Redux (`src/redux/slice/authSlice.ts`)
- Login/logout logic is in `src/hooks/useAuth.ts`

## Switching to real SSO (office VDI)

**No code changes** — only edit `.env`:

| Variable | Purpose |
| --- | --- |
| `VITE_MOCK_AUTH=false` | Turn off demo login |
| `VITE_API_BASE_URL` | Your backend API (e.g. `https://api.your-company.com/api`) |
| `VITE_OIDC_AUTHORITY` | SSO issuer URL (Entra tenant URL, Okta domain, etc.) |
| `VITE_OIDC_CLIENT_ID` | App registration client ID from your IdP |
| `VITE_OIDC_REDIRECT_URI` | Must match IdP config (usually `…/auth/callback`) |

Optional: set `VITE_OIDC_PROVIDER` to `entra`, `okta`, `keycloak`, or `auth0` and fill the matching provider block in `.env.example`.

### Auth flow with real SSO

1. User clicks **Sign in with SSO** → OIDC redirect to your IdP
2. Callback at `/auth/callback` → `POST /auth/session` on your backend
3. Backend sets an **HttpOnly Secure** cookie
4. App calls `GET /auth/me` on load to restore the session
5. Logout calls `POST /auth/logout` and clears Redux state

Key files (you typically do not edit these):

| File | Role |
| --- | --- |
| `src/hooks/useAuth.ts` | login, logout, session bootstrap |
| `src/context/AuthProvider.tsx` | OIDC wrapper (skipped in demo mode) |
| `src/utils/oidcConfig.ts` | Reads OIDC settings from env |
| `src/utils/env.ts` | All env variables |
| `src/services/api/authApi.ts` | `/auth/me`, `/auth/logout`, `/auth/session` |
| `src/components/ProtectedRoute/index.tsx` | Blocks unauthenticated access |

## Authenticated UI

After login, the app uses a three-column Tailwind layout:

- Collapsible left sidebar (nav + AI agents)
- Center agent workspace (theme changes per agent)
- Right AI Assistant chat panel

Agents: Ticket Analyzer, Impact Analyzer, Data Issue Analyzer, Knowledge Assistant.

Colors live in `src/config/colors.ts` and are exposed to Tailwind via CSS variables in `src/index.css`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (watch) |
| `npm run test:run` | Vitest (CI) |

## API stubs (RTK Query)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/auth/me` | Session check |
| POST | `/auth/logout` | End session |
| POST | `/auth/session` | Establish session after OIDC |
| GET | `/history` | Conversation list |
| POST | `/chat` | Send message |
| GET | `/agents` | Agent list |

All requests use `credentials: 'include'`.

## Path alias

`@` → `src/`

## Publishing safely (public GitHub)

Before pushing to a public repository:

1. **Never commit `.env`** — it is gitignored. Copy from `.env.example` locally.
2. **Do not commit** `node_modules/`, `dist/`, or any `.pem` / `.key` files.
3. **Use placeholders only** in `.env.example`.
4. On your VDI, create a fresh `.env` with real SSO and API values.

Safe to publish: all source under `src/`, config files, and `.env.example`.
