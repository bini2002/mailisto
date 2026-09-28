"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { auditCta, mainNav, talkCta } from "@/lib/site";
import { AuditBadge, buttonClasses } from "../ui/Button";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close whenever the route changes (including hash links to the same page).
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [buttonRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="relative z-50 inline-flex size-10 items-center justify-center rounded-xs border border-line-strong bg-paper text-ink"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="relative block h-3 w-4">
          <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-200 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-200 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-paper"
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-6">
          <ul className="divide-y divide-line border-b border-line">
            {mainNav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4 text-2xl font-medium tracking-tight">
                  {item.label}
                  <span className="label text-muted">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href={auditCta.href} onClick={() => setOpen(false)} className={buttonClasses("primary", "lg", "w-full", true)}>
              {auditCta.label}
              <AuditBadge />
            </Link>
            <Link href={talkCta.href} onClick={() => setOpen(false)} className={buttonClasses("outline", "lg", "w-full", true)}>
              {talkCta.label}
            </Link>
          </div>
          <p className="mt-auto pt-10 text-sm text-muted">Klaviyo email marketing for Shopify brands.</p>
        </nav>
      </div>
    </div>
  );
}
