"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  formatApartmentFloor,
  formatApartmentPrice,
  getApartmentAvailability,
  getApartmentFinish,
  getApartmentGallery,
  type Apartment,
} from "@/config";
import { useMainContext } from "@/context/MainProvider";
import { Button } from "@/components/ui/Button";
import styles from "./styles/catalog.module.css";

/** Сколько кадров в hover-превью — достаточно для Ozon-паттерна, без лишней нагрузки */
const MAX_HOVER_SLIDES = 8;

type ApartmentCardProps = {
  apartment: Apartment;
  detailLabel: string;
  requestLabel: string;
  delayMs?: number;
};

function useFineHover() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return enabled;
}

export default function ApartmentCard({
  apartment,
  detailLabel,
  requestLabel,
  delayMs = 0,
}: ApartmentCardProps) {
  const { openLeadModal } = useMainContext();
  const fineHover = useFineHover();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverArmed, setHoverArmed] = useState(false);

  const availability = apartment.availability;
  const isSold = availability === "sold";
  const isRental = availability === "rental_business";
  const finish = getApartmentFinish(apartment.finish);
  const status = getApartmentAvailability(availability);
  const detailHref = `/apartments/${apartment.id}`;

  const slides = useMemo(() => {
    return getApartmentGallery(apartment).slice(0, MAX_HOVER_SLIDES);
  }, [apartment]);

  const canHoverSlide = fineHover && slides.length > 1;

  const syncIndexFromPointer = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!canHoverSlide) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.999);
    const next = Math.floor(ratio * slides.length);
    setActiveIndex(next);
  };

  const resetPreview = () => {
    setActiveIndex(0);
  };

  return (
    <article
      className={`${styles.catalogCard} ${isSold ? styles.catalogCardSold : ""}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <Link
        href={detailHref}
        className={styles.catalogMedia}
        aria-label={`Лот ${apartment.unit} — подробнее`}
        onMouseEnter={() => {
          if (!canHoverSlide) return;
          setHoverArmed(true);
        }}
        onMouseMove={syncIndexFromPointer}
        onMouseLeave={resetPreview}
      >
        <div className={styles.catalogMediaSlides}>
          {slides.map((src, index) => {
            const isActive = index === activeIndex;
            // До наведения — только обложка; после — до 8 кадров этой карточки
            if (index > 0 && !hoverArmed) return null;

            return (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                className={`object-cover ${styles.catalogMediaImage} ${
                  isActive ? styles.catalogMediaImageActive : ""
                }`}
                sizes="(max-width: 720px) 100vw, 25vw"
                priority={index === 0 && delayMs < 120}
              />
            );
          })}
        </div>

        {(isSold || isRental) && (
          <span
            className={`${styles.statusBadge} ${
              isSold ? styles.statusSold : styles.statusRental
            }`}
          >
            {status.label}
          </span>
        )}

        {canHoverSlide ? (
          <div
            className={styles.catalogMediaDots}
            style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {slides.map((src, index) => (
              <span
                key={`${src}-dot`}
                className={`${styles.catalogMediaDot} ${
                  index === activeIndex ? styles.catalogMediaDotActive : ""
                }`}
              />
            ))}
          </div>
        ) : null}
      </Link>

      <div className={styles.catalogBody}>
        <div className={styles.catalogLotRow}>
          <Link href={detailHref} className={styles.catalogLot}>
            Лот {apartment.unit}
          </Link>
        </div>

        <div className={styles.catalogFacts}>
          <span>{apartment.area}</span>
          <span aria-hidden="true" className={styles.catalogDot}>
            ·
          </span>
          <span>{formatApartmentFloor(apartment.floor)}</span>
        </div>

        <div className={styles.finishBlock}>
          <p className={styles.finishLabel}>{finish.label}</p>
          {apartment.finish === "turnkey" ? (
            <p className={styles.finishIncludes}>
              {finish.includes.join(" · ").toLowerCase()}
            </p>
          ) : null}
        </div>

        <div className={styles.catalogPrice}>
          {isSold ? (
            <span className={styles.priceSold}>{status.label}</span>
          ) : (
            formatApartmentPrice(apartment.price)
          )}
        </div>

        <div className={styles.catalogActions}>
          <Button href={detailHref} variant="outline" size="md" fullWidth>
            {detailLabel}
          </Button>

          {!isSold ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => openLeadModal("viewing")}
            >
              {requestLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
