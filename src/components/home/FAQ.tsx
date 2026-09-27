import { PiPlusLight } from "react-icons/pi";

export const faqs = [
  {
    q: "Is the audit actually free?",
    a: "Yes. You get a practical review of your Klaviyo account with prioritised recommendations. There's no obligation to work with us afterwards.",
  },
  {
    q: "What access do you need for the audit?",
    a: "Usually a read-only user on your Klaviyo account, which you can add and remove yourself in a couple of minutes. We'll confirm exactly what we need when we reply.",
  },
  {
    q: "Do you only work with Klaviyo?",
    a: "Klaviyo is our specialism, and it's where we do our best work. If you're on another platform, we can help you plan and run a migration to Klaviyo.",
  },
  {
    q: "Do we need to be on Shopify?",
    a: "Most of the brands we're built for run on Shopify, and Klaviyo's Shopify integration is where we're strongest. If you're on another ecommerce platform that integrates with Klaviyo, get in touch.",
  },
  {
    q: "What size of brand do you work with?",
    a: "Established ecommerce brands with real customer data to work with: an existing list, regular orders and products people buy more than once are ideal.",
  },
  {
    q: "Where are your clients based?",
    a: "We work remotely with brands in the UK, US, Australia, Canada and elsewhere.",
  },
  {
    q: "Do you also run ads, SEO or social?",
    a: "No. We focus entirely on email and the Klaviyo platform. That focus is the point.",
  },
];

export function FAQ() {
  return (
    <section aria-labelledby="faq-title" className="section-y border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label flex items-center gap-3 text-muted">
            <span className="text-ink">09</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            Questions
          </p>
          <h2 id="faq-title" className="mt-5 text-h2 font-semibold">
            Good questions to ask.
          </h2>
        </div>
        <div className="border-t border-ink lg:col-span-8">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                {f.q}
                <PiPlusLight aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="max-w-2xl pb-6 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
