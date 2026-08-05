"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navConfig, siteConfig } from "@/config";
import { scrollToSection } from "@/lib/scroll-to-section";
import styles from "./styles/header.module.css";

export default function HeaderLogo() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Link
      href={isHome ? "/#hero" : "/"}
      className={styles.logoLink}
      aria-label={siteConfig.brand.name}
      onClick={(event) => {
        if (!isHome) return;
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
        <span className={styles.logoTagline}>
          <span>{siteConfig.brand.descriptionLine1}</span>
          <span>{siteConfig.brand.descriptionLine2}</span>
        </span>
      </span>
    </Link>
  );
}
