import Link from "next/link";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/auth";
import type { ContactSubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function ContactLeadsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = (data ?? []) as ContactSubmission[];
  return (
    <>
      <AdminPageHeader title="Messages" description="Submissions from the contact form." />
      <AdminTable
        rows={rows}
        empty="Messages will appear here as they come in."
        columns={[
          {
            header: "From",
            cell: (r) => (
              <Link href={`/admin/leads/contact/${r.id}`} className="block">
                <span className="font-medium hover:underline">{r.name}</span>
                <span className="block text-xs text-muted">{r.email}</span>
              </Link>
            ),
          },
          { header: "Store", cell: (r) => <span className="break-all">{r.store_url?.replace(/^https?:\/\//, "") ?? "—"}</span> },
          { header: "Message", cell: (r) => <span className="line-clamp-2 max-w-md text-muted">{r.message}</span> },
          { header: "Status", cell: (r) => <StatusPill value={r.status} /> },
          { header: "Received", cell: (r) => <span className="whitespace-nowrap text-muted">{formatDate(r.created_at)}</span> },
        ]}
      />
    </>
  );
}
