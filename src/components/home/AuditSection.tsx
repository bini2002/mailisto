import { AuditForm } from "../forms/AuditForm";
import { AuditTurnaround } from "./AuditTurnaround";

export const auditAreas = [
  "Account structure",
  "Lifecycle flows",
  "Campaign strategy",
  "Segmentation",
  "Deliverability",
  "Email design",
  "Copy & subject lines",
  "Revenue attribution",
  "Automation gaps",
  "Testing opportunities",
  "Retention & repeat purchase",
];

export function AuditChecklist({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <ul className={`grid grid-cols-1 gap-x-8 sm:grid-cols-2 ${tone === "dark" ? "text-white/85" : "text-ink"}`}>
      {auditAreas.map((a) => (
        <li key={a} className={`reveal flex items-center gap-3 border-b py-3 text-[0.95rem] ${tone === "dark" ? "border-line-dark" : "border-line"}`}>
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-lime" />
          {a}
        </li>
      ))}
    </ul>
  );
}

export function AuditSection() {
  return (
    <section id="audit" aria-labelledby="audit-title" className="scroll-mt-16 border-t border-ink">
      <div className="grid lg:grid-cols-2">
        <div className="bg-ink text-white">
          <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8 lg:ml-auto lg:mr-0 lg:py-28 lg:pr-16 lg:pl-12 xl:pl-12">
            <p className="label flex items-center gap-3 text-muted-dark">
              <span className="text-lime">06</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-dark" />
              Free Klaviyo revenue audit
            </p>
            <h2 id="audit-title" className="mt-5 text-h2 font-semibold">
              Your Klaviyo account probably has revenue <span className="text-lime">hiding in it.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-dark">
              Get a practical review of your email program. We&rsquo;ll show you where flows, campaigns, segmentation, deliverability and lifecycle strategy could be earning more.
            </p>

            <AuditTurnaround className="mt-10 max-w-lg" />

            <h3 className="label mt-12 text-white">What we look at</h3>
            <div className="mt-3">
              <AuditChecklist />
            </div>

            <h3 className="label mt-12 text-white">What you get</h3>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-white/85">
              <li className="flex gap-3">
                <span className="text-lime">→</span>A written review of what&rsquo;s working and what isn&rsquo;t, within 48 hours.
              </li>
              <li className="flex gap-3">
                <span className="text-lime">→</span>Recommendations ranked by likely revenue impact and effort.
              </li>
              <li className="flex gap-3">
                <span className="text-lime">→</span>Clear next steps you can act on, with or without us.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:mr-auto lg:ml-0 lg:py-28 lg:pl-16 lg:pr-12">
            <div className="reveal lg:sticky lg:top-28">
              <h3 className="text-2xl font-semibold tracking-tight">Request your free audit</h3>
              <p className="mt-2 mb-8 text-muted">Two quick steps. About a minute. Findings within 48 hours.</p>
              <AuditForm idPrefix="home-audit" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
