import { SectionHeading } from "../ui/SectionHeading";
import { ProcessStep, type Step } from "./ProcessStep";

const steps: Step[] = [
  { name: "Audit", line: "Find where the money’s leaking.", body: "We go through your flows, campaigns, SMS, segments, deliverability, design and reporting to see what’s working and what isn’t.", output: "A clear list of fixes" },
  { name: "Plan", line: "Decide what to send, and when.", body: "An email and SMS plan built around your products, margins, customers and how often they buy.", output: "Your channel plan + calendar" },
  { name: "Build", line: "Write it, design it, set it up.", body: "Flows, segments, templates, copy and design, built properly on your platform and connected to your Shopify data.", output: "Live flows, templates, segments" },
  { name: "Launch", line: "Switch it on and watch closely.", body: "Every message is checked on real devices before it goes out, then monitored through its first weeks. No “oops” emails.", output: "Checked, monitored sends" },
  { name: "Test", line: "Learn what actually sells.", body: "Subject lines, offers, timing, email vs SMS. One clear question per test, so every result teaches you something.", output: "Testing roadmap" },
  { name: "Improve", line: "Do more of what makes money.", body: "Every month the results feed back into the plan. What earns gets more room; what doesn’t gets fixed.", output: "Monthly performance review" },
];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          index="04"
          label="Process"
          title="How it works. No mystery, no jargon."
          intro={<p>Six steps, each with something real you get at the end. You always know what we&rsquo;re working on and why.</p>}
        />
        <ol className="relative mt-14">
          <span aria-hidden="true" className="reveal-line absolute inset-x-0 top-0 h-px bg-ink" />
          {steps.map((step, i) => (
            <ProcessStep key={step.name} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
