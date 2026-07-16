export { siteConfig } from "./site";
export type { SiteConfig } from "./site";
export { landingConfig } from "./landing";
export type { LandingConfig } from "./landing";
export { navConfig, navSectionIds, getNavLabel } from "./nav";
export type { NavItem, NavSectionId } from "./nav";
export {
  apartmentsConfig,
  getApartmentById,
  getApartmentGallery,
  formatApartmentPrice,
  finishPackages,
  FLOORS_COUNT,
} from "./apartments";
export type { Apartment, ApartmentsConfig, ApartmentFinish } from "./apartments";
export {
  APARTMENTS_PER_SLIDE,
  getApartmentGroups,
} from "./apartment-groups";
