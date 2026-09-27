import { SITE_URL } from "./env";

export const site = {
  name: "Mailisto",
  url: SITE_URL,
  tagline: "Make your list your most profitable channel.",
  description:
    "Mailisto is a Klaviyo email marketing agency for Shopify brands. We build and run the flows, campaigns and segmentation that turn customer data into repeat revenue.",
  shortDescription: "Klaviyo email marketing for Shopify brands.",
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
