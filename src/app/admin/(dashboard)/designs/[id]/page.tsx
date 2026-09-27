import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminTable";
import { DesignForm } from "@/components/admin/DesignForm";
import { requireAdmin } from "@/lib/auth";
import type { EmailDesign } from "@/lib/types";

export default async function EditDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("email_designs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const design = data as EmailDesign;
  return (
    <>
      <Link href="/admin/designs" className="text-sm text-muted hover:text-ink">
        ← All designs
      </Link>
      <div className="mt-4">
        <AdminPageHeader title={design.title} />
      </div>
      <DesignForm key={design.updated_at} design={design} />
    </>
  );
}
