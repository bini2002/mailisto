import Link from "next/link";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/auth";
import { AUDIT_STATUSES, type AuditSubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function AuditLeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  let q = supabase.from("audit_submissions").select("*").order("created_at", { ascending: false }).limit(500);
  if (status && (AUDIT_STATUSES as readonly string[]).includes(status)) q = q.eq("status", status);
  const { data } = await q;
  const rows = (data ?? []) as AuditSubmission[];

  return (
    <>
      <AdminPageHeader title="Audit leads" description="Requests from the free email & SMS audit form." />
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2 text-sm">
        {["all", ...AUDIT_STATUSES].map((s) => {
          const active = (status ?? "all") === s;
          return (
            <Link key={s} href={s === "all" ? "/admin/leads/audit" : `/admin/leads/audit?status=${s}`} className={`border px-3 py-1.5 ${active ? "border-ink bg-ink text-white" : "border-line-strong bg-white hover:border-ink"}`}>
              {s.replace("_", " ")}
            </Link>
          );
        })}
      </nav>
      <AdminTable
        rows={rows}
        empty="Audit requests will appear here as they come in."
        columns={[
          {
            header: "Lead",
            cell: (r) => (
              <Link href={`/admin/leads/audit/${r.id}`} className="block">
                <span className="font-medium underline-offset-2 hover:underline">{r.name}</span>
                <span className="block text-xs text-muted">{r.email}</span>
              </Link>
            ),
          },
          { header: "Store", cell: (r) => <span className="break-all">{r.store_url.replace(/^https?:\/\//, "")}</span> },
          { header: "Revenue", cell: (r) => r.revenue_range },
          { header: "Platform", cell: (r) => r.platform },
          { header: "List", cell: (r) => r.list_size },
          { header: "Challenge", cell: (r) => <span className="text-muted">{r.challenge}</span> },
          { header: "Status", cell: (r) => <StatusPill value={r.status} /> },
          { header: "Submitted", cell: (r) => <span className="whitespace-nowrap text-muted">{formatDate(r.created_at)}</span> },
        ]}
      />
    </>
  );
}
