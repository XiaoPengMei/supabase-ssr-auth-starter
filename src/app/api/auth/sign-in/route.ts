import { NextResponse } from "next/server";

import { getDemoAuthService } from "../../../../auth/demo-auth-singleton";
import { applySessionCookies, isValidEmail } from "../../../../auth/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  if (!isValidEmail(email)) {
    return new NextResponse(null, {
      status: 303,
      headers: {
        Location: "/sign-in?error=expired"
      }
    });
  }

  const response = new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/protected"
    }
  });
  applySessionCookies(response, getDemoAuthService().signIn(email));
  return response;
}
