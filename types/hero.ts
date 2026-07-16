export type HeroSlide = {
  id: string;
  label: string;
  image: string;
  title: string;
  subtitle: string;
  chips?: readonly string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};
