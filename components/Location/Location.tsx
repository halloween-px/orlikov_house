"use client";

import { useState } from "react";
import { Home } from "lucide-react";
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
import styles from "./styles/location.module.css";

export default function Location() {
  const { location } = landingConfig;
  const [mapActive, setMapActive] = useState(false);

  return (
    <LandingSection
      id={location.id}
      labelledBy="location-title"
      className={styles.locationSection}
    >
      <LandingContainer>
        <div className={styles.locationGrid}>
          <div
            className={styles.mapFrame}
            onMouseLeave={() => setMapActive(false)}
          >
            <iframe
              title="Карта — Садовая-Спасская 19к3"
              src={location.mapEmbedSrc}
              loading="lazy"
              allowFullScreen
              className={mapActive ? undefined : styles.mapInactive}
            />

            <div className={styles.mapPin} aria-hidden="true">
              <span className={styles.mapPinPulse} />
              <span className={styles.mapPinBadge}>
                <Home className={styles.mapPinIcon} strokeWidth={1.8} />
              </span>
            </div>

            {!mapActive && (
              <button
                type="button"
                className={styles.mapOverlay}
                onClick={() => setMapActive(true)}
                aria-label="Нажмите, чтобы взаимодействовать с картой"
              />
            )}
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
