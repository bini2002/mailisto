import type { Metadata } from "next";
import { AuditForm } from "@/components/forms/AuditForm";
import { AuditChecklist } from "@/components/home/AuditSection";
import { AuditTurnaround } from "@/components/home/AuditTurnaround";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Free Klaviyo Revenue Audit",
  description:
    "Get a free, practical audit of your Klaviyo account within 48 hours. We review flows, campaigns, segmentation, deliverability and creative, then send prioritised recommendations.",
  alternates: { canonical: "/audit" },
  openGraph: { url: "/audit", title: "Free Klaviyo Revenue Audit | Mailisto" },
};

const steps = [
  { t: "You send the basics", d: "Two short steps: who you are, and a little about your store." },
  { t: "We review your account", d: "With a read-only Klaviyo user, we work through flows, campaigns, segments, deliverability and creative." },
  { t: "You get the findings in 48 hours", d: "Within 48 hours of access: a clear write-up with recommendations ranked by likely revenue impact and effort." },
];

export default function AuditPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Free Klaviyo audit", path: "/audit" }])} />
      <section className="border-b border-line">
        <div className="container-x grid gap-12 pt-12 pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12 lg:pt-20 lg:pb-28">
          <div className="hero-in lg:col-span-6 lg:row-start-1">
            <p className="label flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="size-2 bg-lime ring-1 ring-ink/20" />
              Free Klaviyo revenue audit
            </p>
            <h1 className="mt-6 text-[clamp(2.4rem,1.5rem+3.6vw,4.4rem)] leading-[1.03] font-semibold">
              Find the revenue your email program is <span className="mark">leaving behind.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              A practical, specific review of your Klaviyo account by people who only do ecommerce email. Not a sales call dressed up as an audit.
            </p>
            <AuditTurnaround tone="light" className="mt-8 max-w-xl" />
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <div className="border border-ink bg-white p-6 sm:p-10 lg:sticky lg:top-24">
              <h2 className="text-2xl font-semibold tracking-tight">Request your free audit</h2>
              <p className="mt-2 mb-8 text-muted">Takes about a minute. Findings within 48 hours. No obligation.</p>
              <AuditForm idPrefix="page-audit" />
            </div>
          </div>

          <div className="lg:col-span-6 lg:row-start-2">
            <ol className="border-t border-ink">
              {steps.map((s, i) => (
                <li key={s.t} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-5">
                  <span className="label pt-1.5 text-muted">0{i + 1}</span>
                  <div>
                    <h2 className="font-semibold">{s.t}</h2>
                    <p className="mt-1 text-[0.95rem] text-muted">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="label mt-12 text-ink">What we look at</h2>
            <div className="mt-3">
              <AuditChecklist tone="light" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
