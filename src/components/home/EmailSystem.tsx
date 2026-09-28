import { SectionHeading } from "../ui/SectionHeading";

const stages = [
  { name: "Acquire", trigger: "Signup form", build: "Forms and offers that grow a list of likely buyers, not just email addresses.", job: "Grow a list that buys" },
  { name: "Welcome", trigger: "Added to list", build: "A welcome series that explains the brand and answers objections before selling.", job: "First purchase" },
  { name: "Convert", trigger: "Viewed product · Started checkout", build: "Browse and cart abandonment flows that recover intent without over-discounting.", job: "Recover lost sales" },
  { name: "Retain", trigger: "Placed order", build: "Post-purchase, cross-sell and VIP journeys built around what customers bought.", job: "Second order" },
  { name: "Replenish", trigger: "Expected reorder date", build: "Reminders timed to real product usage, so customers reorder before they run out.", job: "Predictable repeat revenue" },
  { name: "Win back", trigger: "No order past the usual window", build: "Win-back and sunset flows that re-engage lapsed customers or clean the list.", job: "Save customers, protect deliverability" },
];

export function EmailSystem() {
  return (
    <section aria-labelledby="system-title" className="section-y bg-ink text-white">
      <div className="container-x">
        <SectionHeading
          id="system-title"
          tone="dark"
          index="03"
          label="How we think"
          title={
            <>
              Email isn&rsquo;t a campaign.
              <br className="hidden sm:block" /> It&rsquo;s a <span className="text-lime">system.</span>
            </>
          }
          intro={
            <p>
              One-off sends make money on the day. A lifecycle system makes money every day, because every stage of the customer journey has a job and a message built for it.
            </p>
          }
        />

        <ol className="relative mt-16 grid gap-0 lg:grid-cols-6">
          {/* connecting line */}
          <span aria-hidden="true" className="reveal-line absolute top-[7px] left-[7px] hidden h-px w-[calc(100%-14px)] bg-lime/60 lg:block" />
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-line-dark lg:hidden" />
          {stages.map((s, i) => (
            <li key={s.name} className="reveal relative flex flex-col pb-10 pl-10 lg:pb-0 lg:pl-0 lg:pr-6">
              <span aria-hidden="true" className="absolute top-0 left-0 size-[15px] border border-lime bg-ink lg:relative lg:block">
                <span className="absolute inset-[3px] bg-lime" />
              </span>
              <p className="label text-muted-dark lg:mt-6">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{s.name}</h3>
              <p className="label mt-4 leading-relaxed text-lime normal-case tracking-[0.04em]">Trigger: {s.trigger}</p>
              <p className="mt-3 pb-4 text-[0.93rem] leading-relaxed text-white/75">{s.build}</p>
              <p className="mt-4 border-t border-line-dark pt-3 text-sm lg:mt-auto">
                <span className="text-muted-dark">Job: </span>
                {s.job}
              </p>
            </li>
          ))}
        </ol>

        {/* Layers that run across every stage */}
        <div className="reveal mt-14 grid gap-px border border-line-dark bg-line-dark lg:grid-cols-12">
          <div className="bg-ink-3 p-6 lg:col-span-7">
            <p className="label text-lime">Campaign layer</p>
            <p className="mt-3 text-white/80">
              Launches, promotions, education and seasonal moments run across every stage, each sent to the segment it was written for.
            </p>
          </div>
          <div className="bg-ink-3 p-6 lg:col-span-5">
            <p className="label text-lime">Data layer</p>
            <p className="mt-3 text-white/80">Segmentation, testing and revenue reporting decide who gets what, and show which parts of the system are earning.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
