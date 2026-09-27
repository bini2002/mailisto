import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminTable";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { requireAdmin } from "@/lib/auth";
import type { CaseStudy } from "@/lib/types";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("case_studies").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const study = data as CaseStudy;
  return (
    <>
      <Link href="/admin/case-studies" className="text-sm text-muted hover:text-ink">
        ← All case studies
      </Link>
      <div className="mt-4">
        <AdminPageHeader title={study.title} actions={<StatusPill value={study.status} />} />
      </div>
      <CaseStudyForm key={study.updated_at} study={study} />
    </>
  );
}
