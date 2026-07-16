"use client";

import type { HeroSlide } from "@/types/hero";
import styles from "./styles/hero.module.css";

type HeroPaginationProps = {
  slides: readonly HeroSlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function HeroPagination({
  slides,
  activeIndex,
  onSelect,
}: HeroPaginationProps) {
  return (
    <div className={styles.containerPagination}>
      <nav
        className={styles.pagination}
        aria-label="Слайды главного экрана"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <div key={slide.id} className={styles.paginationItem}>
              <span className={styles.paginationLabel} aria-hidden="true">
                {slide.label}
              </span>
              <button
                type="button"
                className={`${styles.paginationBullet} ${
                  isActive ? styles.paginationBulletActive : ""
                }`}
                aria-label={slide.label}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(index)}
              />
            </div>
          );
        })}
      </nav>
    </div>
  );
}
