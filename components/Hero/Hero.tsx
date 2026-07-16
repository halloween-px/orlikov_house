"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config";
import { LandingContainer, LandingChipsList } from "@/components/shared/landing";
import type { HeroSlide } from "@/types/hero";
import HeroActions from "./HeroActions";
import HeroPagination from "./HeroPagination";
import styles from "./styles/hero.module.css";

const slides = siteConfig.hero.slides;

function HeroSlideContent({
  slide,
  isActive,
}: {
  slide: HeroSlide;
  isActive: boolean;
}) {
  const [title, spetialTitle] = slide.title.split(" ");
  return (
    <div
      className={`${styles.slideContent} ${isActive ? styles.slideContentActive : ""}`}
      aria-hidden={!isActive}
    >
      <div className={styles.contentEyebrow}>{slide.label}</div>
      <div className={styles.brandBlock}>
        <h1 className={styles.title}>
          {title} <span className={styles.specialTitle}>{spetialTitle}</span>
        </h1>
        <p className={styles.subtitle}>{slide.subtitle}</p>
        <LandingChipsList items={slide.chips} ariaLabel="Ключевые факты" />
      </div>
      <HeroActions
        primaryCta={slide.primaryCta}
        secondaryCta={slide.secondaryCta}
      />
    </div>
  );
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section id="hero" className={styles.hero} aria-label="Главный экран">
      <div className={styles.heroWrapper}>
        <div className={styles.imageArea}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slideImage} ${
                index === activeIndex ? styles.slideImageActive : ""
              }`}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        <div className={styles.heroItem}>
          <LandingContainer className={styles.heroContainer}>
            <div className={styles.heroItemGrid}>
              <div className={styles.contentCol}>
                <div className={styles.logoBlock}>
                  {slides.map((slide, index) => (
                    <HeroSlideContent
                      key={slide.id}
                      slide={slide}
                      isActive={index === activeIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </LandingContainer>
        </div>
      </div>

      <HeroPagination
        slides={slides}
        activeIndex={activeIndex}
        onSelect={handleSelect}
      />

      <span className={styles.srOnly} aria-live="polite">
        {activeSlide.label}
      </span>
    </section>
  );
}
