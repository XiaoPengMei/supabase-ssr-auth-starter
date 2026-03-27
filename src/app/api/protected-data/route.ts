import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getDemoAuthService } from "../../../auth/demo-auth-singleton";
import { readSessionFromCookies } from "../../../auth/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = readSessionFromCookies(cookieStore, getDemoAuthService());

  if (!session) {
    return NextResponse.json({ error: "session_expired" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Protected data still loads after the background refresh, so there is no middleware stall on this page.",
    refreshCount: session.refreshCount,
    user: session.user
  });
}
