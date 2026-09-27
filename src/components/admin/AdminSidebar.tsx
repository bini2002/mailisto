"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "../ui/Logo";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads/audit", label: "Audit leads" },
  { href: "/admin/leads/contact", label: "Messages" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/designs", label: "Email designs" },
  { href: "/admin/case-studies", label: "Case studies" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({
  email,
  newLeads,
}: {
  email: string;
  newLeads: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="border-b border-line-dark bg-ink text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-r lg:border-b-0">
      <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-5">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Logo tone="light" />
        </Link>
        <button
          type="button"
          className="label border border-line-dark px-3 py-2 lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
      </div>
      <nav
        aria-label="Admin"
        className={cn("px-3 pb-4 lg:block", open ? "block" : "hidden")}
      >
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-ink-4 text-white"
                    : "text-white/70 hover:bg-ink-3 hover:text-white"
                )}
              >
                {item.label}
                {item.href === "/admin/leads/audit" && newLeads > 0 && (
                  <span className="bg-lime px-1.5 text-xs font-semibold text-ink">
                    {newLeads}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-line-dark px-3 pt-4 text-xs text-muted-dark lg:absolute lg:inset-x-3 lg:bottom-4">
          <p className="truncate">{email}</p>
          <div className="mt-3 flex gap-4">
            <Link href="/" target="_blank" className="hover:text-white">
              View site ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
    </aside>
  );
}
