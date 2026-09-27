import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  index?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "split" | "stack";
  className?: string;
  id?: string;
}

/**
 * Section header: a small indexed label, a large headline, and an optional intro.
 * "split" puts the intro in a second column on desktop (editorial layout).
 */
export function SectionHeading({ index, label, title, intro, tone = "light", align = "split", className, id }: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn("grid gap-6", align === "split" && "lg:grid-cols-12 lg:gap-12", className)}>
      <div className={cn(align === "split" && "lg:col-span-7")}>
        <p className={cn("label flex items-center gap-3", dark ? "text-muted-dark" : "text-muted")}>
          {index && <span className={cn(dark ? "text-lime" : "text-ink")}>{index}</span>}
          <span aria-hidden="true" className={cn("h-px w-8", dark ? "bg-line-dark" : "bg-line-strong")} />
          {label}
        </p>
        <h2 id={id} className={cn("mt-5 text-h2 font-semibold", dark ? "text-white" : "text-ink")}>
          {title}
        </h2>
      </div>
      {intro && (
        <div className={cn(align === "split" ? "lg:col-span-5 lg:self-end" : "max-w-2xl")}>
          <div className={cn("text-[1.05rem] leading-relaxed", dark ? "text-muted-dark" : "text-muted")}>{intro}</div>
        </div>
      )}
    </div>
  );
}
