import { describe, expect, it } from "vitest";
import { NextResponse } from "next/server";

import { createDemoAuthService } from "../src/auth/demo-auth";
import { applySessionCookies, clearSessionCookies, isValidEmail } from "../src/auth/session";

describe("session helpers", () => {
  it("validates sign-in email input", () => {
    expect(isValidEmail("demo@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("writes and clears both auth cookies", () => {
    const auth = createDemoAuthService();
    const sessionTokens = auth.signIn("demo@example.com");
    const response = NextResponse.json({ ok: true });

    applySessionCookies(response, sessionTokens);
    clearSessionCookies(response);

    const setCookieHeader = response.headers.get("set-cookie") ?? "";

    expect(setCookieHeader).toContain("demo_access_token=");
    expect(setCookieHeader).toContain("demo_refresh_token=");
  });
});
