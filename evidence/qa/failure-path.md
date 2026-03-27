# Failure Path QA

## Invalid sign-in input
Command exercised:

```bash
curl -i -X POST "http://127.0.0.1:4283/api/auth/sign-in" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "email=not-an-email"
```

## Expected result
- The app should reject malformed sign-in input.
- The user should be redirected back to `/sign-in?error=expired`.

## Actual result
- Response status: `303 See Other`
- Response location: `/sign-in?error=expired`
- No protected session cookies were issued for the invalid input path.

## Why this mattered
This confirmed the starter fails closed on bad sign-in input instead of silently creating a demo session.

## Port note
This failure-path check used the same temporary manual-QA server on `4283` as `happy-path.md`.
