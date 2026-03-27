import { describe, expect, it } from "vitest";

import { createDemoAuthService } from "../src/auth/demo-auth";

describe("createDemoAuthService", () => {
  it("rotates the access token and increments refresh count", () => {
    let currentTime = 1_000;
    let tokenNumber = 0;
    const auth = createDemoAuthService({
      accessTokenTtlMs: 10_000,
      now: () => currentTime,
      randomToken: () => `token-${++tokenNumber}`,
      refreshTokenTtlMs: 30_000
    });

    const signedIn = auth.signIn("demo@example.com");
    expect(signedIn.session.refreshCount).toBe(0);
    expect(auth.getSessionFromAccessToken(signedIn.accessToken)?.user.email).toBe("demo@example.com");

    currentTime += 9_000;

    const refreshed = auth.refreshSession(signedIn.refreshToken);

    expect(refreshed).not.toBeNull();
    expect(refreshed?.accessToken).not.toBe(signedIn.accessToken);
    expect(refreshed?.session.refreshCount).toBe(1);
    expect(auth.getSessionFromAccessToken(refreshed?.accessToken)?.refreshCount).toBe(1);
  });

  it("rejects refresh attempts after the refresh token expires", () => {
    let currentTime = 5_000;
    const auth = createDemoAuthService({
      accessTokenTtlMs: 2_000,
      now: () => currentTime,
      refreshTokenTtlMs: 4_000
    });

    const signedIn = auth.signIn("demo@example.com");

    currentTime += 5_000;

    expect(auth.refreshSession(signedIn.refreshToken)).toBeNull();
  });

  it("normalizes the signed-in email to lowercase", () => {
    const auth = createDemoAuthService();
    const signedIn = auth.signIn("Demo.User@Example.COM");

    expect(signedIn.session.user.email).toBe("demo.user@example.com");
  });
});
