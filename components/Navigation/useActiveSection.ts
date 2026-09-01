"use client";

import { useEffect, useSyncExternalStore } from "react";
import { navConfig, type NavSectionId } from "@/config/nav";
import { getHeaderOffset } from "@/lib/scroll-to-section";

const sectionIds = navConfig.map((item) => item.id);

let activeSection: NavSectionId = sectionIds[0];
const listeners = new Set<() => void>();
let trackingCount = 0;
let rafId = 0;
let cachedOffset = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getActiveSection() {
  return activeSection;
}

function getServerActiveSection() {
  return sectionIds[0];
}

function isHomePath() {
  const path = window.location.pathname;
  return path === "/" || path === "";
}

function setActiveSection(id: NavSectionId) {
  if (activeSection === id) return;

  activeSection = id;
  listeners.forEach((listener) => listener());
}

function detectActiveSection() {
  if (!isHomePath()) return;

  const offset = cachedOffset;
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

function refreshOffset() {
  cachedOffset = getHeaderOffset() + 24;
}

function scheduleDetect() {
  if (rafId) return;

  rafId = requestAnimationFrame(() => {
    rafId = 0;
    detectActiveSection();
  });
}

function onResize() {
  refreshOffset();
  scheduleDetect();
}

function startTracking() {
  refreshOffset();
  detectActiveSection();

  window.addEventListener("scroll", scheduleDetect, { passive: true });
  window.addEventListener("resize", onResize);
}

function stopTracking() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  window.removeEventListener("scroll", scheduleDetect);
  window.removeEventListener("resize", onResize);
}

/** Запускает отслеживание скролла без подписки на состояние (без ререндеров) */
export function useActiveSectionTracker(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    trackingCount += 1;

    if (trackingCount === 1) {
      startTracking();
    }

    return () => {
      trackingCount -= 1;

      if (trackingCount === 0) {
        stopTracking();
      }
    };
  }, [enabled]);
}

/** Подписка на активность конкретного пункта — ререндер только у двух ссылок при смене секции */
export function useIsActiveSection(sectionId: NavSectionId, enabled: boolean) {
  return useSyncExternalStore(
    subscribe,
    () => enabled && getActiveSection() === sectionId,
    () => false,
  );
}

export function useActiveSection(enabled = true) {
  const activeId = useSyncExternalStore(
    subscribe,
    getActiveSection,
    getServerActiveSection,
  );

  useActiveSectionTracker(enabled);

  return activeId;
}
