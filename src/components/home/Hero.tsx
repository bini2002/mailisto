import { getHeroVideo } from "@/lib/data";
import { auditCta, talkCta } from "@/lib/site";
import { AuditBadge, LinkButton } from "../ui/Button";
import { DotWave } from "./DotWave";
import { HeroVideo } from "./HeroVideo";

export async function Hero() {
  const video = await getHeroVideo();

  return (
    // No overflow clipping on the section: the video stage below is position: sticky.
    <section aria-labelledby="hero-title" className="relative bg-ink text-white">
      <div className="relative overflow-hidden">
        <DotWave className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]" />

        <div className="container-x hero-in relative flex flex-col items-center pt-14 pb-10 text-center sm:pt-20 sm:pb-12">
          <p className="label inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-lime/70 sm:rounded-full px-4 py-2 text-muted-dark">
            <span className="inline-flex items-center gap-2 text-white">
              <span aria-hidden="true" className="size-2 bg-lime" />
              Email &amp; SMS agency
            </span>
            <span aria-hidden="true" className="hidden h-px w-6 bg-line-dark sm:block" />
            For Shopify brands
          </p>

          <h1 id="hero-title" className="mt-7 max-w-5xl text-[clamp(2.4rem,1.2rem+4.3vw,4.7rem)] leading-[1.04] font-semibold">
            Your email list should be making you{" "}
            <span className="mark">more money.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-dark sm:text-[1.2rem]">
            Mailisto builds and runs the email and SMS flows, campaigns and
            segmentation that turn your customer data into repeat purchases, and
            revenue you can measure.
          </p>

          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <LinkButton href={auditCta.href} size="lg" arrow>
              {auditCta.label}
              <AuditBadge />
            </LinkButton>
            <LinkButton href={talkCta.href} size="lg" variant="outline-light">
              {talkCta.label}
            </LinkButton>
          </div>

          <p className="mt-5 text-sm text-muted-dark">
            A free, practical review of your email and SMS,{" "}
            <strong className="font-semibold text-white">delivered within 48 hours</strong>. No obligation.
          </p>
        </div>
      </div>

      <HeroVideo video={video} />
    </section>
  );
}
