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
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={tone === "light" ? "/white-logo.png" : "/logo.png"}
        alt="Mailisto"
        width={300}
        height={200}
        priority={priority}
        className="w-40sm:h-8"
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
      width={160}
      height={40}
      className={cn("h-6 w-auto", className)}
    />
  );
}
