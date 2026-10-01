import Link from "next/link";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/AdminTable";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import type { HeroSlide } from "@/lib/types";

export default async function HeroSlidesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("hero_slides").select("*").order("sort_order").order("created_at");
  const rows = (data ?? []) as HeroSlide[];
  return (
    <>
      <AdminPageHeader
        title="Hero slides"
        description="Designs that dissolve one into the next on the right of the homepage hero. 4–5 slides work best. If none are published, the built-in set is shown."
        actions={
          <Link href="/admin/hero-slides/new" className={buttonClasses("dark", "sm")}>
            New slide
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        empty="Add your first slide, or use “Import starter content” on the overview page."
        columns={[
          {
            header: "Preview",
            cell: (r) =>
              r.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" className="h-20 w-16 border border-line bg-paper object-contain" />
              ) : (
                <span className="label inline-flex h-20 w-16 items-center justify-center border border-line bg-paper text-[0.55rem] text-muted">Built-in</span>
              ),
          },
          {
            header: "Slide",
            cell: (r) => (
              <Link href={`/admin/hero-slides/${r.id}`} className="font-medium hover:underline">
                {r.label || "Untitled slide"}
                {r.caption && <span className="block text-xs font-normal text-muted">{r.caption}</span>}
              </Link>
            ),
          },
          { header: "Order", cell: (r) => r.sort_order },
          { header: "Status", cell: (r) => <StatusPill value={r.published ? "published" : "draft"} /> },
        ]}
      />
    </>
  );
}
