import { auditCta, talkCta } from "@/lib/site";
import { AuditBadge, LinkButton } from "../ui/Button";

interface Props {
  title?: React.ReactNode;
  body?: string;
}

export function CTASection({
  title = "Curious what your email and SMS could be earning?",
  body = "Get a free audit with results in 48 hours. Worst case, you learn something useful. Best case, you find money you didn\u2019t know you were missing.",
}: Props) {
  return (
    <section aria-label="Get started" className="bg-lime text-ink">
      <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:items-end">
        <div className="reveal lg:col-span-8">
          <h2 className="text-h2 font-semibold">{title}</h2>
          <p className="mt-5 max-w-xl text-lg text-ink/75">{body}</p>
        </div>
        <div className="reveal flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
          <LinkButton href={auditCta.href} variant="dark" size="lg" arrow>
            {auditCta.label}
            <AuditBadge tone="lime" />
          </LinkButton>
          <LinkButton href={talkCta.href} variant="outline" size="lg">
            {talkCta.label}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
