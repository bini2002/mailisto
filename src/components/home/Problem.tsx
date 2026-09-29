import Link from "next/link";
import { SectionHeading } from "../ui/SectionHeading";

const problems = [
  { title: "The welcome email from 2021", body: "Set up once, never touched again. A basic cart reminder, and that’s the whole system." },
  { title: "Campaigns “when there’s time”", body: "Which, let’s be honest, is never in November." },
  { title: "Everyone gets the same message", body: "Your best customer and a one-time discount hunter get identical emails and texts." },
  { title: "Pretty emails that don’t sell", body: "Lovely design, unclear offer. Nothing tells people what to do next." },
  { title: "SMS sitting on the bench", body: "Either unused, or blasting the same discount as email. Neither makes money." },
  { title: "Reports full of the wrong numbers", body: "Great open rates. No idea which messages actually made money." },
  { title: "The spam folder", body: "Inbox placement slips quietly, and revenue follows it down. Nobody tells you." },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="problem-title"
          index="01"
          label="The problem"
          title={<>Most email and SMS lists are taking a nap.</>}
          intro={
            <p>
              The subscribers are there. The customer data is there. The sales are… somewhere else. Usually because email and SMS are treated like a noticeboard instead of a salesperson.
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
          <li className="reveal flex flex-col justify-between gap-6 bg-ink p-7 text-white sm:col-span-1 lg:col-span-2">
            <p className="max-w-lg text-xl leading-snug font-medium tracking-tight">
              We fix this by treating email and SMS as one system: set up properly, sent consistently and judged by how much money it makes.
            </p>
            <Link href="/audit" className="group label inline-flex items-center gap-2 text-lime">
              Get a free audit in 48 hours
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
