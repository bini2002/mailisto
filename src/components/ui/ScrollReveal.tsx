"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".reveal:not(.is-visible), .reveal-line:not(.is-visible)";

/**
 * Reveals `.reveal` / `.reveal-line` elements as they scroll into view.
 * Siblings get a small stagger. Content is only hidden once JS has run (html.js),
 * and everything shows immediately for users who prefer reduced motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const all = () => document.querySelectorAll<HTMLElement>(SELECTOR);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      all().forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observe = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (!el.style.getPropertyValue("--reveal-delay")) {
          const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("reveal"));
          const i = siblings.indexOf(el);
          if (i > 0) el.style.setProperty("--reveal-delay", `${(i % 4) * 90}ms`);
        }
        io.observe(el);
      });
    };

    observe(document);

    // Pick up elements added later (e.g. gallery filters).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observe(node.parentElement ?? document);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
