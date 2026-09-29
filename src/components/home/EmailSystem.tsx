import { SectionHeading } from "../ui/SectionHeading";

const stages = [
  { name: "Attract", trigger: "Someone visits your store", build: "Sign-up offers that attract real buyers (not freebie hunters) and collect email and SMS consent properly.", channels: ["Email", "SMS"], job: "A list that actually buys" },
  { name: "Welcome", trigger: "They subscribe", build: "A friendly hello that shows why you’re worth it before asking for money.", channels: ["Email", "SMS"], job: "Their first order" },
  { name: "Convert", trigger: "They browse or leave a cart", build: "Gentle, well-timed reminders that rescue the sale without training people to wait for a discount.", channels: ["Email", "SMS"], job: "Rescue the sale" },
  { name: "Keep", trigger: "They place an order", build: "Thanks, tips and the next thing they’ll love, based on what they actually bought.", channels: ["Email"], job: "Order number two" },
  { name: "Reorder", trigger: "They’re about to run out", build: "A nudge right on time, so customers reorder before they go looking elsewhere.", channels: ["Email", "SMS"], job: "Steady repeat sales" },
  { name: "Win back", trigger: "They’ve gone quiet", build: "A “we miss you” that doesn’t sound needy, and a polite goodbye for people who’ve moved on.", channels: ["Email"], job: "Bring them back, keep the list healthy" },
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
              One-off blasts sell once.
              <br className="hidden sm:block" /> A <span className="text-lime">system</span> sells every day.
            </>
          }
          intro={
            <p>
              Every stage of the customer journey gets its own message, by email, SMS or both, sent at the moment it matters. It keeps working while you sleep, eat, or finally take that holiday.
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
              <p className="label mt-4 leading-relaxed text-lime normal-case tracking-[0.04em]">When: {s.trigger}</p>
              <p className="mt-3 text-[0.93rem] leading-relaxed text-white/75">{s.build}</p>
              <p className="mt-3 flex gap-1.5 pb-4">
                {s.channels.map((c) => (
                  <span key={c} className={`label px-1.5 py-1 text-[0.62rem] ${c === "SMS" ? "bg-lime text-ink" : "border border-line-dark text-white/80"}`}>
                    {c}
                  </span>
                ))}
              </p>
              <p className="mt-4 border-t border-line-dark pt-3 text-sm lg:mt-auto">
                <span className="text-muted-dark">Goal: </span>
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
              Launches, sales, drops and seasonal moments, by email and SMS, sent to the people they’re actually meant for.
            </p>
          </div>
          <div className="bg-ink-3 p-6 lg:col-span-5">
            <p className="label text-lime">Data layer</p>
            <p className="mt-3 text-white/80">Segments, tests and revenue reports decide who gets what, and show which messages are actually making money.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
