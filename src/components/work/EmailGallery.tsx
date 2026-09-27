"use client";

import { useMemo, useState } from "react";
import type { DesignView } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Modal } from "../ui/Modal";
import { DesignBadge, EmailCard } from "./EmailCard";
import { DesignPreview } from "./DesignPreview";

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "campaigns", label: "Campaigns", test: (d: DesignView) => d.kind === "campaign" },
  { id: "flows", label: "Flows", test: (d: DesignView) => d.kind === "flow" },
  { id: "product", label: "Product", test: (d: DesignView) => d.tags.includes("product") },
  { id: "promotional", label: "Promotional", test: (d: DesignView) => d.tags.includes("promotional") },
  { id: "welcome", label: "Welcome", test: (d: DesignView) => d.tags.includes("welcome") },
  { id: "retention", label: "Retention", test: (d: DesignView) => d.tags.includes("retention") },
] as const;

export function EmailGallery({ designs, limit, showFilters = true }: { designs: DesignView[]; limit?: number; showFilters?: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [active, setActive] = useState<DesignView | null>(null);

  const available = useMemo(() => FILTERS.filter((f) => f.id === "all" || designs.some(f.test)), [designs]);
  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter) ?? FILTERS[0];
    const list = designs.filter(f.test);
    return limit ? list.slice(0, limit) : list;
  }, [designs, filter, limit]);

  return (
    <div>
      {showFilters && available.length > 2 && (
        <div role="group" aria-label="Filter designs" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {available.map((f) => {
            const count = designs.filter(f.test).length;
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 border px-4 text-sm transition-colors",
                  on ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink hover:border-ink",
                )}
              >
                {f.label}
                <span className={cn("text-xs tabular-nums", on ? "text-lime" : "text-muted")}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} designs
      </p>

      {/* Mobile: swipeable row that keeps each email at a readable size. Tablet+: editorial grid. */}
      <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
        {visible.map((d, i) => (
          <div key={d.id} className="w-[84%] shrink-0 snap-start sm:w-auto">
            <EmailCard design={d} onOpen={() => setActive(d)} priority={i < 2} />
          </div>
        ))}
      </div>
      {visible.length > 1 && <p className="mt-2 text-xs text-muted sm:hidden">Swipe to see more →</p>}

      <Modal open={!!active} onClose={() => setActive(null)} title={active ? `${active.is_concept ? "Design Lab concept" : "Client work"} · ${active.email_type}` : ""}>
        {active && <DesignDetail design={active} />}
      </Modal>
    </div>
  );
}

function DesignDetail({ design }: { design: DesignView }) {
  const c = design.concept;
  return (
    <div className="grid md:grid-cols-12">
      <div className="bg-paper-2 p-4 sm:p-8 md:col-span-7">
        <div className="mx-auto max-w-[600px] border border-line bg-white">
          {c && (
            <div className="border-b border-line px-4 py-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="font-semibold">{c.brand}</span>
                <span className="label text-muted">Inbox preview</span>
              </p>
              <p className="font-medium">{c.subject}</p>
              <p className="text-muted">{c.preheader}</p>
            </div>
          )}
          <DesignPreview design={design} mode="full" />
        </div>
      </div>
      <div className="p-6 sm:p-8 md:col-span-5">
        <DesignBadge design={design} />
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">{design.title}</h2>
        <p className="label mt-3 text-muted">
          {design.kind === "flow" ? "Flow" : "Campaign"} · {design.email_type}
          {c ? ` · ${c.brand} (fictional)` : design.client_name ? ` · ${design.client_name}` : ""}
        </p>
        <dl className="mt-8 space-y-6 border-t border-line pt-6">
          {design.objective && <Detail term="Objective">{design.objective}</Detail>}
          {design.description && <Detail term="The thinking">{design.description}</Detail>}
          {design.creative_direction && <Detail term="Creative direction">{design.creative_direction}</Detail>}
          {c && (
            <Detail term="Subject line">
              <span className="font-medium text-ink">{c.subject}</span>
              <br />
              <span className="text-muted">Preview: {c.preheader}</span>
            </Detail>
          )}
        </dl>
        {design.is_concept && (
          <p className="mt-8 border-l-2 border-lime pl-4 text-sm text-muted">
            This is an original Mailisto Design Lab concept for a fictional brand. It shows our approach, not a client result.
          </p>
        )}
      </div>
    </div>
  );
}

function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label text-muted">{term}</dt>
      <dd className="mt-2 text-[0.95rem] leading-relaxed">{children}</dd>
    </div>
  );
}
