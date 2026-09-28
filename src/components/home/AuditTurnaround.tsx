import { cn } from "@/lib/utils";

const stops = [
  { at: "Hour 0", label: "You request the audit" },
  { at: "Access", label: "Read-only Klaviyo user added" },
  { at: "Hour 48", label: "Written findings in your inbox" },
];

/** The 48-hour audit promise, drawn as a short timeline. The lime line "fills" as it scrolls into view. */
export function AuditTurnaround({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={cn("reveal border p-5 sm:p-6", dark ? "border-line-dark bg-ink-3" : "border-line bg-white", className)}>
      <div className="flex items-end justify-between gap-4">
        <p className={cn("text-5xl leading-none font-semibold tracking-[-0.04em] sm:text-6xl", dark ? "text-lime" : "text-ink")}>
          48<span className="text-[0.55em]">h</span>
        </p>
        <p className={cn("label max-w-[12rem] text-right leading-relaxed", dark ? "text-white" : "text-ink")}>From access to your written audit</p>
      </div>

      <div className="relative mt-7">
        <span aria-hidden="true" className={cn("absolute top-[5px] right-0 left-0 h-px", dark ? "bg-line-dark" : "bg-line-strong")} />
        <span aria-hidden="true" className="reveal-line absolute top-[4px] right-0 left-0 h-[3px] bg-lime" />
        <ol className="relative grid grid-cols-3 gap-3">
          {stops.map((s, i) => (
            <li key={s.at} className={cn(i === 1 && "text-center", i === 2 && "text-right")}>
              <span
                aria-hidden="true"
                className={cn(
                  "block size-[11px] border-2 border-lime",
                  i === 1 && "mx-auto",
                  i === 2 && "ml-auto bg-lime",
                  i !== 2 && (dark ? "bg-ink-3" : "bg-white"),
                )}
              />
              <span className={cn("label mt-3 block", dark ? "text-lime" : "text-ink")}>{s.at}</span>
              <span className={cn("mt-1 block text-xs leading-snug sm:text-[0.8rem]", dark ? "text-white/70" : "text-muted")}>{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
