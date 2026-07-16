"use client";

import { useEffect } from "react";
import { navSectionIds } from "@/config";
import { scrollToSection } from "@/lib/scroll-to-section";

export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash || !navSectionIds.includes(hash as (typeof navSectionIds)[number])) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToSection(hash);
    });
  }, []);

  return null;
}
