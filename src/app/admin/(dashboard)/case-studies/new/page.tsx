import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminTable";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewCaseStudyPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/case-studies" className="text-sm text-muted hover:text-ink">
        ← All case studies
      </Link>
      <div className="mt-4">
        <AdminPageHeader title="New case study" />
      </div>
      <CaseStudyForm />
    </>
  );
}
