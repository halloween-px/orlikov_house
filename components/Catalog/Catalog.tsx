"use client";

import {
  apartmentsConfig,
  getNavLabel,
  landingConfig,
} from "@/config";
import { Button } from "@/components/ui/Button";
import { LeadButton } from "@/components/Contacts";
import {
  LandingContainer,
  LandingSection,
  LandingTitle,
} from "@/components/shared/landing";
import ApartmentCard from "./ApartmentCard";
import styles from "./styles/catalog.module.css";

const INITIAL_VISIBLE = 7;

function getOrderedApartments() {
  return [...apartmentsConfig].sort((a, b) => a.unit - b.unit);
}

export default function Catalog() {
  const { catalog } = landingConfig;
  const ordered = getOrderedApartments();
  const apartments = ordered.slice(0, INITIAL_VISIBLE);
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

          <LeadButton
            variant="secondary"
            size="md"
            className={styles.catalogLeadBtn}
          />
        </header>

        <div className={styles.catalogGrid}>
          <aside className={styles.introCard}>
            <div className={styles.introTop}>
              <p className={styles.introTitle}>{catalog.subtitle}</p>
              <p className={styles.introText}>{catalog.text}</p>
            </div>

            <div className={styles.introBottom}>
              {hasMore ? (
                <Button
                  href={catalog.introCard.cta.href}
                  variant="secondary"
                  size="md"
                  fullWidth
                  prefetch={false}
                >
                  {catalog.introCard.cta.label}
                </Button>
              ) : (
                <LeadButton variant="secondary" size="md" fullWidth />
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
