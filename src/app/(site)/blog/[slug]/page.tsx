import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { AuditBadge, LinkButton } from "@/components/ui/Button";
import { getPostBySlug, getPublishedPosts } from "@/lib/data";
import { Markdown, extractHeadings } from "@/lib/markdown";
import { site } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  const image = post.og_image_url || post.featured_image_url;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title,
      description,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      section: post.category ?? undefined,
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const related = (await getPublishedPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author_name, url: site.url },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    image: post.og_image_url || post.featured_image_url || `${site.url}/opengraph-image`,
    articleSection: post.category ?? undefined,
  };

  return (
    <>
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article>
        <header className="border-b border-line">
          <div className="container-x hero-in pt-12 pb-14 sm:pt-16">
            <nav aria-label="Breadcrumb" className="label text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/blog" className="hover:text-ink">
                    Blog
                  </Link>
                </li>
                {post.category && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li className="text-ink">{post.category}</li>
                  </>
                )}
              </ol>
            </nav>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.2rem,1.4rem+3.2vw,4.2rem)] leading-[1.05] font-semibold">{post.title}</h1>
            {post.excerpt && <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">{post.excerpt}</p>}
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span>By {post.author_name}</span>
              <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
              <span>{readingTime(post.content)} min read</span>
            </p>
          </div>
        </header>

        {post.featured_image_url && (
          <div className="container-x pt-10">
            <Image
              src={post.featured_image_url}
              alt={post.featured_image_alt || ""}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1400px) 1300px, 100vw"
              className="h-auto w-full border border-line"
            />
          </div>
        )}

        <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
          {headings.length > 2 && (
            <aside className="hidden lg:col-span-3 lg:block">
              <nav aria-label="On this page" className="sticky top-28">
                <p className="label text-muted">On this page</p>
                <ol className="mt-4 space-y-2.5 border-l border-line text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted hover:border-ink hover:text-ink">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
          <div className={headings.length > 2 ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3"}>
            <div className="prose-m max-w-[42rem]">
              <Markdown source={post.content} />
            </div>

            <aside aria-label="Free audit" className="mt-16 max-w-[42rem] bg-ink p-8 text-white sm:p-10">
              <p className="label text-lime">Free email &amp; SMS revenue audit</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight">Want us to look at your account?</p>
              <p className="mt-3 text-muted-dark">We&rsquo;ll review your flows, campaigns, segmentation and deliverability, and send back prioritised recommendations within 48 hours.</p>
              <LinkButton href="/audit" className="mt-6" arrow>
                Get a Free Audit
                <AuditBadge />
              </LinkButton>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y border-t border-line bg-white">
          <div className="container-x">
            <h2 id="related-title" className="text-3xl font-semibold">
              Keep reading
            </h2>
            <div className="mt-12">
              <BlogGrid posts={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
