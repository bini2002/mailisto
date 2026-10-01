/**
 * Default hero slides, shown until slides are published in Admin → Hero slides
 * (and importable from the admin overview). Each uses an uploaded image or a built-in coded design.
 */
export interface HeroSlideSeed {
  label: string;
  image_url?: string;
  image_alt?: string;
  concept_template?: string;
  caption: string;
  notes: string;
}

export const defaultHeroSlides: HeroSlideSeed[] = [
  {
    label: "Flow · Welcome · Email 1 of 4",
    image_url: "/images/hero.png",
    image_alt: "Annotated welcome email concept for a fictional coffee brand",
    caption: "Design Lab concept · fictional brand",
    notes: "Subject line and preview text written as a pair.\nProduct first. The offer can wait.\nLead with what makes the brand different, not the discount.",
  },
  {
    label: "Flow · Abandoned cart · Email 1 of 3",
    concept_template: "form-cart",
    caption: "Design Lab concept · fictional brand",
    notes: "The cart is the hero.\nSizing and returns answered before any discount.",
  },
  {
    label: "Campaign · Product launch",
    concept_template: "kiln-launch",
    caption: "Design Lab concept · fictional brand",
    notes: "One hero product, one clear action.\nScarcity told calmly. No flashing red banners.",
  },
  {
    label: "Campaign · End-of-season sale",
    concept_template: "norde-sale",
    caption: "Design Lab concept · fictional brand",
    notes: "The offer is the headline.\nThe products do the rest.",
  },
  {
    label: "Flow · Win-back",
    concept_template: "ora-winback",
    caption: "Design Lab concept · fictional brand",
    notes: "Leads with what's new, not a desperate discount.\nA bigger offer is saved for later in the flow.",
  },
];
