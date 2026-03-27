interface SignInPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = params.error === "expired"
    ? "Your local demo session expired. Sign in again to restart the happy path."
    : undefined;

  return (
    <main>
      <section className="card">
        <div className="eyebrow">Local demo auth</div>
        <h1>Open the protected page without middleware refresh.</h1>
        <p>
          This starter keeps the QA path local by using a tiny stateless token auth seam.
          In a real Supabase setup, this is the seam where you would swap in the server client
          and keep refresh work on a dedicated endpoint instead of request middleware.
        </p>
        {errorMessage ? <p className="error">{errorMessage}</p> : null}
        <form action="/api/auth/sign-in" method="post">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue="demo@example.com" required />
          <button type="submit">Open protected page</button>
        </form>
      </section>
    </main>
  );
}
