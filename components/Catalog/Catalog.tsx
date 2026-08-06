"use client";

import {
  apartmentsConfig,
  getLandingCatalogApartments,
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

export default function Catalog() {
  const { catalog } = landingConfig;
  const apartments = getLandingCatalogApartments(INITIAL_VISIBLE);
  const hasMore = apartmentsConfig.length > INITIAL_VISIBLE;

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
              <ul className={styles.introPoints}>
                {catalog.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
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
              requestLabel={catalog.requestLabel}
              delayMs={cardIndex * 40}
            />
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
