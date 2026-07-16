"use client";

import { siteConfig } from "@/config";
import styles from "./styles/hamburger.module.css";

type HamburgerProps = {
  active?: boolean;
  onClick?: () => void;
};

export default function Hamburger({
  active = false,
  onClick,
}: HamburgerProps) {
  return (
    <button
      type="button"
      className={`${styles.hamburger} ${active ? styles.active : ""}`}
      onClick={onClick}
      aria-label={siteConfig.header.menuAriaLabel}
      aria-expanded={active}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
