"use client";

import { useState } from "react";
import Image from "next/image";
import {
  apartmentsConfig,
  formatApartmentPrice,
  getNavLabel,
  landingConfig,
} from "@/config";
import { Button } from "@/components/ui/Button";
import {
  LandingContainer,
  LandingSection,
  LandingTitle,
} from "@/components/shared/landing";
import styles from "./styles/catalog.module.css";

const INITIAL_VISIBLE = 7;

function getOrderedApartments() {
  return [...apartmentsConfig].sort((a, b) => a.unit - b.unit);
}

function ApartmentCard({
  apartment,
  detailLabel,
  delayMs = 0,
}: {
  apartment: (typeof apartmentsConfig)[number];
  detailLabel: string;
  delayMs?: number;
}) {
  return (
    <article
      className={styles.catalogCard}
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
      </div>

      <div className={styles.catalogBody}>
        <div className={styles.catalogLot}>Лот {apartment.unit}</div>

        <div className={styles.catalogMeta}>
          <span>{apartment.area}</span>
          <span>{apartment.title}</span>
          <span>{apartment.finishLabel}</span>
        </div>

        <div className={styles.catalogPrice}>
          {formatApartmentPrice(apartment.price)}
        </div>

        <Button href="#lead" variant="outline" size="md">
          {detailLabel}
        </Button>
      </div>
    </article>
  );
}

export default function Catalog() {
  const { catalog } = landingConfig;
  const [showAll, setShowAll] = useState(false);
  const ordered = getOrderedApartments();
  const apartments = showAll ? ordered : ordered.slice(0, INITIAL_VISIBLE);
  const hasMore = ordered.length > INITIAL_VISIBLE;

  return (
    <LandingSection id={catalog.id} labelledBy="catalog-title" variant="alt">
      <LandingContainer>
        <header className={styles.catalogHeader}>
          <LandingTitle
            id="catalog-title"
            measure="full"
            eyebrow={getNavLabel(catalog.id)}
            className={styles.catalogTitle}
          >
            Стильные{" "}
            <span className={styles.catalogTitleAccent}>дизайнерские</span>{" "}
            апартаменты
          </LandingTitle>

          <Button
            href="#lead"
            variant="secondary"
            size="md"
            className={styles.catalogLeadBtn}
          >
            Оставить заявку
          </Button>
        </header>

        <div className={styles.catalogGrid}>
          <aside className={styles.introCard}>
            <div className={styles.introTop}>
              <p className={styles.introTitle}>{catalog.subtitle}</p>
              <p className={styles.introText}>{catalog.text}</p>
            </div>

            <div className={styles.introBottom}>
              <div className={styles.introQuestion}>
                <p className={styles.introQuestionLabel}>
                  {catalog.introCard.questionLabel}
                </p>
                <p className={styles.introQuestionText}>
                  {catalog.introCard.questionText}
                </p>
              </div>

              {hasMore && !showAll ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setShowAll(true)}
                >
                  {catalog.introCard.cta.label}
                </Button>
              ) : (
                <Button href="#lead" variant="secondary" size="md" fullWidth>
                  Оставить заявку
                </Button>
              )}
            </div>
          </aside>

          {apartments.map((apartment, cardIndex) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              detailLabel={catalog.detailLabel}
              delayMs={cardIndex * 40}
            />
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
