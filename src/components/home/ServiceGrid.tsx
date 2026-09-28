import type { IconType } from "react-icons";
import { PiChartLineUpLight, PiCompassLight, PiFlowArrowLight, PiCalendarBlankLight, PiPenNibLight } from "react-icons/pi";
import { SectionHeading } from "../ui/SectionHeading";
import { ServiceCard } from "./ServiceCard";
import Link from "next/link";

export interface Service {
  name: string;
  summary: string;
  items: string[];
  Icon: IconType;
}

const services: Service[] = [
  {
    name: "Strategy",
    summary: "Know what to send, to whom, and why.",
    items: ["Klaviyo account audit", "Email strategy", "Customer journey mapping", "Segmentation", "Revenue planning"],
    Icon: PiCompassLight,
  },
  {
    name: "Lifecycle flows",
    summary: "Automation that earns every day.",
    items: ["Welcome", "Abandoned cart & checkout", "Browse abandonment", "Post-purchase", "Replenishment", "VIP & loyalty", "Win-back"],
    Icon: PiFlowArrowLight,
  },
  {
    name: "Campaigns",
    summary: "A calendar, not a scramble.",
    items: ["Campaign calendar", "Product launches", "Promotions", "Seasonal & BFCM", "Educational content"],
    Icon: PiCalendarBlankLight,
  },
  {
    name: "Creative",
    summary: "Design and copy built to convert.",
    items: ["Email design", "Copywriting", "Subject lines", "Mobile-first templates", "Brand-consistent systems"],
    Icon: PiPenNibLight,
  },
  {
    name: "Optimisation",
    summary: "Measure, test, improve. Repeat.",
    items: ["A/B testing", "Reporting & analytics", "Revenue attribution", "Deliverability", "Ongoing optimisation"],
    Icon: PiChartLineUpLight,
  },
];

export function ServiceGrid() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y border-t border-line bg-white">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="02"
          label="Services"
          title="Everything your Klaviyo channel needs to perform."
          intro={
            <p>
              Strategy, build, creative and optimisation from one specialist team, focused entirely on making your email channel perform.
            </p>
          }
        />

        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s, i) => (
            <ServiceCard key={s.name} service={s} index={i} />
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-4 border border-line bg-paper p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="max-w-2xl text-[0.98rem]">
            <strong className="font-semibold">New to Klaviyo or migrating?</strong>{" "}
            <span className="text-muted">
              We set accounts up properly from day one: Shopify integration, branded sending domain, core flows, templates and a clean migration from your current platform.
            </span>
          </p>
          <Link href="/contact" className="label shrink-0 text-ink underline decoration-lime decoration-2 underline-offset-4 hover:bg-lime">
            Talk to us about setup
          </Link>
        </div>
      </div>
    </section>
  );
}
