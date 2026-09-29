import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminTable";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { requireAdmin } from "@/lib/auth";
import type { HeroSlide } from "@/lib/types";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("hero_slides").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const slide = data as HeroSlide;
  return (
    <>
      <Link href="/admin/hero-slides" className="text-sm text-muted hover:text-ink">
        ← All slides
      </Link>
      <div className="mt-4">
        <AdminPageHeader title={slide.label || "Hero slide"} actions={<StatusPill value={slide.published ? "published" : "draft"} />} />
      </div>
      <HeroSlideForm key={slide.updated_at} slide={slide} />
    </>
  );
}
