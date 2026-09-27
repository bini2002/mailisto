import { SectionHeading } from "../ui/SectionHeading";
import { ProcessStep, type Step } from "./ProcessStep";

const steps: Step[] = [
  { name: "Audit", line: "Find where revenue is being lost.", body: "We review flows, campaigns, segments, deliverability, creative and reporting to see what is working and what isn’t.", output: "Prioritised findings" },
  { name: "Strategy", line: "Build the roadmap.", body: "A lifecycle plan and campaign calendar based on your products, margins, customers and buying cycles.", output: "Lifecycle map + calendar" },
  { name: "Build", line: "Create the infrastructure.", body: "Flows, segments, templates, copy and creative, built properly in Klaviyo and connected to Shopify data.", output: "Live flows, templates, segments" },
  { name: "Launch", line: "Deploy and monitor.", body: "Every send is QA’d across devices and clients, then monitored closely through its first weeks.", output: "Checked, monitored sends" },
  { name: "Test", line: "Learn what moves revenue.", body: "Structured tests on messaging, offers, design, timing and segmentation. One clear question per test.", output: "Testing roadmap" },
  { name: "Optimise", line: "Improve, continuously.", body: "Performance data feeds back into the plan each month. What earns gets more room; what doesn’t gets fixed.", output: "Monthly performance review" },
];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          index="04"
          label="Process"
          title="A clear process, from first audit to ongoing growth."
          intro={<p>Six stages, each with a defined output. You always know what we&rsquo;re working on and why.</p>}
        />
        <ol className="mt-14 border-t border-ink">
          {steps.map((step, i) => (
            <ProcessStep key={step.name} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
