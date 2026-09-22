export const navConfig = [
  { id: "hero", label: "Главная", href: "#hero" },
  { id: "about", label: "О доме", href: "#about" },
  { id: "catalog", label: "Студии", href: "/apartments" },
  { id: "advantages", label: "Преимущества", href: "#advantages" },
  { id: "lead", label: "Контакты", href: "#lead" },
  { id: "location", label: "Локация", href: "#location" },
] as const;

export type NavItem = (typeof navConfig)[number];
export type NavSectionId = NavItem["id"];

export const navSectionIds = navConfig.map((item) => item.id);

export function getNavLabel(id: string): string | undefined {
  return navConfig.find((item) => item.id === id)?.label;
}

export function isNavPageLink(href: string) {
  return href.startsWith("/") && !href.startsWith("/#");
}

export function getNavHref(href: string) {
  if (isNavPageLink(href) || href.startsWith("/#")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
}
