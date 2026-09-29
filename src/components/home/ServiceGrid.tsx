import type { IconType } from "react-icons";
import { PiCalendarBlankLight, PiChartLineUpLight, PiChatCircleTextLight, PiCompassLight, PiFlowArrowLight, PiPenNibLight } from "react-icons/pi";
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
    summary: "Know what to send, who gets it, and why.",
    items: ["Email & SMS audit", "Channel strategy", "Customer journey mapping", "Segmentation", "Revenue planning"],
    Icon: PiCompassLight,
  },
  {
    name: "Automated flows",
    summary: "Messages that send themselves at exactly the right moment.",
    items: ["Welcome series", "Abandoned cart & checkout", "Browse reminders", "Post-purchase", "Replenishment", "VIP & loyalty", "Win-back"],
    Icon: PiFlowArrowLight,
  },
  {
    name: "SMS marketing",
    summary: "Short, well-timed texts that work alongside your emails.",
    items: ["SMS list growth & consent", "Cart & checkout texts", "Launch & drop alerts", "Shipping & back-in-stock", "Email + SMS coordination"],
    Icon: PiChatCircleTextLight,
  },
  {
    name: "Campaigns",
    summary: "A plan, not a Friday-afternoon panic.",
    items: ["Email & SMS calendar", "Product launches", "Promotions", "Seasonal & Black Friday", "Educational content"],
    Icon: PiCalendarBlankLight,
  },
  {
    name: "Design & copy",
    summary: "Messages people actually want to open, read and click.",
    items: ["Email design", "Copywriting", "Subject lines & SMS copy", "Mobile-first templates", "On-brand design systems"],
    Icon: PiPenNibLight,
  },
  {
    name: "Testing & reporting",
    summary: "Try it, measure it, keep what makes money.",
    items: ["A/B testing", "Revenue reporting", "Attribution you can trust", "Deliverability", "Ongoing optimisation"],
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
          title="Everything your email and SMS need to actually sell."
          intro={
            <p>
              Strategy, set-up, design, copy and reporting from one specialist team. You don’t need five freelancers and a group chat.
            </p>
          }
        />

        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.name} service={s} index={i} />
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-4 border border-line bg-paper p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="max-w-2xl text-[0.98rem]">
            <strong className="font-semibold">Setting up or switching platforms?</strong>{" "}
            <span className="text-muted">
              We work with the major email and SMS platforms, including Klaviyo, Omnisend, Attentive and Postscript. We’ll set everything up properly (Shopify connection, sending domain, consent, core flows) and move your list across without losing anyone.
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
