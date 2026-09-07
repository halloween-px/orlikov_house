"use client";

import {
  apartmentsConfig,
  getLandingCatalogApartments,
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
import { useWindowSize } from "@/hooks/useWindowSize";

const INITIAL_VISIBLE = 7;

export default function Catalog() {
  const { catalog } = landingConfig;
  const windowWidth = useWindowSize();
  const isMobile = windowWidth < 720;
  const apartments = getLandingCatalogApartments(
    !isMobile ? INITIAL_VISIBLE : 3,
  );
  const hasMore = apartmentsConfig.length > INITIAL_VISIBLE;

  return (
    <LandingSection id={catalog.id} labelledBy="catalog-title" variant="alt">
      <LandingContainer>
        <header className={styles.catalogHeader}>
          <LandingTitle
            id="catalog-title"
            measure="full"
            eyebrow={catalog.eyebrow}
            className={styles.catalogTitle}
          >
            Студии с{" "}
            <span className={styles.catalogTitleAccent}>готовой отделкой</span>
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
              <p className={styles.introText}>{catalog.subtitle}</p>
              <p className={styles.introText}>{catalog.text}</p>
              <ul className={styles.introPoints}>
                {catalog.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className={styles.introBottom}>
              {hasMore && !isMobile && (
                <Button
                  href={catalog.introCard.cta.href}
                  variant="secondary"
                  size="md"
                  fullWidth
                  prefetch={false}
                >
                  {catalog.introCard.cta.label}
                </Button>
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
          {isMobile && (
            <div className={styles.mobileButtonActions}>
              <Button
                href={catalog.introCard.cta.href}
                variant="secondary"
                size="md"
                fullWidth
                prefetch={false}
              >
                {catalog.introCard.cta.label}
              </Button>
              <Button
                href={catalog.presentationCta.href}
                download={catalog.presentationCta.download}
                fullWidth
                variant="outline"
                size="lg"
              >
                {catalog.presentationCta.label}
              </Button>
            </div>
          )}
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
