import { getHeroVideo } from "@/lib/data";
import { auditCta, talkCta } from "@/lib/site";
import { AuditBadge, LinkButton } from "../ui/Button";
import { DotWave } from "./DotWave";
import { HeroVideo } from "./HeroVideo";

export async function Hero() {
  const video = await getHeroVideo();

  return (
    // No overflow clipping on the section: the video stage below is position: sticky.
    <section aria-labelledby="hero-title" className="relative border-b border-line">
      <div className="relative overflow-hidden">
        <DotWave className="pointer-events-none absolute text-ink inset-x-0 bottom-0 h-[78%] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]" />

        <div className="container-x hero-in relative flex flex-col items-center pt-14 pb-10 text-center sm:pt-20 sm:pb-12">
          <p className="label inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-line-strong bg-paper px-4 py-2 text-muted sm:rounded-full">
            <span className="inline-flex items-center gap-2 text-ink">
              <span aria-hidden="true" className="size-2 bg-lime ring-1 ring-ink/20" />
              Email &amp; SMS agency
            </span>
            <span aria-hidden="true" className="hidden h-px w-6 bg-line-strong sm:block" />
            For Shopify brands
          </p>

          <h1 id="hero-title" className="mt-7 max-w-5xl text-[clamp(2.4rem,1.2rem+4.3vw,4.7rem)] leading-[1.04] font-semibold">
            Your email list should be making you{" "}
            <span className="mark">more money.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-[1.2rem]">
            Mailisto builds and runs the email and SMS flows, campaigns and
            segmentation that turn your customer data into repeat purchases, and
            revenue you can measure.
          </p>

          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <LinkButton href={auditCta.href} size="lg" arrow>
              {auditCta.label}
              <AuditBadge />
            </LinkButton>
            <LinkButton href={talkCta.href} size="lg" variant="outline">
              {talkCta.label}
            </LinkButton>
          </div>

          <p className="mt-5 text-sm text-muted">
            A free, practical review of your email and SMS,{" "}
            <strong className="font-semibold text-ink">delivered within 48 hours</strong>. No obligation.
          </p>
        </div>
      </div>

      <HeroVideo video={video} />
    </section>
  );
}
