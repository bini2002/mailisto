export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mailisto.com").replace(/\/$/, "");

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** The public site renders with built-in starter content when Supabase isn't configured yet. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
