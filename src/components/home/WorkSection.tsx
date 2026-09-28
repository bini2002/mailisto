import { getEmailDesigns, getPublishedCaseStudies } from "@/lib/data";
import { AuditBadge, LinkButton } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { CaseStudyCard } from "../work/CaseStudyCard";
import { EmailGallery } from "../work/EmailGallery";

export async function WorkSection() {
  const [designs, studies] = await Promise.all([getEmailDesigns(), getPublishedCaseStudies()]);
  const featured = [...designs].sort((a, b) => Number(b.featured) - Number(a.featured));
  const hasConcepts = designs.some((d) => d.is_concept);

  return (
    <section id="work" aria-labelledby="work-title" className="section-y border-t border-line bg-white">
      <div className="container-x">
        {/* Real case studies only appear once one has been published in the CMS. */}
        {studies.length > 0 && (
          <div className="mb-24">
            <SectionHeading index="05" label="Results" title="Selected client work." />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {studies.slice(0, 4).map((s) => (
                <CaseStudyCard key={s.id} study={s} />
              ))}
            </div>
          </div>
        )}

        <SectionHeading
          id="work-title"
          index={studies.length > 0 ? undefined : "05"}
          label="Design Lab"
          title={
            <>
              Email that looks good.
              <br className="hidden sm:block" /> Email that <span className="mark">sells.</span>
            </>
          }
          intro={
            <>
              <p>
                Original concepts from the Mailisto Design Lab. Each one is built around a specific commercial objective, not just an aesthetic.
              </p>
              {hasConcepts && (
                <p className="mt-4 text-sm">
                  <span className="label mr-2 border border-line-strong px-1.5 py-1 text-ink">Concept</span>
                  Fictional brands. Not client work.
                </p>
              )}
            </>
          }
        />

        <div className="mt-12">
          <EmailGallery designs={featured} limit={6} />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-lg text-muted">Want this level of thinking applied to your own flows and campaigns?</p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/work" variant="outline" arrow>
              See all concepts
            </LinkButton>
            <LinkButton href="/audit" arrow>
              Get a Free Audit
              <AuditBadge />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
