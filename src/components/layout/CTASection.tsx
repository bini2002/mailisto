import { auditCta, talkCta } from "@/lib/site";
import { LinkButton } from "../ui/Button";

interface Props {
  title?: React.ReactNode;
  body?: string;
}

export function CTASection({
  title = "Find out what your list could be earning.",
  body = "Start with a free Klaviyo revenue audit. You’ll get clear, prioritised recommendations, whether or not we work together.",
}: Props) {
  return (
    <section aria-label="Get started" className="bg-lime text-ink">
      <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 className="text-h2 font-semibold">{title}</h2>
          <p className="mt-5 max-w-xl text-lg text-ink/75">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
          <LinkButton href={auditCta.href} variant="dark" size="lg" arrow>
            {auditCta.label}
          </LinkButton>
          <LinkButton href={talkCta.href} variant="outline" size="lg">
            {talkCta.label}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
