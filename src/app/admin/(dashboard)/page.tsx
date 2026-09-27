import Link from "next/link";
import { importStarterContent } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/AdminForm";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/auth";
import type { AuditSubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function AdminOverview() {
  const { supabase } = await requireAdmin();
  const head = { count: "exact" as const, head: true };
  const [newAudits, newMessages, posts, drafts, designs, studies, recent] = await Promise.all([
    supabase.from("audit_submissions").select("id", head).eq("status", "new"),
    supabase.from("contact_submissions").select("id", head).eq("status", "new"),
    supabase.from("blog_posts").select("id", head).eq("status", "published"),
    supabase.from("blog_posts").select("id", head).eq("status", "draft"),
    supabase.from("email_designs").select("id", head),
    supabase.from("case_studies").select("id", head).eq("status", "published"),
    supabase.from("audit_submissions").select("id,name,email,store_url,revenue_range,status,created_at").order("created_at", { ascending: false }).limit(6),
  ]);

  const stats = [
    { label: "New audit requests", value: newAudits.count ?? 0, href: "/admin/leads/audit" },
    { label: "New messages", value: newMessages.count ?? 0, href: "/admin/leads/contact" },
    { label: "Published articles", value: posts.count ?? 0, href: "/admin/posts", sub: `${drafts.count ?? 0} drafts` },
    { label: "Email designs", value: designs.count ?? 0, href: "/admin/designs" },
    { label: "Published case studies", value: studies.count ?? 0, href: "/admin/case-studies" },
  ];
  const isEmpty = (designs.count ?? 0) === 0 && (posts.count ?? 0) + (drafts.count ?? 0) === 0;
  const leads = (recent.data ?? []) as Pick<AuditSubmission, "id" | "name" | "email" | "store_url" | "revenue_range" | "status" | "created_at">[];

  return (
    <>
      <AdminPageHeader title="Overview" description="Leads, content and what needs attention." />

      {isEmpty && (
        <div className="mb-8 flex flex-col gap-4 border border-ink bg-lime/30 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Your CMS is empty.</p>
            <p className="text-sm text-ink/75">Import the nine Design Lab concepts and five starter articles. You can edit or delete them afterwards.</p>
          </div>
          <ActionButton action={importStarterContent} values={{}} label="Import starter content" />
        </div>
      )}

      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label} className="bg-white">
            <Link href={s.href} className="block p-5 hover:bg-paper">
              <p className="label text-muted">{s.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</p>
              {s.sub && <p className="mt-1 text-xs text-muted">{s.sub}</p>}
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Latest audit requests</h2>
          <Link href="/admin/leads/audit" className="text-sm underline underline-offset-2">
            View all
          </Link>
        </div>
        {leads.length === 0 ? (
          <p className="border border-dashed border-line-strong p-6 text-sm text-muted">No audit requests yet.</p>
        ) : (
          <ul className="divide-y divide-line border border-line bg-white">
            {leads.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/audit/${l.id}`} className="flex flex-col gap-1 p-4 hover:bg-paper sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <span className="font-medium">{l.name}</span> <span className="text-sm text-muted">· {l.store_url}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm text-muted">
                    {l.revenue_range}
                    <StatusPill value={l.status} />
                    {formatDate(l.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
