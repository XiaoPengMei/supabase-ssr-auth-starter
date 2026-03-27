import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDemoAuthService } from "../../auth/demo-auth-singleton";
import { readSessionFromCookies } from "../../auth/session";
import { RefreshClient } from "./refresh-client";

export default async function ProtectedPage() {
  const cookieStore = await cookies();
  const session = readSessionFromCookies(cookieStore, getDemoAuthService());

  if (!session) {
    redirect("/sign-in?error=expired");
  }

  return (
    <main>
      <section className="card">
        <div className="eyebrow">Single happy path</div>
        <h1>Protected page</h1>
        <p>
          The page stays live because the browser refreshes the session through <code>POST /api/auth/refresh</code>.
          Route rendering only checks the current access cookie, so there is no middleware refresh stall on the protected request path.
        </p>
        <div className="notice">
          Signed in as <strong data-testid="signed-in-email">{session.user.email}</strong>
        </div>
        <RefreshClient initialSession={session} />
      </section>
    </main>
  );
}
