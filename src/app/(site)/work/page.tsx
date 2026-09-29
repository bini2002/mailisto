import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/layout/CTASection";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseStudyCard } from "@/components/work/CaseStudyCard";
import { EmailGallery } from "@/components/work/EmailGallery";
import { getEmailDesigns, getPublishedCaseStudies } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work: Email Design Concepts",
  description:
    "Email design concepts from the Mailisto Design Lab: welcome series, abandoned cart, post-purchase, win-back, launches and promotional campaigns, each built around a commercial objective.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: "Work | Mailisto" },
};

const questions = [
  { q: "Who is it for?", a: "A specific segment, defined by behaviour, not just “subscribers”." },
  { q: "What is its one job?", a: "One primary action. Everything in the email supports it." },
  { q: "Why now?", a: "A trigger, a moment or a reason that makes the email timely." },
  { q: "What will we learn?", a: "A metric that matters, and a test worth running next time." },
];

export default async function WorkPage() {
  const [designs, studies] = await Promise.all([getEmailDesigns(), getPublishedCaseStudies()]);
  const hasConcepts = designs.some((d) => d.is_concept);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <PageHeader
        label="Work"
        title={
          <>
            Email that looks good. <span className="mark">Email that sells.</span>
          </>
        }
        intro={
          hasConcepts ? (
            <p>
              The Mailisto Design Lab: original email concepts for fictional brands. They show how we think about design, copy and conversion. They are not client work.
            </p>
          ) : (
            <p>Selected email and SMS work.</p>
          )
        }
      />

      {studies.length > 0 && (
        <section aria-labelledby="studies-title" className="section-y border-b border-line bg-white">
          <div className="container-x">
            <SectionHeading id="studies-title" label="Case studies" title="Client results." align="stack" />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {studies.map((s) => (
                <CaseStudyCard key={s.id} study={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-label="Email designs" className="section-y">
        <div className="container-x">
          <EmailGallery designs={designs} />
        </div>
      </section>

      <section aria-labelledby="method-title" className="section-y border-t border-line bg-white">
        <div className="container-x">
          <SectionHeading
            id="method-title"
            label="Method"
            title="Four questions every email has to answer."
            intro={<p>Before anything is designed, it has to pass these. It&rsquo;s the difference between an email that looks good and one that sells.</p>}
          />
          <ol className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {questions.map((item, i) => (
              <li key={item.q} className="bg-white p-7">
                <span className="label text-muted">0{i + 1}</span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{item.q}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{item.a}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection title="Want this thinking applied to your store?" />
    </>
  );
}
