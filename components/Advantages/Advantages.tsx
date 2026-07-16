import Image from "next/image";
import {
  Archive,
  Box,
  KeyRound,
  MapPin,
  VolumeX,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getNavLabel, landingConfig } from "@/config";
import { Button } from "@/components/ui/Button";
import {
  LandingContainer,
  LandingSection,
  LandingSubtitle,
  LandingText,
  LandingTitle,
} from "@/components/shared/landing";
import { BackgroundOrb } from "@/components/shared/decor";
import styles from "./styles/advantages.module.css";

const iconMap = {
  formats: KeyRound,
  storage: Archive,
  quiet: VolumeX,
  comms: Zap,
  cellar: Box,
  rental: MapPin,
} satisfies Record<string, LucideIcon>;

type AdvantageIcon = keyof typeof iconMap;

export default function Advantages() {
  const { advantages } = landingConfig;

  return (
    <LandingSection
      id={advantages.id}
      labelledBy="advantages-title"
      variant="alt"
      className={styles.advantagesSection}
    >
      <BackgroundOrb size="xxl" tone="mist" className={styles.advantagesOrb} />
      <LandingContainer>
        <header className={styles.advantagesHeader}>
          <LandingTitle
            id="advantages-title"
            align="center"
            eyebrow={getNavLabel(advantages.id)}
          >
            {advantages.title}
          </LandingTitle>
        </header>

        <div className={styles.advantagesGrid}>
          {advantages.cards.map((card) => {
            const Icon = iconMap[card.icon as AdvantageIcon];

            return (
              <article key={card.title} className={styles.advantageCard}>
                <div className={styles.advantageIconWrap} aria-hidden="true">
                  <Icon className={styles.advantageIcon} strokeWidth={1.35} />
                </div>
                <div className={styles.advantageContent}>
                  <h3 className={styles.advantageTitle}>{card.title}</h3>
                  <p className={styles.advantageText}>{card.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.storageBlock}>
          <Image
            src={advantages.storage.image}
            alt=""
            fill
            className={`object-cover ${styles.storageImage}`}
            sizes="100vw"
          />
          <div className={styles.storageLayout}>
            <div className={styles.storageInner}>
              <LandingTitle
                as="h3"
                variant="secondary"
                style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
              >
                {advantages.storage.title}
              </LandingTitle>
              <LandingSubtitle>{advantages.storage.subtitle}</LandingSubtitle>
              <LandingText>{advantages.storage.text}</LandingText>
              <Button
                href={advantages.storage.cta.href}
                variant="outline"
                size="lg"
              >
                {advantages.storage.cta.label}
              </Button>
            </div>

            <ul
              className={styles.storageChips}
              aria-label="Ключевые особенности"
            >
              {advantages.storage.chips.map((chip) => (
                <li key={chip} className={styles.storageChip}>
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
