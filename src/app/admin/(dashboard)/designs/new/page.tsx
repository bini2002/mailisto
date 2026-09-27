import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminTable";
import { DesignForm } from "@/components/admin/DesignForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewDesignPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/designs" className="text-sm text-muted hover:text-ink">
        ← All designs
      </Link>
      <div className="mt-4">
        <AdminPageHeader title="New email design" />
      </div>
      <DesignForm />
    </>
  );
}
