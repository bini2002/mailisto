import Link from "next/link";
import { auditCta, mainNav } from "@/lib/site";
import { AuditBadge, LinkButton } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className="container-x flex h-16 items-center justify-between gap-4"
      >
        <Logo className="w-28 min-[380px]:w-32 sm:w-40" priority />
        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-xs px-3.5 py-2 text-[0.92rem] text-ink/75 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <LinkButton href={auditCta.href} size="sm" arrow>
              {auditCta.label}
              <AuditBadge />
            </LinkButton>
          </span>
          <LinkButton href={auditCta.href} size="sm" className="gap-1.5 px-3 sm:hidden">
            Free Audit
            <AuditBadge className="max-[379px]:hidden" />
          </LinkButton>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
