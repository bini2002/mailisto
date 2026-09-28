import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand logo: /logo.png on light backgrounds, /white-logo.png on black/dark backgrounds. */
export function Logo({
  className,
  tone = "dark",
  priority = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Mailisto home"
      className={cn("inline-flex w-36 items-center", className)}
    >
      {/* Source files are 799×312; width is set by the wrapper, height follows. */}
      <Image
        src={tone === "light" ? "/white-logo.png" : "/logo.png"}
        alt="Mailisto"
        width={799}
        height={312}
        priority={priority}
        sizes="240px"
        className="h-auto w-full"
      />
    </Link>
  );
}

/** Logo image for places that aren't a link (e.g. the admin sidebar, which wraps it in its own link). */
export function LogoMark({
  tone = "light",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src={tone === "light" ? "/white-logo.png" : "/logo.png"}
      alt="Mailisto"
      width={799}
      height={312}
      sizes="160px"
      className={cn("h-auto w-32", className)}
    />
  );
}
