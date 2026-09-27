import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark: "mailisto" with a lime square as the mark (an envelope reduced to its simplest form). */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="Mailisto home" className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("text-[1.3rem] font-semibold tracking-[-0.04em]", tone === "light" ? "text-white" : "text-ink")}>mailisto</span>
    </Link>
  );
}

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#B8FA3C" />
      <path d="M5 8l7 5 7-5" fill="none" stroke="#000" strokeWidth="2" />
    </svg>
  );
}
