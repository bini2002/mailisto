import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { admin, supabase } = await requireAdmin();
  const { count } = await supabase.from("audit_submissions").select("id", { count: "exact", head: true }).eq("status", "new");

  return (
    <ToastProvider>
      <AdminSidebar email={admin.email} newLeads={count ?? 0} />
      <main className="px-4 py-8 sm:px-8 lg:ml-60 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </ToastProvider>
  );
}
