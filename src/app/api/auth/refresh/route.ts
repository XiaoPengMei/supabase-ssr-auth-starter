import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_COOKIE_NAME } from "../../../../auth/demo-auth";
import { getDemoAuthService } from "../../../../auth/demo-auth-singleton";
import { applySessionCookies, clearSessionCookies } from "../../../../auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  const sessionTokens = getDemoAuthService().refreshSession(refreshToken);

  if (!sessionTokens) {
    const response = NextResponse.json({ error: "refresh_expired" }, { status: 401 });
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.json({ refreshed: true, session: sessionTokens.session });
  applySessionCookies(response, sessionTokens);
  return response;
}
