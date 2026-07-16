"use client";

import Image from "next/image";
import { navConfig, siteConfig } from "@/config";
import { scrollToSection } from "@/lib/scroll-to-section";
import styles from "./styles/header.module.css";

export default function HeaderLogo() {
  return (
    <a
      href="#hero"
      className={styles.logoLink}
      aria-label={siteConfig.brand.name}
      onClick={(event) => {
        event.preventDefault();
        scrollToSection(navConfig[0].id);
      }}
    >
      <Image
        src={siteConfig.assets.logoVector}
        alt={siteConfig.brand.name}
        width={50}
        height={57}
        className={styles.logo}
        priority
      />
      <span className={styles.logoText}>
        <span className={styles.logoTitle}>{siteConfig.brand.name}</span>
        <span className={styles.logoTagline}>{siteConfig.brand.description}</span>
      </span>
    </a>
  );
}
