import Link from "next/link";
import { togglePostFeatured } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/AdminForm";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/AdminTable";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function PostsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,slug,category,status,featured,published_at,updated_at")
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as BlogPost[];

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Articles published at /blog."
        actions={
          <Link href="/admin/posts/new" className={buttonClasses("dark", "sm")}>
            New post
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        empty="Create your first article, or import the starter articles from the overview page."
        columns={[
          {
            header: "Title",
            cell: (r) => (
              <Link href={`/admin/posts/${r.id}`} className="font-medium hover:underline">
                {r.title}
                <span className="block text-xs font-normal text-muted">/blog/{r.slug}</span>
              </Link>
            ),
          },
          { header: "Category", cell: (r) => r.category ?? "—" },
          { header: "Status", cell: (r) => <StatusPill value={r.status} /> },
          { header: "Published", cell: (r) => <span className="whitespace-nowrap text-muted">{formatDate(r.published_at) || "—"}</span> },
          {
            header: "Featured",
            cell: (r) => (
              <ActionButton action={togglePostFeatured} values={{ id: r.id, featured: String(!r.featured) }} label={r.featured ? "★ Featured" : "Feature"} variant={r.featured ? "outline" : "ghost"} />
            ),
          },
        ]}
      />
    </>
  );
}
