import Link from "next/link";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/AdminTable";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import type { EmailDesign } from "@/lib/types";

export default async function DesignsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("email_designs").select("*").order("sort_order").order("created_at", { ascending: false });
  const rows = (data ?? []) as EmailDesign[];
  return (
    <>
      <AdminPageHeader
        title="Email designs"
        description="Design Lab concepts and client work shown on /work and the homepage. If none are published, the built-in concepts are shown."
        actions={
          <Link href="/admin/designs/new" className={buttonClasses("dark", "sm")}>
            New design
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        empty="Add a design, or import the built-in concepts from the overview page."
        columns={[
          {
            header: "Preview",
            cell: (r) =>
              r.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" className="h-16 w-12 border border-line object-cover object-top" />
              ) : (
                <span className="label inline-flex h-16 w-12 items-center justify-center border border-line bg-paper text-[0.55rem] text-muted">Coded</span>
              ),
          },
          {
            header: "Title",
            cell: (r) => (
              <Link href={`/admin/designs/${r.id}`} className="font-medium hover:underline">
                {r.title}
                <span className="block text-xs font-normal text-muted">
                  {r.kind} · {r.email_type}
                </span>
              </Link>
            ),
          },
          { header: "Label", cell: (r) => (r.is_concept ? "Concept" : `Client: ${r.client_name}`) },
          { header: "Featured", cell: (r) => (r.featured ? "★" : "") },
          { header: "Order", cell: (r) => r.sort_order },
          { header: "Status", cell: (r) => <StatusPill value={r.published ? "published" : "draft"} /> },
        ]}
      />
    </>
  );
}
