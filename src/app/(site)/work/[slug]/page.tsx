import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/layout/CTASection";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const studies = await getPublishedCaseStudies();
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study not found", robots: { index: false } };
  const title = study.seo_title || `${study.title}: ${study.client_name} case study`;
  const description = study.seo_description || study.summary || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { type: "article", url: `/work/${study.slug}`, title, description, images: study.cover_image_url ? [study.cover_image_url] : undefined },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-12">
      <h2 className="label pt-1 text-muted lg:col-span-3">{title}</h2>
      <div className="text-lg leading-relaxed whitespace-pre-line lg:col-span-9">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: study.title, path: `/work/${study.slug}` },
        ])}
      />
      <article>
        <header className="border-b border-line">
          <div className="container-x hero-in pt-14 pb-14 sm:pt-20">
            <p className="label text-muted">
              Case study · {study.client_name}
              {study.industry ? ` · ${study.industry}` : ""}
              {study.project_date ? ` · ${formatDate(study.project_date, { day: undefined })}` : ""}
            </p>
            <h1 className="mt-6 max-w-5xl text-display font-semibold">{study.title}</h1>
            {study.summary && <p className="mt-6 max-w-2xl text-lg text-muted">{study.summary}</p>}
          </div>
        </header>

        {study.results.length > 0 && (
          <div className="bg-ink text-white">
            <dl className="container-x grid gap-px py-12 sm:grid-cols-2 lg:grid-cols-4">
              {study.results.map((r) => (
                <div key={r.label} className="py-4 sm:pr-6">
                  <dt className="label text-muted-dark">{r.label}</dt>
                  <dd className="mt-3 text-4xl font-semibold tracking-tight text-lime">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {study.cover_image_url && (
          <div className="container-x pt-12">
            <Image
              src={study.cover_image_url}
              alt={study.cover_image_alt || `${study.client_name} email program`}
              width={1600}
              height={900}
              sizes="(min-width: 1400px) 1300px, 100vw"
              className="h-auto w-full border border-line"
              priority
            />
          </div>
        )}

        <div className="container-x py-12">
          {study.challenge && <Block title="The challenge">{study.challenge}</Block>}
          {study.strategy && <Block title="Strategy">{study.strategy}</Block>}
          {study.implementation && <Block title="Implementation">{study.implementation}</Block>}
          {(study.before_state || study.after_state) && (
            <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-12">
              <h2 className="label pt-1 text-muted lg:col-span-3">Before &amp; after</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-9">
                {study.before_state && (
                  <div className="border border-line p-6">
                    <p className="label text-muted">Before</p>
                    <p className="mt-3 whitespace-pre-line">{study.before_state}</p>
                  </div>
                )}
                {study.after_state && (
                  <div className="border border-ink p-6">
                    <p className="label text-muted">After</p>
                    <p className="mt-3 whitespace-pre-line">{study.after_state}</p>
                  </div>
                )}
              </div>
            </section>
          )}
          {study.revenue_attribution && <Block title="How results were measured">{study.revenue_attribution}</Block>}

          {study.screenshots.length > 0 && (
            <section className="border-t border-line py-10">
              <h2 className="label text-muted">Selected emails</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {study.screenshots.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${study.client_name} email ${i + 1}`}
                    width={800}
                    height={1600}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full border border-line"
                  />
                ))}
              </div>
            </section>
          )}

          {study.testimonial_quote && (
            <figure className="border-t border-line py-14">
              <blockquote className="max-w-4xl text-3xl leading-snug font-medium tracking-tight">&ldquo;{study.testimonial_quote}&rdquo;</blockquote>
              {study.testimonial_author && (
                <figcaption className="mt-6 text-muted">
                  {study.testimonial_author}
                  {study.testimonial_role ? `, ${study.testimonial_role}` : ""}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </article>
      <CTASection />
    </>
  );
}
