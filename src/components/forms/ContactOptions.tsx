"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

type Tab = "message" | "call";

/**
 * "Let's Talk": send a message, or book a call through Calendly.
 * The Calendly iframe only loads when the booking tab is opened, so the page stays fast.
 */
export function ContactOptions({ calendlyUrl }: { calendlyUrl: string | null }) {
  const [tab, setTab] = useState<Tab>("message");
  const id = useId();

  useEffect(() => {
    if (calendlyUrl && window.location.hash === "#book") setTab("call");
  }, [calendlyUrl]);

  if (!calendlyUrl) {
    return (
      <div className="border border-ink bg-white p-6 sm:p-10">
        <ContactForm />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; hint: string }[] = [
    { key: "message", label: "Send a message", hint: "We reply by email" },
    { key: "call", label: "Book a call", hint: "Pick a time that suits you" },
  ];

  const embed = `${calendlyUrl}?hide_gdpr_banner=1&hide_event_type_details=0&primary_color=b8fa3c&text_color=000000&background_color=ffffff`;

  return (
    <div className="border border-ink bg-white">
      <div role="tablist" aria-label="How would you like to talk?" className="grid grid-cols-2 border-b border-ink">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              id={`${id}-${t.key}-tab`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`${id}-${t.key}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  const next: Tab = t.key === "message" ? "call" : "message";
                  setTab(next);
                  document.getElementById(`${id}-${next}-tab`)?.focus();
                }
              }}
              className={cn(
                "relative px-4 py-4 text-left transition-colors sm:px-8 sm:py-5",
                active ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper",
              )}
            >
              <span className="block font-semibold tracking-tight">{t.label}</span>
              <span className={cn("mt-0.5 block text-xs", active ? "text-white/70" : "text-muted")}>{t.hint}</span>
              {active && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-lime" />}
            </button>
          );
        })}
      </div>

      <div id={`${id}-message-panel`} role="tabpanel" aria-labelledby={`${id}-message-tab`} hidden={tab !== "message"} className="p-6 sm:p-10">
        <ContactForm />
      </div>

      <div id={`${id}-call-panel`} role="tabpanel" aria-labelledby={`${id}-call-tab`} hidden={tab !== "call"}>
        {tab === "call" && (
          <>
            <iframe
              src={embed}
              title="Book a call with Mailisto (Calendly)"
              loading="lazy"
              className="block h-[720px] w-full border-0"
            />
            <p className="border-t border-line px-6 py-4 text-sm text-muted sm:px-10">
              Calendar not loading?{" "}
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-lime decoration-2 underline-offset-4">
                Open it in Calendly ↗
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
