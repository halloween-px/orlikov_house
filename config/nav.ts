export const navConfig = [
  { id: "hero", label: "Главная", href: "#hero" },
  { id: "about", label: "О доме", href: "#about" },
  { id: "catalog", label: "Апартаменты", href: "#catalog" },
  { id: "location", label: "Локация", href: "#location" },
  { id: "advantages", label: "Преимущества", href: "#advantages" },
  { id: "lead", label: "Контакты", href: "#lead" },
] as const;

export type NavItem = (typeof navConfig)[number];
export type NavSectionId = NavItem["id"];

export const navSectionIds = navConfig.map((item) => item.id);

export function getNavLabel(id: string): string | undefined {
  return navConfig.find((item) => item.id === id)?.label;
}
