# AGENTS.md — Dentist System

## Commands

```
npm run dev      # dev server (port 3000)
npm run build    # production build
npm run lint     # eslint (no typecheck script — use `npx tsc --noEmit`)
```

After changing `prisma/schema.prisma`:
```
npx prisma generate   # regenerates client into generated/prisma/
npx prisma db push    # sync schema to local MongoDB (no migrations yet)
```

## Architecture

- **Next.js 16** App Router + TypeScript + React 19
- **Prisma 6** with **MongoDB** (not SQL). Client output: `generated/prisma/` (import from `@/generated/prisma`, not `@prisma/client`)
- **Tailwind CSS v4** — uses `@import "tailwindcss"` and `@theme inline`, not `tailwind.config.js`
- **shadcn/ui** (new-york style) — components in `components/ui/`, add via `npx shadcn@latest add <component>`
- **Redux Toolkit** — single auth reducer in `store/reducers/auth.ts`, wrapped in `app/layout.tsx`
- **Auth** — cookie-based (userId, username, email, role). Server actions in `lib/actions/auth-action.ts`
- **Cloudinary** — image uploads for radiology
- **Middleware** (`proxy.ts`) — currently disabled (all code commented out)

## Directory boundaries

```
app/                  — Next.js App Router routes
  (auth)/             — login, register (route group, no URL segment)
  (dashboard)/        — admin/, assistant/, patient/, user/ (role-based dashboards)
  api/admin/          — API routes
components/           — React components
  ui/                 — shadcn/ui primitives
  appointments/       — appointment-related UI
  patient/            — patient-related UI
  tooth-chart/        — dental tooth chart component
  visit/              — visit-related UI
lib/
  actions/            — server actions (auth, patients, visits, invoices, admin, users)
  db/db-connection.ts — singleton Prisma client
  utils.ts            — cn() helper (clsx + tailwind-merge)
generated/prisma/     — auto-generated Prisma client (DO NOT EDIT)
pages/                — legacy pages directory (AssistantForm, DrAssistantForm) — avoid adding here
store/                — Redux store + auth reducer
hooks/                — custom hooks (useSelector)
type/                 — TypeScript type definitions
```

## Key gotchas

- **MongoDB, not PostgreSQL** — no relational joins, use `$lookup` or separate queries. Prisma relations work but translate differently.
- **Prisma client path** — imports come from `@/generated/prisma`, not `@prisma/client`. Always run `npx prisma generate` after schema changes.
- **Tailwind v4** — configuration is in `app/globals.css` via `@theme inline`, not a JS config file.
- **No test framework** — no Jest, Vitest, Playwright, or Cypress configured.
- **No CI** — no GitHub Actions or other pipelines.
- **Mixed routing** — `app/` is primary; `pages/` contains legacy components. Prefer `app/` for new routes.
- **`.env` has real secrets** — the repo's `.env` file contains live Cloudinary credentials and a GitHub token. Do not commit changes to it.

## Domain models (Prisma)

`User` (admin/dentist/assistant/receptionist/patient) → `Patient` → `Visit` → `Invoice`
`Appointment` links Patient + Doctor(User), optionally to a Visit
`Task`, `RadiologyImage`, `ActivityLog` all belong to a User or Patient


  