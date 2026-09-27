import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-10 text-2xl font-semibold tracking-tight">Sign in to the CMS</h1>
        <p className="mt-1 mb-8 text-sm text-muted">Admin access only.</p>
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <p className="border border-line-strong bg-white p-4 text-sm">
            Supabase isn&rsquo;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment, then reload.
          </p>
        )}
      </div>
    </main>
  );
}
