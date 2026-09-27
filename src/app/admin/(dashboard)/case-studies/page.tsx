import Link from "next/link";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/AdminTable";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import type { CaseStudy } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function CaseStudiesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("case_studies").select("*").order("sort_order").order("created_at", { ascending: false });
  const rows = (data ?? []) as CaseStudy[];
  return (
    <>
      <AdminPageHeader
        title="Case studies"
        description="Hidden on the public site until at least one is published."
        actions={
          <Link href="/admin/case-studies/new" className={buttonClasses("dark", "sm")}>
            New case study
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        empty="When you have real client results (with permission), add them here."
        columns={[
          {
            header: "Title",
            cell: (r) => (
              <Link href={`/admin/case-studies/${r.id}`} className="font-medium hover:underline">
                {r.title}
                <span className="block text-xs font-normal text-muted">{r.client_name}</span>
              </Link>
            ),
          },
          { header: "Industry", cell: (r) => r.industry ?? "—" },
          { header: "Date", cell: (r) => formatDate(r.project_date) || "—" },
          { header: "Featured", cell: (r) => (r.featured ? "★" : "") },
          { header: "Status", cell: (r) => <StatusPill value={r.status} /> },
        ]}
      />
    </>
  );
}
