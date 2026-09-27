import { Markdown } from "@/lib/markdown";
import { PageHeader } from "./PageHeader";

export function LegalPage({ title, updated, source }: { title: string; updated: string; source: string }) {
  return (
    <>
      <PageHeader label="Legal" title={title} intro={<p>Last updated: {updated}</p>} />
      <div className="container-x py-16 lg:py-20">
        <div className="prose-m max-w-[46rem]">
          <Markdown source={source} />
        </div>
      </div>
    </>
  );
}
