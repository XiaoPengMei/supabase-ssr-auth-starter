"use client";

import { useEffect, useState } from "react";

import type { SessionSnapshot } from "../../auth/demo-auth";

function formatClock(value: number) {
  return new Date(value).toLocaleTimeString("en-US", { hour12: false });
}

export function RefreshClient({ initialSession }: { initialSession: SessionSnapshot }) {
  const [session, setSession] = useState(initialSession);
  const [refreshStatus, setRefreshStatus] = useState("Waiting for the first background refresh…");
  const [secretResponse, setSecretResponse] = useState("Press the button after the page refreshes itself.");

  useEffect(() => {
    let cancelled = false;

    async function refreshSession(reason: string) {
      const response = await fetch("/api/auth/refresh", {
        credentials: "same-origin",
        method: "POST"
      });

      if (!response.ok) {
        if (!cancelled) {
          setRefreshStatus("Refresh failed. Sign in again to keep testing the flow.");
        }
        return;
      }

      const payload = await response.json() as { session: SessionSnapshot };

      if (!cancelled) {
        setSession(payload.session);
        setRefreshStatus(`Last refresh: ${new Date().toLocaleTimeString("en-US", { hour12: false })} via ${reason}.`);
      }
    }

    const warmup = window.setTimeout(() => {
      void refreshSession("warm-up");
    }, 1_500);
    const interval = window.setInterval(() => {
      void refreshSession("interval");
    }, 3_000);
    const onVisibilityChange = () => {
      if (!document.hidden) {
        void refreshSession("tab-visible");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearTimeout(warmup);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  async function loadProtectedData() {
    const response = await fetch("/api/protected-data", {
      credentials: "same-origin"
    });

    if (!response.ok) {
      setSecretResponse("Protected fetch failed. The session is no longer valid.");
      return;
    }

    const payload = await response.json();
    setSecretResponse(JSON.stringify(payload, null, 2));
  }

  return (
    <>
      <div className="grid">
        <div className="metric">
          Access token expires at
          <strong data-testid="access-expiry">{formatClock(session.accessTokenExpiresAt)}</strong>
        </div>
        <div className="metric">
          Background refresh count
          <strong data-testid="refresh-count">{session.refreshCount}</strong>
        </div>
        <div className="metric">
          Refresh token expires at
          <strong data-testid="refresh-expiry">{formatClock(session.refreshTokenExpiresAt)}</strong>
        </div>
      </div>
      <p className="notice" data-testid="refresh-status">{refreshStatus}</p>
      <button className="secondary" type="button" onClick={() => void loadProtectedData()}>
        Load protected data
      </button>
      <pre className="notice" data-testid="secret-response">{secretResponse}</pre>
    </>
  );
}
