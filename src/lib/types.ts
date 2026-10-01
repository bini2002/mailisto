export type PostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  category: string | null;
  author_name: string;
  status: PostStatus;
  featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type DesignKind = "campaign" | "flow";
export const DESIGN_TAGS = ["product", "promotional", "welcome", "retention"] as const;
export type DesignTag = (typeof DESIGN_TAGS)[number];

export interface EmailDesign {
  id: string;
  title: string;
  slug: string;
  kind: DesignKind;
  email_type: string;
  tags: string[];
  description: string | null;
  objective: string | null;
  creative_direction: string | null;
  image_url: string | null;
  image_alt: string | null;
  concept_template: string | null;
  is_concept: boolean;
  client_name: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyResult {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string | null;
  summary: string | null;
  challenge: string | null;
  strategy: string | null;
  implementation: string | null;
  results: CaseStudyResult[];
  revenue_attribution: string | null;
  before_state: string | null;
  after_state: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  screenshots: string[];
  testimonial_quote: string | null;
  testimonial_author: string | null;
  testimonial_role: string | null;
  project_date: string | null;
  status: PostStatus;
  featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export const AUDIT_STATUSES = ["new", "contacted", "in_progress", "audit_sent", "won", "lost", "archived"] as const;
export type AuditStatus = (typeof AUDIT_STATUSES)[number];

export interface AuditSubmission {
  id: string;
  name: string;
  email: string;
  store_url: string;
  revenue_range: string;
  platform: string;
  list_size: string;
  challenge: string;
  details: string | null;
  status: AuditStatus;
  admin_notes: string | null;
  created_at: string;
}

export const CONTACT_STATUSES = ["new", "replied", "archived"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  store_url: string | null;
  message: string;
  status: ContactStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  label: string | null;
  image_url: string | null;
  image_alt: string | null;
  concept_template: string | null;
  caption: string | null;
  notes: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type SiteSettings = Partial<Record<"contact_email" | "linkedin_url" | "instagram_url" | "x_url" | "calendly_url" | "hero_video_url" | "hero_video_poster", string>>;
