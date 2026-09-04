# Panello

Marketing website for Panello, a Kazakhstan manufacturer of facade thermal panels, with a bilingual quote request flow.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/panello-site/` — the public React/Vite landing page.
- `artifacts/api-server/src/routes/leads.ts` — quote request endpoint.
- `lib/api-spec/openapi.yaml` — source of truth for the API contract.
- `lib/db/src/schema/leads.ts` — persisted quote request schema.

## Architecture decisions

- Quote requests are persisted in PostgreSQL so the success state represents a real server-side submission.
- The marketing page uses the generated API client rather than hand-written fetch calls.
- RU/KZ copy switching stays client-side because the page has one public route and no account-specific content.

## Product

- Visitors can browse the Panello facade-panel story, materials, process, and project proof.
- Visitors can switch between Russian and Kazakh copy.
- Visitors can submit their name, phone, and facade area for a quote.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
