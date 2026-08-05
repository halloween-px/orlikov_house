"use client";

import Image from "next/image";
import {
  formatApartmentFloor,
  formatApartmentPrice,
  getApartmentAvailability,
  getApartmentFinish,
  type Apartment,
} from "@/config";
import { useMainContext } from "@/context/MainProvider";
import { Button } from "@/components/ui/Button";
import styles from "./styles/catalog.module.css";

type ApartmentCardProps = {
  apartment: Apartment;
  detailLabel: string;
  delayMs?: number;
};

export default function ApartmentCard({
  apartment,
  detailLabel,
  delayMs = 0,
}: ApartmentCardProps) {
  const { openLeadModal } = useMainContext();
  const availability = apartment.availability;
  const isSold = availability === "sold";
  const isRental = availability === "rental_business";
  const finish = getApartmentFinish(apartment.finish);
  const status = getApartmentAvailability(availability);

  return (
    <article
      className={`${styles.catalogCard} ${isSold ? styles.catalogCardSold : ""}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className={styles.catalogMedia}>
        <Image
          src={apartment.preview}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 720px) 100vw, 25vw"
        />
        {(isSold || isRental) && (
          <span
            className={`${styles.statusBadge} ${
              isSold ? styles.statusSold : styles.statusRental
            }`}
          >
            {status.label}
          </span>
        )}
      </div>

      <div className={styles.catalogBody}>
        <div className={styles.catalogLotRow}>
          <div className={styles.catalogLot}>Лот {apartment.unit}</div>
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

        {!isSold ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => openLeadModal("viewing")}
          >
            {isRental ? "Узнать подробнее" : detailLabel}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
