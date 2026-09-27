import { SectionHeading } from "../ui/SectionHeading";

const points = [
  { title: "Ecommerce first", body: "We think in AOV, repeat rate, margin and customer lifetime value. Open rates are a signal, not the goal." },
  { title: "Klaviyo specialists", body: "One platform, known deeply. Flows, segments, predictive data, reporting and deliverability settings included." },
  { title: "Revenue-focused strategy", body: "Every flow and campaign has a commercial job. If we can’t say what it’s for, we don’t send it." },
  { title: "Creative and technical", body: "Design, copy and build under one roof, so good ideas don’t get lost between teams." },
  { title: "Testing built in", body: "Structured tests with one question each, so every month you know a little more about what works." },
  { title: "Lifecycle thinking", body: "We build for the second, third and tenth order, not just the next campaign." },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x">
        <SectionHeading
          id="about-title"
          index="07"
          label="About Mailisto"
          title={
            <>
              We focus on one thing: making ecommerce email <span className="mark">work harder.</span>
            </>
          }
          intro={
            <p>
              Mailisto is a specialist Klaviyo agency for Shopify and ecommerce brands in the UK, US, Australia, Canada and beyond. No ads, no SEO, no social. Email is the whole job.
            </p>
          }
        />
        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <li key={p.title} className="reveal bg-paper p-7">
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
