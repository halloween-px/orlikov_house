"use client";

import { useEffect, useSyncExternalStore } from "react";
import { navConfig, type NavSectionId } from "@/config/nav";
import { getHeaderOffset } from "@/lib/scroll-to-section";

const sectionIds = navConfig.map((item) => item.id);

let activeSection: NavSectionId = sectionIds[0];
const listeners = new Set<() => void>();
let trackingCount = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return activeSection;
}

function getServerSnapshot() {
  return sectionIds[0];
}

function syncSectionHash(id: NavSectionId) {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;
  if (path !== "/" && path !== "") return;

  const target = `${path}#${id}`;
  const current = `${path}${window.location.hash}`;

  if (current !== target) {
    window.history.replaceState(null, "", target);
  }
}

function setActiveSection(id: NavSectionId) {
  if (activeSection === id) return;

  activeSection = id;
  syncSectionHash(id);
  listeners.forEach((listener) => listener());
}

function detectActiveSection() {
  const offset = getHeaderOffset() + 24;
  let current = sectionIds[0];

  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (!element) continue;

    if (element.getBoundingClientRect().top <= offset) {
      current = id;
    }
  }

  setActiveSection(current);
}

export function useActiveSection() {
  const activeId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    const onHashChange = () => {
      detectActiveSection();
    };

    trackingCount += 1;

    if (trackingCount === 1) {
      detectActiveSection();

      window.addEventListener("scroll", detectActiveSection, { passive: true });
      window.addEventListener("resize", detectActiveSection);
      window.addEventListener("hashchange", onHashChange);
    }

    return () => {
      trackingCount -= 1;

      if (trackingCount === 0) {
        window.removeEventListener("scroll", detectActiveSection);
        window.removeEventListener("resize", detectActiveSection);
        window.removeEventListener("hashchange", onHashChange);
      }
    };
  }, []);

  return activeId;
}
