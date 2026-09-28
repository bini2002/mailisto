import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { AuditSection } from "@/components/home/AuditSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { EmailSystem } from "@/components/home/EmailSystem";
import { Hero } from "@/components/home/Hero";
import { PositioningStrip } from "@/components/home/PositioningStrip";
import { Problem } from "@/components/home/Problem";
import { Process } from "@/components/home/Process";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { WorkSection } from "@/components/home/WorkSection";
import { CTASection } from "@/components/layout/CTASection";
import { JsonLd, organizationLd, websiteLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Mailisto | Klaviyo Email Marketing Agency for Shopify Brands" },
  alternates: { canonical: "/" },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Mailisto",
  url: site.url,
  description: site.description,
  provider: { "@id": `${site.url}/#organization` },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Klaviyo email marketing services",
    itemListElement: [
      "Klaviyo account audit",
      "Klaviyo setup and migration",
      "Lifecycle flows",
      "Email campaigns",
      "Email design and copywriting",
      "Segmentation",
      "A/B testing and reporting",
      "Email deliverability",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, serviceType: "Email marketing" } })),
  },
};


export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationLd, websiteLd, serviceLd]} />
      <Hero />
      <PositioningStrip />
      <Problem />
      <ServiceGrid />
      <EmailSystem />
      <Process />
      <WorkSection />
      <AuditSection />
      <About />
      <BlogPreview />
      <CTASection />
    </>
  );
}
