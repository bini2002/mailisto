import { SectionHeading } from "../ui/SectionHeading";

const points = [
  { title: "We think like shop owners", body: "Orders, margins and repeat customers. Open rates are a signal, not the goal." },
  { title: "Platform-flexible", body: "Klaviyo, Omnisend, Attentive, Postscript and more. We work with what fits your store, including the weird settings nobody reads." },
  { title: "Every message has a job", body: "If we can’t explain why an email or text exists, it doesn’t get sent." },
  { title: "Design, copy and set-up", body: "One team under one roof, so good ideas don’t get lost between three freelancers." },
  { title: "Testing built in", body: "Small experiments every month, so you always know a bit more about what actually works." },
  { title: "We play the long game", body: "We care about order number ten, not just the next campaign." },
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
              We do one thing: make email and SMS <span className="mark">make you money.</span>
            </>
          }
          intro={
            <p>
              Mailisto is an email and SMS marketing agency for Shopify and ecommerce brands. It&rsquo;s our whole job, so your list gets our full attention (and slightly too much of our weekends).
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
