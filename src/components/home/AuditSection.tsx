import { AuditForm } from "../forms/AuditForm";
import { AuditTurnaround } from "./AuditTurnaround";

export const auditAreas = [
  "Account & list health",
  "Automated flows",
  "Email campaigns",
  "SMS program & consent",
  "Segmentation",
  "Deliverability & spam risk",
  "Design",
  "Copy & subject lines",
  "Revenue attribution",
  "Missing automations",
  "Repeat purchase & retention",
  "Testing opportunities",
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
              Free email &amp; SMS audit
            </p>
            <h2 id="audit-title" className="mt-5 text-h2 font-semibold">
              Your email and SMS are probably hiding money. <span className="text-lime">Let&rsquo;s find it.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-dark">
              Tell us about your store and we&rsquo;ll take an honest look at your email and SMS: what&rsquo;s working, what&rsquo;s broken, and what&rsquo;s quietly costing you sales.
            </p>

            <AuditTurnaround className="mt-10 max-w-lg" />

            <h3 className="label mt-12 text-white">What we look at</h3>
            <div className="mt-3">
              <AuditChecklist />
            </div>

            <h3 className="label mt-12 text-white">What you get</h3>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-white/85">
              <li className="flex gap-3">
                <span className="text-lime">→</span>A plain-English review of what&rsquo;s working and what isn&rsquo;t, within 48 hours.
              </li>
              <li className="flex gap-3">
                <span className="text-lime">→</span>Fixes ranked by how much money they could make, and how much effort they take.
              </li>
              <li className="flex gap-3">
                <span className="text-lime">→</span>Next steps you can act on yourself, or with us. No pressure either way.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:mr-auto lg:ml-0 lg:py-28 lg:pl-16 lg:pr-12">
            <div className="reveal lg:sticky lg:top-28">
              <h3 className="text-2xl font-semibold tracking-tight">Request your free audit</h3>
              <p className="mt-2 mb-8 text-muted">Two quick steps. About a minute. Less time than your coffee takes to cool down.</p>
              <AuditForm idPrefix="home-audit" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
