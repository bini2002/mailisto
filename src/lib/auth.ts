import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "./env";
import { createSupabaseServerClient } from "./supabase/server";

/** Returns the signed-in admin (or null). Checks both the session and the admin_users allow-list. */
export const getAdmin = cache(async () => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  const { data: row } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!row) return null;
  return { id: user.id, email: user.email ?? "" };
});

/** Use at the top of every admin page and admin server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const supabase = await createSupabaseServerClient();
  return { admin, supabase };
}
