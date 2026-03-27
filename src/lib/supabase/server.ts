import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv, hasSupabaseEnv } from "./env";

interface SupabaseCookieToSet {
  name: string;
  options: Record<string, unknown>;
  value: string;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getSupabaseEnv();

  if (!hasSupabaseEnv()) {
    return null;
  }

  return createServerClient(env.url!, env.publishableKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: SupabaseCookieToSet[]) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      }
    }
  });
}
