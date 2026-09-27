import type { DesignView } from "@/lib/data";
import { DesignPreview } from "./DesignPreview";

export function DesignBadge({ design }: { design: DesignView }) {
  return design.is_concept ? (
    <span className="label inline-flex items-center border border-line-strong bg-white px-2 py-1.5 text-ink">Concept</span>
  ) : (
    <span className="label inline-flex items-center bg-ink px-2 py-1.5 text-lime">Client work</span>
  );
}

/** Whole card is clickable via a stretched button in the title (keeps valid, accessible markup). */
export function EmailCard({ design, onOpen, priority }: { design: DesignView; onOpen: () => void; priority?: boolean }) {
  return (
    <article className="group relative">
      <div className="relative overflow-hidden border border-line bg-white p-3 transition-colors group-hover:border-ink sm:p-4">
        <div className="overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <DesignPreview design={design} mode="card" priority={priority} />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
            <DesignBadge design={design} />
            <span>
              {design.kind === "flow" ? "Flow" : "Campaign"} · {design.email_type}
            </span>
          </p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight">
            <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ink">
              {design.title}
              <span className="sr-only">{design.is_concept ? " (concept). View details" : ". View details"}</span>
            </button>
          </h3>
          {design.objective && <p className="mt-1 text-sm text-muted">{design.objective}</p>}
        </div>
        <span aria-hidden="true" className="mt-1 inline-flex size-8 shrink-0 items-center justify-center border border-line transition-colors group-hover:border-ink group-hover:bg-lime">
          +
        </span>
      </div>
    </article>
  );
}
