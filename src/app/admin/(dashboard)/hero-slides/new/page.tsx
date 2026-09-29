import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminTable";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewHeroSlidePage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/hero-slides" className="text-sm text-muted hover:text-ink">
        ← All slides
      </Link>
      <div className="mt-4">
        <AdminPageHeader title="New hero slide" />
      </div>
      <HeroSlideForm />
    </>
  );
}
