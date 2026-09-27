import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const results = (study.results ?? []).slice(0, 3);
  return (
    <article className="group relative flex flex-col border border-line bg-white transition-colors hover:border-ink">
      {study.cover_image_url && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-paper-2">
          <Image src={study.cover_image_url} alt={study.cover_image_alt || `${study.client_name} case study`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="label text-muted">
          {study.client_name}
          {study.industry ? ` · ${study.industry}` : ""}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          <Link href={`/work/${study.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {study.title}
          </Link>
        </h3>
        {study.summary && <p className="mt-3 text-muted">{study.summary}</p>}
        {results.length > 0 && (
          <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-line pt-6">
            {results.map((r) => (
              <div key={r.label}>
                <dt className="label text-muted">{r.label}</dt>
                <dd className="mt-2 text-xl font-semibold tracking-tight">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
