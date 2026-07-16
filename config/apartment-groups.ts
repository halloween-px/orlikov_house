import { apartmentsConfig } from "./apartments";

export const APARTMENTS_PER_SLIDE = 3;

export function getApartmentGroups(
  size = APARTMENTS_PER_SLIDE,
): (typeof apartmentsConfig)[number][][] {
  const sorted = [...apartmentsConfig].sort((a, b) => a.unit - b.unit);
  const groups: (typeof apartmentsConfig)[number][][] = [];

  for (let index = 0; index < sorted.length; index += size) {
    groups.push(sorted.slice(index, index + size));
  }

  return groups;
}
