export { siteConfig } from "./site";
export type { SiteConfig } from "./site";
export { landingConfig } from "./landing";
export type { LandingConfig } from "./landing";
export { seoConfig, buildPageMetadata, getSiteUrl } from "./seo";
export { navConfig, navSectionIds, getNavLabel } from "./nav";
export type { NavItem, NavSectionId } from "./nav";
export {
  apartmentsConfig,
  getApartmentById,
  getApartmentGallery,
  getLandingCatalogApartments,
  apartmentHasPhotos,
  DEFAULT_APARTMENT_IMAGE,
  formatApartmentPrice,
  formatApartmentFloor,
  getApartmentFinish,
  getApartmentAvailability,
  finishMeta,
  finishPackages,
  FLOORS_COUNT,
} from "./apartments";
export type {
  Apartment,
  ApartmentsConfig,
  ApartmentFinish,
  ApartmentAvailability,
} from "./apartments";
export {
  APARTMENTS_PER_SLIDE,
  getApartmentGroups,
} from "./apartment-groups";
