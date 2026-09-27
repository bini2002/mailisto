import type { MetadataRoute } from "next";
import { getPublishedCaseStudies, getPublishedPosts } from "@/lib/data";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, studies] = await Promise.all([getPublishedPosts(), getPublishedCaseStudies()]);
  const now = new Date();
  const fixed: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/audit`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...fixed,
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.updated_at || p.published_at || now), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...studies.map((s) => ({ url: `${site.url}/work/${s.slug}`, lastModified: new Date(s.updated_at), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
