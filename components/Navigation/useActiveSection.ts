"use client";

import { useEffect, useState } from "react";
import { navConfig, type NavSectionId } from "@/config/nav";
import { getHeaderOffset } from "@/lib/scroll-to-section";

const sectionIds = navConfig.map((item) => item.id);

export function useActiveSection() {
  const [activeId, setActiveId] = useState<NavSectionId>(sectionIds[0]);

  useEffect(() => {
    const updateActiveSection = () => {
      const offset = getHeaderOffset() + 24;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      setActiveId(current);
    };

    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "") as NavSectionId;
      if (sectionIds.includes(hash)) {
        setActiveId(hash);
      }
    };

    updateActiveSection();
    onHashChange();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return activeId;
}
