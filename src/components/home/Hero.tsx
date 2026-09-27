import { auditCta, talkCta } from "@/lib/site";
import { LinkButton } from "../ui/Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      {/* Structural grid lines: the site's quiet "technical" motif. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="container-x h-full">
          <div className="grid h-full grid-cols-12">
            <div className="col-start-8 border-l border-line" />
          </div>
        </div>
      </div>

      <div className="container-x relative grid gap-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-12 lg:gap-0 lg:pt-24 lg:pb-24">
        <div className="hero-in flex flex-col justify-center lg:col-span-7 lg:pr-16">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
            <span className="inline-flex items-center gap-2 text-ink">
              <span aria-hidden="true" className="size-2 bg-lime ring-1 ring-ink/20" />
              Klaviyo email agency
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            For Shopify brands
          </p>

          <h1 id="hero-title" className="mt-7 text-display font-semibold">
            Your email list should be making you <span className="mark">more money.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-[1.2rem]">
            Mailisto builds and runs the Klaviyo flows, campaigns and segmentation that turn your customer data into repeat purchases, and revenue you can measure.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={auditCta.href} size="lg" arrow>
              {auditCta.label}
            </LinkButton>
            <LinkButton href={talkCta.href} size="lg" variant="outline">
              {talkCta.label}
            </LinkButton>
          </div>

          <p className="mt-5 text-sm text-muted">A free, practical review of your Klaviyo account. No obligation.</p>
        </div>

        <div className="lg:col-span-5 lg:pl-12">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
