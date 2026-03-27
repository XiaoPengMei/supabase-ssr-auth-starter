import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDemoAuthService } from "../auth/demo-auth-singleton";
import { readSessionFromCookies } from "../auth/session";

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = readSessionFromCookies(cookieStore, getDemoAuthService());

  redirect(session ? "/protected" : "/sign-in");
}
