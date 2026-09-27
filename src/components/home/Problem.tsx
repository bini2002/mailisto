import Link from "next/link";
import { SectionHeading } from "../ui/SectionHeading";

const problems = [
  { title: "Flows are underbuilt", body: "A single welcome email and a basic cart reminder, set up once and never revisited." },
  { title: "Campaigns are inconsistent", body: "Sent when someone has time, to whoever happens to be on the list." },
  { title: "Segmentation is thin", body: "First-time buyers and loyal customers get exactly the same message." },
  { title: "Emails look good but don’t sell", body: "Nice design, unclear offer. No hierarchy, no single action." },
  { title: "Reporting explains nothing", body: "Open rates in a dashboard, but no clear view of which emails make money." },
  { title: "Deliverability is an afterthought", body: "Until inbox placement slips and revenue quietly follows it down." },
  { title: "Nobody really owns it", body: "Email sits between marketing, ecommerce and the founder’s to-do list." },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="problem-title"
          index="01"
          label="The problem"
          title={<>Most email lists are underworked.</>}
          intro={
            <p>
              The subscribers are there. The customer data is there. But in most stores, Klaviyo is used as a sending tool rather than the revenue system it can be.
            </p>
          }
        />

        <ul className="mt-14 grid gap-px border-y border-t-ink border-b-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <li key={p.title} className="reveal bg-paper py-7 sm:p-7">
              <span className="label text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{p.body}</p>
            </li>
          ))}
          <li className="flex flex-col justify-between gap-6 bg-ink p-7 text-white sm:col-span-1 lg:col-span-2">
            <p className="max-w-lg text-xl leading-snug font-medium tracking-tight">
              We fix this by treating email as a system: built properly, run consistently and measured by revenue.
            </p>
            <Link href="/audit" className="group label inline-flex items-center gap-2 text-lime">
              See where your account stands
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
