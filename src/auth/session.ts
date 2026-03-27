import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  DEFAULT_ACCESS_TTL_MS,
  DEFAULT_REFRESH_TTL_MS,
  REFRESH_COOKIE_NAME,
  type DemoAuthService,
  type SessionTokens
} from "./demo-auth";

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export function readSessionFromCookies(cookieStore: CookieReader, auth: DemoAuthService) {
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return auth.getSessionFromAccessToken(accessToken);
}

export function applySessionCookies(response: NextResponse, sessionTokens: SessionTokens) {
  response.cookies.set(ACCESS_COOKIE_NAME, sessionTokens.accessToken, {
    httpOnly: true,
    maxAge: Math.floor(DEFAULT_ACCESS_TTL_MS / 1_000),
    path: "/",
    sameSite: "lax"
  });
  response.cookies.set(REFRESH_COOKIE_NAME, sessionTokens.refreshToken, {
    httpOnly: true,
    maxAge: Math.floor(DEFAULT_REFRESH_TTL_MS / 1_000),
    path: "/",
    sameSite: "lax"
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax"
  });
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax"
  });
}
