"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config";
import { useMainContext } from "@/context/MainProvider";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/components/Navigation";
import Hamburger from "./Hamburger";
import HeaderLogo from "./HeaderLogo";
import styles from "./styles/header.module.css";

export default function HeaderTop() {
  const { params, loadParams } = useMainContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadParams();
  }, [loadParams]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const siteParams = params[0];
  const phone = siteParams?.phone ?? siteConfig.contacts.phone;

  return (
    <div
      className={`${styles.headerTop} ${
        scrolled ? styles.headerTopScrolled : ""
      } ${mobileMenuOpen ? styles.headerTopMenuOpen : ""}`}
    >
      <div className="mx-auto w-full max-w-[1700px] px-4">
        <div className={styles.headerTopWrapper}>
          <div className={styles.headerRow}>
            <div className={styles.headerLeft}>
              <HeaderLogo />
            </div>

            <div className={styles.headerCenter}>
              <Navigation />
            </div>

            <div className={styles.headerRight}>
              <a href={phone.link} className={styles.headerPhone}>
                <span className={styles.headerPhoneLabel}>
                  {siteConfig.header.phoneLabel}
                </span>
                <span className={styles.headerPhoneNumber}>{phone.title}</span>
              </a>

              <div className={styles.hamburgerWrap}>
                <Hamburger
                  active={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen((value) => !value)}
                />
              </div>
            </div>
          </div>

          {mobileMenuOpen ? (
            <div className={styles.mobileMenu}>
              <Navigation
                variant="mobile"
                onNavigate={() => setMobileMenuOpen(false)}
              />

              <a href={phone.link} className={styles.mobileContactLink}>
                {phone.title}
              </a>

              {siteConfig.contacts.emails.map((email) => (
                <a
                  key={email.link}
                  href={email.link}
                  className={styles.mobileContactLink}
                >
                  {email.title}
                </a>
              ))}

              <div className={styles.mobileMenuActions}>
                <Button
                  href={phone.link}
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className={styles.mobileCta}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {phone.title}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
