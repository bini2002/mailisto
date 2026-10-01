"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { emailConcepts } from "@/content/email-concepts";
import { defaultHeroSlides } from "@/content/hero-slides";
import { starterPosts } from "@/content/starter-posts";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AUDIT_STATUSES, CONTACT_STATUSES, DESIGN_TAGS, type CaseStudyResult } from "@/lib/types";
import { calendlyUrl, safeUrl, slugify } from "@/lib/utils";
import { clean } from "@/lib/validation";

export interface AdminResult {
  ok: boolean;
  message: string;
  redirectTo?: string;
  url?: string;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const str = (fd: FormData, k: string, max = 500) => clean(fd.get(k), max);
const opt = (fd: FormData, k: string, max = 500) => str(fd, k, max) || null;
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const int = (fd: FormData, k: string) => {
  const n = Number.parseInt(String(fd.get(k) ?? "0"), 10);
  return Number.isFinite(n) ? Math.max(-9999, Math.min(9999, n)) : 0;
};
/** Only https (or site-relative) image URLs are stored. */
const imageUrl = (fd: FormData, k: string) => {
  const u = safeUrl(str(fd, k, 1000));
  return u && (u.startsWith("https://") || u.startsWith("/")) ? u : null;
};
const longText = (fd: FormData, k: string, max = 100_000) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.replace(/\r\n?/g, "\n").slice(0, max) : "";
};

function resolveSlug(fd: FormData, title: string) {
  const raw = str(fd, "slug", 120);
  return raw ? slugify(raw) : slugify(title);
}

function dbError(message: string): AdminResult {
  if (message.includes("duplicate key") && message.includes("slug")) return { ok: false, message: "That slug is already in use. Choose another." };
  if (message.includes("violates check constraint")) return { ok: false, message: "One of the fields is too long or invalid. Check and try again." };
  return { ok: false, message: `Couldn't save: ${message}` };
}

function refreshPublic(...paths: string[]) {
  for (const p of ["/", "/sitemap.xml", ...paths]) revalidatePath(p);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(_prev: AdminResult | null, fd: FormData): Promise<AdminResult> {
  if (!isSupabaseConfigured) return { ok: false, message: "Supabase isn't configured. Add the environment variables first." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) return { ok: false, message: "Too many attempts. Try again in 15 minutes." };

  const email = str(fd, "email", 254).toLowerCase();
  const password = String(fd.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { ok: false, message: "Incorrect email or password." };

  const { data: row } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account doesn't have admin access." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Uploads (Supabase Storage, "media" bucket)
// ---------------------------------------------------------------------------

const MAX_UPLOAD = 5 * 1024 * 1024;

/** Detect the real image type from magic bytes. The browser-supplied MIME type is not trusted. */
function sniffImage(buf: Uint8Array): { ext: string; mime: string } | null {
  const b = (i: number) => buf[i];
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { ext: "png", mime: "image/png" };
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46) return { ext: "gif", mime: "image/gif" };
  const ascii = (s: number, e: number) => String.fromCharCode(...buf.slice(s, e));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", mime: "image/webp" };
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return { ext: "avif", mime: "image/avif" };
  return null;
}

export async function uploadImage(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const file = fd.get("file");
  const folder = ["designs", "blog", "case-studies", "hero", "misc"].includes(String(fd.get("folder"))) ? String(fd.get("folder")) : "misc";

  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose an image to upload." };
  if (file.size > MAX_UPLOAD) return { ok: false, message: "Images must be 5 MB or smaller." };

  const buf = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(buf);
  if (!kind) return { ok: false, message: "Use a PNG, JPG, WebP, AVIF or GIF image." };

  const path = `${folder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${kind.ext}`;
  const { error } = await supabase.storage.from("media").upload(path, buf, { contentType: kind.mime, cacheControl: "31536000", upsert: false });
  if (error) return { ok: false, message: `Upload failed: ${error.message}` };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, message: "Image uploaded.", url: data.publicUrl };
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export async function savePost(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id", 60) || null;
  const title = str(fd, "title", 200);
  const slug = resolveSlug(fd, title);
  const status = fd.get("status") === "published" ? "published" : "draft";

  if (!title) return { ok: false, message: "A title is required." };
  if (!SLUG_RE.test(slug)) return { ok: false, message: "Slug can only contain lowercase letters, numbers and hyphens." };

  const publishedAtInput = str(fd, "published_at", 40);
  // datetime-local values ("YYYY-MM-DDTHH:mm") are treated as UTC.
  const parsed = publishedAtInput ? new Date(/Z|[+-]\d\d:\d\d$/.test(publishedAtInput) ? publishedAtInput : `${publishedAtInput}Z`) : null;
  if (parsed && Number.isNaN(parsed.getTime())) return { ok: false, message: "Publish date is invalid." };
  let published_at: string | null = parsed ? parsed.toISOString() : null;
  if (status === "published" && !published_at) published_at = new Date().toISOString();

  const row = {
    title,
    slug,
    excerpt: opt(fd, "excerpt", 400),
    content: longText(fd, "content"),
    featured_image_url: imageUrl(fd, "featured_image_url"),
    featured_image_alt: opt(fd, "featured_image_alt", 200),
    category: opt(fd, "category", 60),
    author_name: str(fd, "author_name", 80) || "Mailisto",
    status,
    featured: bool(fd, "featured"),
    published_at,
    seo_title: opt(fd, "seo_title", 70),
    seo_description: opt(fd, "seo_description", 170),
    og_image_url: imageUrl(fd, "og_image_url"),
  };

  const q = id ? supabase.from("blog_posts").update(row).eq("id", id).select("id,slug").single() : supabase.from("blog_posts").insert(row).select("id,slug").single();
  const { data, error } = await q;
  if (error) return dbError(error.message);

  refreshPublic("/blog", `/blog/${data.slug}`);
  revalidatePath("/admin/posts");
  return { ok: true, message: id ? "Post saved." : "Post created.", redirectTo: id ? undefined : `/admin/posts/${data.id}` };
}

export async function deletePost(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id", 60);
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return dbError(error.message);
  refreshPublic("/blog");
  revalidatePath("/admin/posts");
  return { ok: true, message: "Post deleted.", redirectTo: "/admin/posts" };
}

export async function togglePostFeatured(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id", 60);
  const featured = fd.get("featured") === "true";
  const { error } = await supabase.from("blog_posts").update({ featured }).eq("id", id);
  if (error) return dbError(error.message);
  refreshPublic("/blog");
  revalidatePath("/admin/posts");
  return { ok: true, message: featured ? "Marked as featured." : "Removed from featured." };
}

// ---------------------------------------------------------------------------
// Email designs
// ---------------------------------------------------------------------------

export async function saveDesign(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id", 60) || null;
  const title = str(fd, "title", 140);
  const slug = resolveSlug(fd, title);
  const is_concept = bool(fd, "is_concept");
  const image_url = imageUrl(fd, "image_url");
  const concept_template = opt(fd, "concept_template", 60);

  if (!title) return { ok: false, message: "A title is required." };
  if (!SLUG_RE.test(slug)) return { ok: false, message: "Slug can only contain lowercase letters, numbers and hyphens." };
  if (!image_url && !concept_template) return { ok: false, message: "Upload an image (or choose a built-in concept preview)." };
  if (concept_template && !emailConcepts.some((c) => c.key === concept_template)) return { ok: false, message: "Unknown concept preview." };
  if (!is_concept && !opt(fd, "client_name")) return { ok: false, message: "Real client work needs a client name (with their permission)." };

  const tags = fd
    .getAll("tags")
    .map(String)
    .filter((t): t is (typeof DESIGN_TAGS)[number] => (DESIGN_TAGS as readonly string[]).includes(t));

  const row = {
    title,
    slug,
    kind: fd.get("kind") === "flow" ? "flow" : "campaign",
    email_type: str(fd, "email_type", 60) || "Campaign",
    tags,
    description: opt(fd, "description", 600),
    objective: opt(fd, "objective", 300),
    creative_direction: opt(fd, "creative_direction", 600),
    image_url,
    image_alt: opt(fd, "image_alt", 200),
    concept_template,
    is_concept,
    client_name: is_concept ? null : opt(fd, "client_name", 120),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    sort_order: int(fd, "sort_order"),
  };

  const q = id ? supabase.from("email_designs").update(row).eq("id", id).select("id").single() : supabase.from("email_designs").insert(row).select("id").single();
  const { data, error } = await q;
  if (error) return dbError(error.message);

  refreshPublic("/work");
  revalidatePath("/admin/designs");
  return { ok: true, message: id ? "Design saved." : "Design created.", redirectTo: id ? undefined : `/admin/designs/${data.id}` };
}

export async function deleteDesign(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("email_designs").delete().eq("id", str(fd, "id", 60));
  if (error) return dbError(error.message);
  refreshPublic("/work");
  revalidatePath("/admin/designs");
  return { ok: true, message: "Design deleted.", redirectTo: "/admin/designs" };
}

// ---------------------------------------------------------------------------
// Hero slides (homepage hero, right-hand side)
// ---------------------------------------------------------------------------

export async function saveHeroSlide(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id", 60) || null;
  const image_url = imageUrl(fd, "image_url");
  const concept_template = opt(fd, "concept_template", 60);

  if (!image_url && !concept_template) return { ok: false, message: "Upload an image (or choose a built-in design)." };
  if (concept_template && !emailConcepts.some((c) => c.key === concept_template)) return { ok: false, message: "Unknown built-in design." };

  const notes = longText(fd, "notes", 600)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join("\n");

  const row = {
    label: opt(fd, "label", 80),
    image_url,
    image_alt: opt(fd, "image_alt", 200),
    concept_template,
    caption: opt(fd, "caption", 120),
    notes: notes || null,
    sort_order: int(fd, "sort_order"),
    published: bool(fd, "published"),
  };

  const q = id ? supabase.from("hero_slides").update(row).eq("id", id).select("id").single() : supabase.from("hero_slides").insert(row).select("id").single();
  const { data, error } = await q;
  if (error) return dbError(error.message);

  refreshPublic();
  revalidatePath("/admin/hero-slides");
  return { ok: true, message: id ? "Slide saved." : "Slide created.", redirectTo: id ? undefined : `/admin/hero-slides/${data.id}` };
}

export async function deleteHeroSlide(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("hero_slides").delete().eq("id", str(fd, "id", 60));
  if (error) return dbError(error.message);
  refreshPublic();
  revalidatePath("/admin/hero-slides");
  return { ok: true, message: "Slide deleted.", redirectTo: "/admin/hero-slides" };
}

// ---------------------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------------------

function parseResults(raw: string): CaseStudyResult[] {
  return raw
    .split("\n")
    .map((line) => line.split("|").map((s) => s.trim()))
    .filter(([label, value]) => label && value)
    .slice(0, 8)
    .map(([label, value]) => ({ label: label.slice(0, 60), value: value.slice(0, 40) }));
}

function parseUrlList(raw: string) {
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .map((u) => safeUrl(String(u)))
      .filter((u): u is string => !!u && u.startsWith("https://"))
      .slice(0, 24);
  } catch {
    return [];
  }
}

export async function saveCaseStudy(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id", 60) || null;
  const title = str(fd, "title", 160);
  const slug = resolveSlug(fd, title);
  const client_name = str(fd, "client_name", 120);

  if (!title || !client_name) return { ok: false, message: "Title and client name are required." };
  if (!SLUG_RE.test(slug)) return { ok: false, message: "Slug can only contain lowercase letters, numbers and hyphens." };

  const row = {
    title,
    slug,
    client_name,
    industry: opt(fd, "industry", 80),
    summary: opt(fd, "summary", 400),
    challenge: longText(fd, "challenge", 5000) || null,
    strategy: longText(fd, "strategy", 5000) || null,
    implementation: longText(fd, "implementation", 5000) || null,
    results: parseResults(longText(fd, "results", 2000)),
    revenue_attribution: longText(fd, "revenue_attribution", 2000) || null,
    before_state: longText(fd, "before_state", 3000) || null,
    after_state: longText(fd, "after_state", 3000) || null,
    cover_image_url: imageUrl(fd, "cover_image_url"),
    cover_image_alt: opt(fd, "cover_image_alt", 200),
    screenshots: parseUrlList(String(fd.get("screenshots") ?? "[]")),
    testimonial_quote: longText(fd, "testimonial_quote", 1000) || null,
    testimonial_author: opt(fd, "testimonial_author", 120),
    testimonial_role: opt(fd, "testimonial_role", 120),
    project_date: str(fd, "project_date", 10) || null,
    status: fd.get("status") === "published" ? "published" : "draft",
    featured: bool(fd, "featured"),
    sort_order: int(fd, "sort_order"),
    seo_title: opt(fd, "seo_title", 70),
    seo_description: opt(fd, "seo_description", 170),
  };

  const q = id ? supabase.from("case_studies").update(row).eq("id", id).select("id,slug").single() : supabase.from("case_studies").insert(row).select("id,slug").single();
  const { data, error } = await q;
  if (error) return dbError(error.message);

  refreshPublic("/work", `/work/${data.slug}`);
  revalidatePath("/admin/case-studies");
  return { ok: true, message: id ? "Case study saved." : "Case study created.", redirectTo: id ? undefined : `/admin/case-studies/${data.id}` };
}

export async function deleteCaseStudy(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("case_studies").delete().eq("id", str(fd, "id", 60));
  if (error) return dbError(error.message);
  refreshPublic("/work");
  revalidatePath("/admin/case-studies");
  return { ok: true, message: "Case study deleted.", redirectTo: "/admin/case-studies" };
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function updateLead(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const kind = fd.get("kind") === "contact" ? "contact" : "audit";
  const id = str(fd, "id", 60);
  const status = str(fd, "status", 30);
  const allowed: readonly string[] = kind === "audit" ? AUDIT_STATUSES : CONTACT_STATUSES;
  if (!allowed.includes(status)) return { ok: false, message: "Invalid status." };

  const table = kind === "audit" ? "audit_submissions" : "contact_submissions";
  const { error } = await supabase
    .from(table)
    .update({ status, admin_notes: longText(fd, "admin_notes", 5000) || null })
    .eq("id", id);
  if (error) return dbError(error.message);
  revalidatePath(`/admin/leads/${kind}`);
  revalidatePath("/admin");
  return { ok: true, message: "Lead updated." };
}

export async function deleteLead(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const kind = fd.get("kind") === "contact" ? "contact" : "audit";
  const table = kind === "audit" ? "audit_submissions" : "contact_submissions";
  const { error } = await supabase.from(table).delete().eq("id", str(fd, "id", 60));
  if (error) return dbError(error.message);
  revalidatePath(`/admin/leads/${kind}`);
  revalidatePath("/admin");
  return { ok: true, message: "Lead deleted.", redirectTo: `/admin/leads/${kind}` };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function saveSettings(fd: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const email = str(fd, "contact_email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Contact email looks invalid." };

  const urlOrNull = (k: string) => {
    const v = str(fd, k, 300);
    if (!v) return null;
    const u = safeUrl(v);
    return u && u.startsWith("https://") ? u : undefined;
  };
  const rows = [
    { key: "contact_email", value: email || null },
    { key: "linkedin_url", value: urlOrNull("linkedin_url") },
    { key: "instagram_url", value: urlOrNull("instagram_url") },
    { key: "x_url", value: urlOrNull("x_url") },
  ];
  if (rows.some((r) => r.value === undefined)) return { ok: false, message: "Social links must be full https:// URLs." };

  const calendlyRaw = str(fd, "calendly_url", 300);
  const calendly = calendlyRaw ? calendlyUrl(calendlyRaw) : null;
  if (calendlyRaw && !calendly) return { ok: false, message: "Calendly link must look like https://calendly.com/your-name/30min" };
  rows.push({ key: "calendly_url", value: calendly });

  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) return dbError(error.message);
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

// ---------------------------------------------------------------------------
// Starter content
// ---------------------------------------------------------------------------

export async function importStarterContent(): Promise<AdminResult> {
  const { supabase } = await requireAdmin();

  const designs = emailConcepts.map((c, i) => ({
    title: c.title,
    slug: c.key,
    kind: c.kind,
    email_type: c.emailType,
    tags: c.tags,
    description: c.description,
    objective: c.objective,
    creative_direction: c.creativeDirection,
    concept_template: c.key,
    is_concept: true,
    featured: i < 6,
    published: true,
    sort_order: i,
  }));
  const posts = starterPosts.map((p) => ({ ...p, status: "published", author_name: "Mailisto" }));

  const [d, p] = await Promise.all([
    supabase.from("email_designs").upsert(designs, { onConflict: "slug", ignoreDuplicates: true }),
    supabase.from("blog_posts").upsert(posts, { onConflict: "slug", ignoreDuplicates: true }),
  ]);
  if (d.error) return dbError(d.error.message);
  if (p.error) return dbError(p.error.message);

  // Hero slides have no natural unique key, so only seed them into an empty table.
  const { count } = await supabase.from("hero_slides").select("id", { count: "exact", head: true });
  if (!count) {
    const slides = defaultHeroSlides.map((s, i) => ({
      label: s.label,
      image_url: s.image_url ?? null,
      image_alt: s.image_alt ?? null,
      concept_template: s.concept_template ?? null,
      caption: s.caption,
      notes: s.notes,
      sort_order: i,
      published: true,
    }));
    const h = await supabase.from("hero_slides").insert(slides);
    if (h.error) return dbError(h.error.message);
  }

  refreshPublic("/blog", "/work");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Starter designs, hero slides and articles imported." };
}
