# Happy Path QA

## Browser path exercised
Server command used for this manual pass:

```bash
npx next dev --hostname 127.0.0.1 --port 4283
```

1. Opened `http://127.0.0.1:4283/sign-in`
2. Submitted the default email on the sign-in form
3. Reached `/protected`
4. Waited for the background refresh counter to advance
5. Clicked `Load protected data`
6. Reloaded `/protected`
7. Confirmed the page still rendered as authenticated

## Observed result
- The protected page showed the signed-in email `demo@example.com`.
- The refresh counter increased over time.
- The page explicitly referenced `POST /api/auth/refresh` as the refresh path.
- Protected data still loaded after the background refresh.
- Reloading the protected page kept the session alive.
- Browser console showed no warnings or errors during manual QA.

## Port note
- `4173` is the default `npm run dev` port documented in the README.
- This manual QA pass used `4283` only because an unrelated local process had already claimed the default port at the time of testing.

## Screenshot
- `evidence/happy-path.png`
