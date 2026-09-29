import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-xs font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:bg-lime-deep border border-lime hover:border-lime-deep",
  dark: "bg-ink text-white hover:bg-ink-4 border border-ink",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:bg-paper-2",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

/** `beam` adds the travelling "LED" light around the border (see .beam in globals.css). */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string, beam = false) {
  return cn(base, variants[variant], sizes[size], beam && `beam beam-${variant}`, className);
}

/** Small "48h" turnaround tag shown inside every audit CTA. */
export function AuditBadge({ tone = "dark", className }: { tone?: "dark" | "lime"; className?: string }) {
  return (
    <span className={cn("badge-48", tone === "lime" && "badge-48-lime", className)}>
      <span aria-hidden="true" className="badge-48-dot" />
      48h<span className="sr-only"> turnaround</span>
    </span>
  );
}

export function Arrow() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
      <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

interface LinkButtonProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  beam?: boolean;
  children: ReactNode;
}

/** The travelling light is reserved for the main CTA: links to the free audit get it by default. */
export function LinkButton({ variant = "primary", size = "md", className, arrow, beam, children, ...props }: LinkButtonProps) {
  const withBeam = beam ?? (typeof props.href === "string" && props.href.startsWith("/audit"));
  return (
    <Link className={buttonClasses(variant, size, className, withBeam)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  arrow?: boolean;
  beam?: boolean;
}

export function Button({ variant = "primary", size = "md", className, loading, arrow, beam = false, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className, beam)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Spinner />}
      {children}
      {arrow && !loading && <Arrow />}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn("size-4 animate-spin", className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
