import { SITE_URL } from "./env";

export const site = {
  name: "Mailisto",
  url: SITE_URL,
  tagline: "Make your list your most profitable channel.",
  description:
    "Mailisto is an email and SMS marketing agency for Shopify brands. We build and run the flows, campaigns and segmentation that turn customer data into repeat revenue.",
  shortDescription: "Email & SMS marketing for Shopify brands.",
  title: "Mailisto | Email & SMS Marketing Agency for Shopify Brands",
} as const;

export const mainNav = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
] as const;

export const auditCta = { label: "Get a Free Audit", href: "/audit" } as const;
export const talkCta = { label: "Let’s Talk", href: "/contact" } as const;
