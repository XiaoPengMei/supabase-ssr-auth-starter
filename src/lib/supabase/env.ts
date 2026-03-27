export function getSupabaseEnv() {
  return {
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL
  };
}

export function hasSupabaseEnv() {
  const env = getSupabaseEnv();
  return Boolean(env.url && env.publishableKey);
}
