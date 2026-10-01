import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { CTASection } from "@/components/layout/CTASection";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { EmptyState } from "@/components/ui/States";
import { getPublishedPosts } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog: Email & SMS Marketing for Ecommerce",
  description:
    "Practical articles on email and SMS flows, campaigns, segmentation, deliverability and retention for Shopify and ecommerce brands.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Blog | Mailisto" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <PageHeader
        label="Blog"
        title="Email, SMS and retention, explained properly."
        intro={<p>Practical notes for founders and ecommerce teams who want email to pull its weight.</p>}
      />
      <section className="section-y">
        <div className="container-x">
          {!featured ? (
            <EmptyState title="Articles are on the way.">New articles will appear here soon.</EmptyState>
          ) : (
            <>
              <div className="max-w-4xl">
                <BlogCard post={featured} large />
              </div>
              {rest.length > 0 && (
                <div className="mt-20">
                  <BlogGrid posts={rest} />
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <CTASection />
    </>
  );
}
