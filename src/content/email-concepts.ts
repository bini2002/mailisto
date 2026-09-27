/**
 * Mailisto Design Lab: original email concepts for fictional brands.
 * These are NOT client work and must always be labelled as concepts on the site.
 *
 * Each concept renders as a coded, resolution-independent email preview (see components/email/EmailMock).
 * The CMS references a concept by `key` via `email_designs.concept_template`, or uses an uploaded image instead.
 */

export type ArtKey = "bag" | "cup" | "sneaker" | "jacket" | "vase" | "bowl" | "bottle" | "tube" | "tee" | "jar";

export interface Palette {
  canvas: string; // email background
  ink: string; // primary text
  muted: string; // secondary text
  accent: string; // buttons
  accentInk: string; // button text
  panel: string; // art background
  panel2: string; // secondary art background
  object: string; // art object colour
  line: string; // dividers
}

export type Block =
  | { type: "header"; logo: string; links?: string[] }
  | { type: "announce"; text: string }
  | { type: "hero"; art: ArtKey; eyebrow?: string; headline: string; body?: string; cta?: string; variant?: "stack" | "split" | "type" }
  | { type: "text"; eyebrow?: string; heading?: string; body: string; align?: "left" | "center" }
  | { type: "cta"; label: string; note?: string }
  | { type: "products"; heading?: string; items: { name: string; meta: string; art: ArtKey }[] }
  | { type: "cart"; items: { name: string; meta: string; price: string; art: ArtKey }[] }
  | { type: "steps"; heading?: string; items: { title: string; body: string }[] }
  | { type: "code"; label: string; code: string; note?: string }
  | { type: "benefits"; items: string[] }
  | { type: "footer"; brand: string };

export interface EmailConcept {
  key: string;
  title: string;
  brand: string;
  kind: "campaign" | "flow";
  emailType: string;
  tags: string[];
  subject: string;
  preheader: string;
  description: string;
  objective: string;
  creativeDirection: string;
  palette: Palette;
  /** Use a serif display face for headlines (editorial brands). */
  serif?: boolean;
  blocks: Block[];
}

export const emailConcepts: EmailConcept[] = [
  {
    key: "halden-welcome",
    serif: true,
    title: "Welcome series, email one",
    brand: "Halden Coffee",
    kind: "flow",
    emailType: "Welcome",
    tags: ["welcome"],
    subject: "Your first bag, roasted to order",
    preheader: "How Halden works, and 10% off to start.",
    description:
      "The first email a new subscriber sees. It explains what makes the product different before asking for the sale, then gives one clear reason to buy now.",
    objective: "Convert new subscribers into first-time buyers within the welcome window.",
    creativeDirection:
      "Warm, tactile palette. Product first, offer second. A three-step explainer answers the obvious question (why buy coffee online?) before the code appears.",
    palette: {
      canvas: "#F6F1EA",
      ink: "#2A1D15",
      muted: "#7A6A5E",
      accent: "#2A1D15",
      accentInk: "#F6F1EA",
      panel: "#E4D6C3",
      panel2: "#D2BFA6",
      object: "#6B4A33",
      line: "#E2D8CB",
    },
    blocks: [
      { type: "header", logo: "HALDEN", links: ["Shop", "Subscriptions"] },
      {
        type: "hero",
        art: "bag",
        eyebrow: "Welcome to Halden",
        headline: "Good coffee starts with fresher beans.",
        body: "Every bag is roasted the day it ships. No warehouse shelves, no guessing.",
        variant: "stack",
      },
      {
        type: "steps",
        heading: "How it works",
        items: [
          { title: "Choose a roast", body: "Light, balanced or dark. We'll help you pick." },
          { title: "We roast it", body: "Small batches, the morning your order ships." },
          { title: "Brew within weeks", body: "Not months. That's the difference." },
        ],
      },
      { type: "code", label: "10% off your first bag", code: "HELLO10", note: "Valid for 7 days" },
      { type: "cta", label: "Find your roast" },
      { type: "footer", brand: "Halden Coffee" },
    ],
  },
  {
    key: "form-cart",
    title: "Abandoned cart reminder",
    brand: "Form Athletic",
    kind: "flow",
    emailType: "Abandoned cart",
    tags: ["product"],
    subject: "Still thinking about the Stride 2?",
    preheader: "Your size is saved. Free returns if they're not right.",
    description:
      "Sent a few hours after a checkout is started. It removes the two most common objections for footwear, sizing and returns, instead of leading with a discount.",
    objective: "Recover abandoned checkouts without training customers to wait for a discount.",
    creativeDirection:
      "High-contrast and direct. The cart is the hero. Reassurance sits right under the product so hesitant buyers don't have to go looking for it.",
    palette: {
      canvas: "#FFFFFF",
      ink: "#0B0B0B",
      muted: "#6A6A6A",
      accent: "#0B0B0B",
      accentInk: "#FFFFFF",
      panel: "#EDEDED",
      panel2: "#DCDCDC",
      object: "#1E1E1E",
      line: "#E6E6E6",
    },
    blocks: [
      { type: "header", logo: "FORM", links: ["Men", "Women"] },
      {
        type: "text",
        eyebrow: "Saved for you",
        heading: "You left something behind.",
        body: "We've kept your cart as you left it. Your size is still available, for now.",
        align: "left",
      },
      { type: "cart", items: [{ name: "Stride 2 Runner", meta: "Graphite / UK 9", price: "£120", art: "sneaker" }] },
      { type: "cta", label: "Return to your cart" },
      { type: "benefits", items: ["Free returns within 30 days", "Free exchanges on sizing", "Ships in 1–2 days"] },
      { type: "footer", brand: "Form Athletic" },
    ],
  },
  {
    key: "kiln-launch",
    serif: true,
    title: "New product launch",
    brand: "Kiln Studio",
    kind: "campaign",
    emailType: "Product launch",
    tags: ["product"],
    subject: "Tide is here",
    preheader: "Six new glazes, made in small runs. First access for subscribers.",
    description:
      "A launch campaign for a limited ceramics collection. It sells the story and the scarcity with restraint, then gets out of the way.",
    objective: "Drive launch-day revenue and sell through a limited first run.",
    creativeDirection:
      "Editorial layout with generous space. A single hero object, a short line of copy, then two products to shop. The brand's calm tone carries the urgency, not red banners.",
    palette: {
      canvas: "#EFECE7",
      ink: "#1D1C1A",
      muted: "#77736C",
      accent: "#A9502B",
      accentInk: "#FFFFFF",
      panel: "#DDD6CB",
      panel2: "#CFC6B8",
      object: "#A9502B",
      line: "#DCD6CC",
    },
    blocks: [
      { type: "header", logo: "KILN STUDIO" },
      {
        type: "hero",
        art: "vase",
        eyebrow: "New collection",
        headline: "Tide. Six glazes, one small run.",
        body: "Thrown and glazed by hand in our studio. When this batch is gone, it's gone.",
        cta: "Shop Tide",
        variant: "split",
      },
      {
        type: "products",
        heading: "From the collection",
        items: [
          { name: "Tide Vase", meta: "Rust glaze", art: "vase" },
          { name: "Tide Bowl", meta: "Sand glaze", art: "bowl" },
        ],
      },
      { type: "footer", brand: "Kiln Studio" },
    ],
  },
  {
    key: "norde-sale",
    title: "End-of-season sale",
    brand: "NORDE",
    kind: "campaign",
    emailType: "Promotional",
    tags: ["promotional"],
    subject: "The outerwear sale starts now",
    preheader: "Up to 40% off coats and jackets. Final sizes won't restock.",
    description:
      "A promotional campaign that makes the offer instantly clear, then earns the click with product rather than a wall of percentages.",
    objective: "Clear seasonal stock at a healthy margin during a short sale window.",
    creativeDirection:
      "Dark, confident and typographic. The offer is the headline. Products carry the rest. One CTA, repeated once at the end for scrollers.",
    palette: {
      canvas: "#111111",
      ink: "#F2EFEA",
      muted: "#9A958D",
      accent: "#F2EFEA",
      accentInk: "#111111",
      panel: "#1E1E1E",
      panel2: "#2A2A2A",
      object: "#B7AE9F",
      line: "#2B2B2B",
    },
    blocks: [
      { type: "announce", text: "Sale ends Sunday at midnight" },
      { type: "header", logo: "NORDE" },
      {
        type: "hero",
        art: "jacket",
        eyebrow: "End of season",
        headline: "Up to 40% off outerwear.",
        cta: "Shop the sale",
        variant: "type",
      },
      {
        type: "products",
        items: [
          { name: "Fjell Parka", meta: "Now £228", art: "jacket" },
          { name: "Lark Overshirt", meta: "Now £96", art: "tee" },
        ],
      },
      { type: "cta", label: "Shop all outerwear", note: "Final sizes won't be restocked." },
      { type: "footer", brand: "NORDE" },
    ],
  },
  {
    key: "halden-postpurchase",
    serif: true,
    title: "Post-purchase brew guide",
    brand: "Halden Coffee",
    kind: "flow",
    emailType: "Post-purchase",
    tags: ["retention"],
    subject: "Your beans have landed. Here's how to brew them.",
    preheader: "A 60-second guide to getting the most from your first bag.",
    description:
      "Sent after delivery. It helps the customer succeed with the product, which is what drives the second order, and sets up replenishment timing.",
    objective: "Increase second-order rate by improving the first-use experience.",
    creativeDirection:
      "Useful before commercial. The guide is the content; the reorder prompt is quiet and well-timed, positioned for when the bag runs low.",
    palette: {
      canvas: "#FFFFFF",
      ink: "#2A1D15",
      muted: "#7A6A5E",
      accent: "#2A1D15",
      accentInk: "#FFFFFF",
      panel: "#F1E8DC",
      panel2: "#E4D6C3",
      object: "#6B4A33",
      line: "#EFE7DD",
    },
    blocks: [
      { type: "header", logo: "HALDEN" },
      {
        type: "hero",
        art: "cup",
        eyebrow: "Brew guide",
        headline: "Your beans have landed.",
        body: "Here's how to get the best cup from them this week.",
        variant: "stack",
      },
      {
        type: "steps",
        items: [
          { title: "Grind fresh", body: "Medium-coarse for pour-over. Grind just before brewing." },
          { title: "15g to 250ml", body: "Water just off the boil, around 94°C." },
          { title: "Taste and adjust", body: "Too bitter? Go coarser. Too sour? Go finer." },
        ],
      },
      {
        type: "text",
        heading: "Running low in two weeks?",
        body: "Set up a subscription and your next bag is roasted before this one runs out.",
        align: "center",
      },
      { type: "cta", label: "Set up delivery" },
      { type: "footer", brand: "Halden Coffee" },
    ],
  },
  {
    key: "ora-winback",
    serif: true,
    title: "Win-back email",
    brand: "Ora Skin",
    kind: "flow",
    emailType: "Win-back",
    tags: ["retention"],
    subject: "It's been a while",
    preheader: "Here's what's new since your last order.",
    description:
      "Part of a win-back flow for customers past their expected repurchase window. It leads with what's changed, not a desperate discount.",
    objective: "Re-engage lapsed customers before they churn for good.",
    creativeDirection:
      "Soft and personal. Acknowledge the gap, show what's new, and keep the incentive modest. A stronger offer is saved for a later email in the flow.",
    palette: {
      canvas: "#F5ECE8",
      ink: "#3A2926",
      muted: "#8C7671",
      accent: "#3A2926",
      accentInk: "#F5ECE8",
      panel: "#EBD9D2",
      panel2: "#E0C8BF",
      object: "#B98C7E",
      line: "#E8DAD4",
    },
    blocks: [
      { type: "header", logo: "ora" },
      {
        type: "hero",
        art: "bottle",
        eyebrow: "We saved your routine",
        headline: "It's been a while.",
        body: "A few things have changed since your last order. Here's what's worth knowing.",
        variant: "split",
      },
      {
        type: "products",
        heading: "New since you last visited",
        items: [
          { name: "Barrier Serum", meta: "New formula", art: "bottle" },
          { name: "Night Balm", meta: "Now in 50ml", art: "jar" },
        ],
      },
      { type: "code", label: "15% off your next order", code: "WELCOMEBACK" },
      { type: "cta", label: "Shop what's new" },
      { type: "footer", brand: "Ora Skin" },
    ],
  },
  {
    key: "vale-collection",
    serif: true,
    title: "New collection drop",
    brand: "Vale",
    kind: "campaign",
    emailType: "New collection",
    tags: ["product"],
    subject: "Autumn, considered",
    preheader: "The new collection is live. Fewer pieces, better made.",
    description:
      "A collection launch for a fashion brand where the creative has to do the selling. Editorial type and a tight edit of products replace a crowded grid.",
    objective: "Drive traffic and first-week sales for a seasonal collection.",
    creativeDirection:
      "Fashion-editorial. Oversized type, a strong crop, and only two products. Restraint signals quality and gives each item room to sell.",
    palette: {
      canvas: "#ECEAE3",
      ink: "#151515",
      muted: "#6F6D66",
      accent: "#151515",
      accentInk: "#ECEAE3",
      panel: "#D9D5CA",
      panel2: "#C9C3B5",
      object: "#4E4A40",
      line: "#D8D4CA",
    },
    blocks: [
      { type: "header", logo: "VALE", links: ["New", "Women", "Men"] },
      {
        type: "hero",
        art: "tee",
        eyebrow: "The Autumn Collection",
        headline: "Autumn, considered.",
        cta: "Explore the collection",
        variant: "type",
      },
      {
        type: "products",
        items: [
          { name: "Merino Crew", meta: "Oat", art: "tee" },
          { name: "Wool Overcoat", meta: "Charcoal", art: "jacket" },
        ],
      },
      { type: "footer", brand: "Vale" },
    ],
  },
  {
    key: "ora-education",
    serif: true,
    title: "Educational routine guide",
    brand: "Ora Skin",
    kind: "campaign",
    emailType: "Educational",
    tags: [],
    subject: "Your evening routine, in three steps",
    preheader: "Which products go where, and why the order matters.",
    description:
      "A content-led campaign that builds trust between promotions. It answers a real customer question and naturally recommends the products involved.",
    objective: "Keep engagement and deliverability healthy between sales, and grow average order value.",
    creativeDirection:
      "Clean and instructional. Numbered steps, one product per step, and a bundle CTA at the end for customers ready to buy the full routine.",
    palette: {
      canvas: "#FFFFFF",
      ink: "#3A2926",
      muted: "#8C7671",
      accent: "#3A2926",
      accentInk: "#FFFFFF",
      panel: "#F5ECE8",
      panel2: "#EBD9D2",
      object: "#B98C7E",
      line: "#F0E6E2",
    },
    blocks: [
      { type: "header", logo: "ora" },
      {
        type: "text",
        eyebrow: "The Ora Journal",
        heading: "Your evening routine, in three steps.",
        body: "Order matters. Thinnest to thickest lets each product do its job.",
        align: "center",
      },
      {
        type: "steps",
        items: [
          { title: "Cleanse", body: "Gel Cleanser. Removes the day without stripping." },
          { title: "Treat", body: "Barrier Serum. Two to three drops on damp skin." },
          { title: "Seal", body: "Night Balm. A thin layer locks everything in." },
        ],
      },
      {
        type: "products",
        items: [
          { name: "Barrier Serum", meta: "30ml", art: "bottle" },
          { name: "Gel Cleanser", meta: "150ml", art: "tube" },
        ],
      },
      { type: "cta", label: "Shop the evening set" },
      { type: "footer", brand: "Ora Skin" },
    ],
  },
  {
    key: "form-vip-early-access",
    title: "VIP early access (BFCM)",
    brand: "Form Athletic",
    kind: "campaign",
    emailType: "Seasonal",
    tags: ["promotional", "retention"],
    subject: "You're in early",
    preheader: "Our best customers get first access to Black Friday. Starts now.",
    description:
      "A seasonal campaign sent only to a repeat-purchaser segment before the public sale. Early access rewards loyalty and moves revenue ahead of the busiest inbox days.",
    objective: "Capture high-intent revenue from existing customers before public BFCM traffic.",
    creativeDirection:
      "Exclusive without being loud. Black and white with one accent. The copy makes the segment feel chosen, which it is.",
    palette: {
      canvas: "#0B0B0B",
      ink: "#FFFFFF",
      muted: "#9B9B9B",
      accent: "#D7FF3A",
      accentInk: "#0B0B0B",
      panel: "#181818",
      panel2: "#232323",
      object: "#E6E6E6",
      line: "#242424",
    },
    blocks: [
      { type: "header", logo: "FORM" },
      {
        type: "text",
        eyebrow: "Members only · 48 hours",
        heading: "You're in early.",
        body: "Before Black Friday opens to everyone, our repeat customers get first pick. Your access starts now.",
        align: "left",
      },
      {
        type: "products",
        items: [
          { name: "Stride 2 Runner", meta: "30% off", art: "sneaker" },
          { name: "Tempo Tee", meta: "25% off", art: "tee" },
        ],
      },
      { type: "cta", label: "Shop early access", note: "Public sale opens Friday." },
      { type: "footer", brand: "Form Athletic" },
    ],
  },
];

export const conceptsByKey = Object.fromEntries(emailConcepts.map((c) => [c.key, c])) as Record<string, EmailConcept>;
