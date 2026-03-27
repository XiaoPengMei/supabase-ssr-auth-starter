# Release Evidence

## Release command set
The following commands passed in sequence:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Port map
- `npm run dev` serves the starter on `http://127.0.0.1:4173`
- `npm run start -- --port 4174` is the built-server path used by Playwright e2e
- The latest manual browser QA used `npx next dev --hostname 127.0.0.1 --port 4283` because the default dev port was already occupied locally at that moment

## What shipped
- A Next.js App Router starter shape
- One auth happy path only: sign in -> protected page -> background refresh -> protected page still works
- Refresh handled through `POST /api/auth/refresh`, not middleware
- Local stateless token auth seam for reproducible QA without private Supabase credentials

## Known non-blocking warnings at release time
- Next.js reported a workspace-root warning because this workspace contains multiple lockfiles.
- Next.js reported that the dedicated Next ESLint plugin was not configured, but repo lint, typecheck, unit tests, build, and e2e all passed.

## Scope check
- No cross-subdomain auth
- No social providers
- No multi-tenant or admin behavior
- No multi-framework adapters
