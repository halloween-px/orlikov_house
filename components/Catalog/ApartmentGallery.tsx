"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCreative, Keyboard } from "swiper/modules";
import { useLightbox } from "@/hooks/useLightbox";
import { Lightbox } from "@/components/ui/Lightbox";

import "swiper/css";
import "swiper/css/effect-creative";

import styles from "./styles/apartment-gallery.module.css";

type ApartmentGalleryProps = {
  images: readonly string[];
  alt: string;
  badge?: {
    label: string;
    tone: "sold" | "rental";
  };
};

export default function ApartmentGallery({
  images,
  alt,
  badge,
}: ApartmentGalleryProps) {
  const gallery = images.length > 0 ? images : [];
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lightbox = useLightbox({ images: gallery });

  if (gallery.length === 0) return null;

  const showControls = gallery.length > 1;
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= gallery.length - 1;

  return (
    <div className={styles.gallery}>
      <div className={styles.heroMedia}>
        <Swiper
          modules={[EffectCreative, Keyboard, A11y]}
          className={styles.mainSwiper}
          slidesPerView={1}
          spaceBetween={0}
          speed={720}
          grabCursor={showControls}
          allowTouchMove={showControls}
          keyboard={{ enabled: showControls && !lightbox.isOpen }}
          onSwiper={setMainSwiper}
          effect="creative"
          creativeEffect={{
            perspective: true,
            limitProgress: 1,
            shadowPerProgress: true,
            prev: {
              shadow: true,
              translate: ["-18%", 0, -120],
              rotate: [0, 0, -4],
              opacity: 0.35,
              scale: 0.92,
            },
            next: {
              translate: ["108%", 0, 0],
              rotate: [0, 0, 3],
              opacity: 0.85,
              scale: 0.96,
            },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          onClick={(swiper) => {
            const index =
              typeof swiper.clickedIndex === "number"
                ? swiper.clickedIndex
                : swiper.activeIndex;
            lightbox.open(index);
          }}
        >
          {gallery.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`} className={styles.mainSlide}>
              <Image
                src={src}
                alt={`${alt} — фото ${index + 1}`}
                fill
                priority={index === 0}
                className={`object-cover ${styles.mainImage}`}
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {badge ? (
          <span
            className={`${styles.statusBadge} ${
              badge.tone === "sold" ? styles.statusSold : styles.statusRental
            }`}
          >
            {badge.label}
          </span>
        ) : null}

        {showControls ? (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navPrev}`}
              aria-label="Предыдущее фото"
              disabled={isFirst}
              onClick={(event) => {
                event.stopPropagation();
                mainSwiper?.slidePrev();
              }}
            >
              <ChevronLeft className={styles.navIcon} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navNext}`}
              aria-label="Следующее фото"
              disabled={isLast}
              onClick={(event) => {
                event.stopPropagation();
                mainSwiper?.slideNext();
              }}
            >
              <ChevronRight className={styles.navIcon} strokeWidth={1.8} />
            </button>
            <p className={styles.counter}>
              {activeIndex + 1} / {gallery.length}
            </p>
          </>
        ) : null}
      </div>

      {showControls ? (
        <div className={styles.thumbs} role="list">
          {gallery.map((src, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${src}-thumb-${index}`}
                type="button"
                role="listitem"
                className={`${styles.thumb} ${isActive ? styles.thumbActive : ""}`}
                aria-label={`Фото ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => mainSwiper?.slideTo(index)}
                onDoubleClick={() => lightbox.open(index)}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <Lightbox lightbox={lightbox} alt={alt} />
    </div>
  );
}
