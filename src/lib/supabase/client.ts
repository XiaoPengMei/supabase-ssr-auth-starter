import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv, hasSupabaseEnv } from "./env";

export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv();

  if (!hasSupabaseEnv()) {
    return null;
  }

  return createBrowserClient(env.url!, env.publishableKey!);
}
