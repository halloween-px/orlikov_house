"use client";

import { getNavLabel, landingConfig } from "@/config";
import { Button } from "@/components/ui/Button";
import {
  LandingActions,
  LandingChipsList,
  LandingContainer,
  LandingSection,
  LandingSubtitle,
  LandingTitle,
} from "@/components/shared/landing";
import LocationMap from "./LocationMap";
import styles from "./styles/location.module.css";

export default function Location() {
  const { location } = landingConfig;

  return (
    <LandingSection
      id={location.id}
      labelledBy="location-title"
      className={styles.locationSection}
    >
      <LandingContainer>
        <div className={styles.locationGrid}>
          <div className={styles.mapFrame}>
            <LocationMap
              lat={location.coordinates.lat}
              lon={location.coordinates.lon}
              zoom={location.coordinates.zoom}
              title="Садовая-Спасская, 19к3"
            />
          </div>

          <aside className={styles.locationCard}>
            <div>
              <LandingTitle
                id="location-title"
                eyebrow={getNavLabel(location.id)}
              >
                {location.title}
              </LandingTitle>
              <LandingSubtitle>{location.subtitle}</LandingSubtitle>
            </div>

            <LandingChipsList items={location.chips} ariaLabel="Ориентиры" />

            <LandingActions className={styles.locationActions}>
              <Button
                href={location.mapCta.href}
                variant="outline"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {location.mapCta.label}
              </Button>
              <Button
                href={location.routeCta.href}
                variant="outline"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {location.routeCta.label}
              </Button>
            </LandingActions>
          </aside>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
