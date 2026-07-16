export function getHeaderOffset() {
  if (typeof window === "undefined") return 90;

  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height-top",
  );

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 90;
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const top =
    element.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

  window.scrollTo({ top, behavior: "smooth" });
  window.history.replaceState(null, "", `#${sectionId}`);
}
