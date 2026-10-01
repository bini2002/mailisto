"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlideView } from "@/lib/data";
import { cn } from "@/lib/utils";
import { EmailMock } from "../email/EmailMock";

const INTERVAL_MS = 5200;

/**
 * Hero designs that dissolve from one to the next. Managed in Admin → Hero slides.
 * Pauses on hover/focus and when the tab is hidden; no autoplay for reduced-motion users (dots still work).
 * All slides share one grid cell, so the height never jumps between slides.
 */
export function HeroSlider({ slides }: { slides: HeroSlideView[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const count = slides.length;

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!reduce.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  // Pause while the tab is in the background.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // One timer per slide, so manual clicks and the progress bar always stay in sync.
  const running = autoplay && !paused && visible && count > 1;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(next, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [running, active, next]);

  if (count === 0) return null;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Example email designs"
      className="relative mx-auto max-w-[27rem] lg:mx-0 lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {/* Label row */}
      <div className="label mb-3 grid text-muted">
        {slides.map((s, i) => (
          <span key={s.id} aria-hidden={i !== active} className={cn("dissolve [grid-area:1/1]", i === active && "is-active")}>
            {s.label}
          </span>
        ))}
      </div>

      {/* Designs */}
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== active}
            className={cn("dissolve absolute inset-0", i === active && "is-active")}
          >
            {s.image_url ? (
              <Image
                src={s.image_url}
                alt={s.image_alt || s.label || "Email design"}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 27rem, 100vw"
                className="object-contain"
              />
            ) : s.concept ? (
              <div
                role="img"
                aria-label={s.image_alt || `${s.concept.emailType} email design for ${s.concept.brand} (fictional brand)`}
                className="absolute inset-x-[12%] top-[5%] border border-line bg-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]"
              >
                <div aria-hidden="true">
                  <EmailMock concept={s.concept} />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Caption + notes */}
      <div className="mt-5 grid border-t border-line pt-4">
        {slides.map((s, i) => (
          <div key={s.id} aria-hidden={i !== active} className={cn("dissolve [grid-area:1/1]", i === active && "is-active")}>
            {s.caption && <span className="label text-muted">{s.caption}</span>}
            {s.notes.length > 0 && (
              <ol className="mt-3 space-y-2 text-sm">
                {s.notes.map((note, n) => (
                  <li key={n} className="flex gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.65rem] font-semibold text-white">
                      {n + 1}
                    </span>
                    <span className="text-ink/80">{note}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-5 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show design ${i + 1}${s.label ? `: ${s.label}` : ""}`}
              aria-current={i === active}
              className="group flex h-6 items-center"
            >
              <span
                className={cn(
                  "relative block h-[3px] overflow-hidden bg-line-strong transition-[width] duration-500",
                  i === active ? "w-10" : "w-4 group-hover:bg-ink/40",
                )}
              >
                {i === active && (
                  <span
                    key={`${active}-${running}`}
                    className={cn("absolute inset-y-0 left-0 bg-ink", running ? "slide-progress" : "w-full")}
                    style={{ animationDuration: `${INTERVAL_MS}ms` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
