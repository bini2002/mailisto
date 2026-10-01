import "server-only";
import { cache } from "react";
import { conceptsByKey, emailConcepts, type EmailConcept } from "@/content/email-concepts";
import { defaultHeroSlides } from "@/content/hero-slides";
import { starterPosts } from "@/content/starter-posts";
import { getPublicSupabase } from "./supabase/public";
import type { BlogPost, CaseStudy, EmailDesign, HeroSlide, SiteSettings } from "./types";

export type DesignView = EmailDesign & { concept: EmailConcept | null };
export type HeroSlideView = Pick<HeroSlide, "id" | "label" | "image_url" | "image_alt" | "caption"> & {
  notes: string[];
  concept: EmailConcept | null;
};

function toSlideView(s: Pick<HeroSlide, "id" | "label" | "image_url" | "image_alt" | "caption" | "notes" | "concept_template">): HeroSlideView {
  return {
    id: s.id,
    label: s.label,
    image_url: s.image_url,
    image_alt: s.image_alt,
    caption: s.caption,
    notes: (s.notes ?? "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 4),
    concept: s.concept_template ? conceptsByKey[s.concept_template] ?? null : null,
  };
}

function defaultSlides(): HeroSlideView[] {
  return defaultHeroSlides.map((s, i) =>
    toSlideView({
      id: `default-${i}`,
      label: s.label,
      image_url: s.image_url ?? null,
      image_alt: s.image_alt ?? null,
      caption: s.caption,
      notes: s.notes,
      concept_template: s.concept_template ?? null,
    }),
  );
}

/** Published hero slides, in order. Falls back to the built-in set if none are published yet. */
export const getHeroSlides = cache(async (): Promise<HeroSlideView[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return defaultSlides();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id,label,image_url,image_alt,caption,notes,concept_template")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(8);
  if (error) console.error("getHeroSlides", error.message);
  const slides = (data ?? []).map(toSlideView).filter((s) => s.image_url || s.concept);
  return slides.length ? slides : defaultSlides();
});

const POST_LIST_COLUMNS =
  "id,title,slug,excerpt,featured_image_url,featured_image_alt,category,author_name,status,featured,published_at,seo_title,seo_description,og_image_url,created_at,updated_at";

function starterAsPosts(): BlogPost[] {
  return starterPosts.map((p) => ({
    ...p,
    id: p.slug,
    featured_image_url: null,
    featured_image_alt: null,
    author_name: "Mailisto",
    status: "published",
    og_image_url: null,
    created_at: p.published_at,
    updated_at: p.published_at,
  }));
}

function conceptsAsDesigns(): DesignView[] {
  return emailConcepts.map((c, i) => ({
    id: c.key,
    title: c.title,
    slug: c.key,
    kind: c.kind,
    email_type: c.emailType,
    tags: c.tags,
    description: c.description,
    objective: c.objective,
    creative_direction: c.creativeDirection,
    image_url: null,
    image_alt: null,
    concept_template: c.key,
    is_concept: true,
    client_name: null,
    featured: i < 4,
    published: true,
    sort_order: i,
    created_at: "",
    updated_at: "",
    concept: c,
  }));
}

export const getPublishedPosts = cache(async (limit?: number): Promise<BlogPost[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return starterAsPosts().slice(0, limit);
  let q = supabase
    .from("blog_posts")
    .select(POST_LIST_COLUMNS)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) {
    console.error("getPublishedPosts", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({ ...p, content: "" })) as BlogPost[];
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const supabase = getPublicSupabase();
  if (!supabase) return starterAsPosts().find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) console.error("getPostBySlug", error.message);
  return (data as BlogPost | null) ?? null;
});

/** Published designs. Falls back to the built-in Design Lab concepts if none are published yet. */
export const getEmailDesigns = cache(async (): Promise<DesignView[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return conceptsAsDesigns();
  const { data, error } = await supabase
    .from("email_designs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) console.error("getEmailDesigns", error.message);
  if (!data || data.length === 0) return conceptsAsDesigns();
  return (data as EmailDesign[]).map((d) => ({
    ...d,
    concept: d.concept_template ? conceptsByKey[d.concept_template] ?? null : null,
  }));
});

export const getPublishedCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("project_date", { ascending: false, nullsFirst: false });
  if (error) console.error("getPublishedCaseStudies", error.message);
  return (data as CaseStudy[] | null) ?? [];
});

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudy | null> => {
  const supabase = getPublicSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from("case_studies").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return (data as CaseStudy | null) ?? null;
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = getPublicSupabase();
  if (!supabase) return {};
  const { data } = await supabase.from("site_settings").select("key,value");
  const out: SiteSettings = {};
  for (const row of data ?? []) if (row.value) (out as Record<string, string>)[row.key] = row.value;
  return out;
});

export interface HeroVideo {
  src: string | null;
  webm: string | null;
  poster: string;
}

/**
 * Hero video: Admin → Settings wins; otherwise files dropped into /public/videos.
 * With no video at all, the frame still shows the poster image.
 */
export const getHeroVideo = cache(async (): Promise<HeroVideo> => {
  const settings = await getSiteSettings();
  const { existsSync } = await import("node:fs");
  const { join } = await import("node:path");
  const has = (p: string) => existsSync(join(process.cwd(), "public", p));

  const src = settings.hero_video_url || (has("videos/hero.mp4") ? "/videos/hero.mp4" : null);
  const webm = !settings.hero_video_url && has("videos/hero.webm") ? "/videos/hero.webm" : null;
  const poster =
    settings.hero_video_poster || (has("videos/hero-poster.jpg") ? "/videos/hero-poster.jpg" : "/images/hero.png");
  return { src: src || webm, webm: src ? webm : null, poster };
});
