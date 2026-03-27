# Demand Evidence

## Selected problem
- Candidate: `Supabase SSR auth without middleware starter`
- Lane: `web/full-stack`
- Primary source: `https://github.com/supabase/supabase/issues/30241`

## Why this demand was real enough
- The blocked outcome was concrete: page loads stall when SSR auth refresh sits in middleware.
- The signal repeated across nearby Supabase SSR threads: `supabase/supabase#34842` and `#38023`.
- The problem matched a small, demoable starter better than the other shortlisted web candidates.

## Source excerpt carried into implementation
The backlog entry defined the repo story as a Next.js + Supabase auth starter that refreshes tokens off the request path, then proves sign-in, protected-page access, and continued validity without middleware stalls.
