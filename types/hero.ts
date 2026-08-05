export type HeroCta =
  | { label: string; href: string; action?: never }
  | { label: string; action: "lead"; href?: never };

export type HeroSlide = {
  id: string;
  label: string;
  image: string;
  title: string;
  subtitle: string;
  chips?: readonly string[];
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
};
