import { getHeroSlides } from "@/lib/data";
import { HeroSlider } from "./HeroSlider";

/** Right-hand side of the hero: designs managed in Admin → Hero slides. */
export async function HeroVisual() {
  const slides = await getHeroSlides();
  return <HeroSlider slides={slides} />;
}
