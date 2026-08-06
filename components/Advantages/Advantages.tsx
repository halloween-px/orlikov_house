import {
  Building2,
  CalendarDays,
  DoorOpen,
  Hotel,
  KeyRound,
  LayoutTemplate,
  MapPin,
  Package,
  Palette,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { getNavLabel, landingConfig } from "@/config";
import { LeadButton } from "@/components/Contacts";
import {
  LandingContainer,
  LandingSection,
  LandingTitle,
} from "@/components/shared/landing";
import { BackgroundOrb } from "@/components/shared/decor";
import styles from "./styles/advantages.module.css";

const iconMap = {
  location: MapPin,
  format: Building2,
  common: DoorOpen,
  apartments: LayoutTemplate,
  ready: KeyRound,
  design: Palette,
  hotel: Hotel,
  invest: TrendingUp,
  extra: Package,
} satisfies Record<string, LucideIcon>;

type AdvantageIcon = keyof typeof iconMap;

export default function Advantages() {
  const { advantages } = landingConfig;
  const { cta } = advantages;

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

        <ol className={styles.timeline} aria-label="Ключевые преимущества">
          {advantages.cards.map((card, index) => {
            const Icon = iconMap[card.icon as AdvantageIcon];
            const step = String(index + 1).padStart(2, "0");

            return (
              <li
                key={card.title}
                className={styles.timelineItem}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={styles.timelineRail} aria-hidden="true">
                  <span className={styles.timelineNode}>
                    <Icon className={styles.timelineIcon} strokeWidth={1.4} />
                  </span>
                </div>

                <div className={styles.timelineBody}>
                  <span className={styles.timelineStep}>{step}</span>
                  <div className={styles.timelineCopy}>
                    <h3 className={styles.timelineTitle}>{card.title}</h3>
                    <ul className={styles.timelinePoints}>
                      {card.points.map((point) => (
                        <li key={point} className={styles.timelinePoint}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}

          <li
            className={`${styles.timelineItem} ${styles.timelineFinale}`}
            style={{ animationDelay: `${advantages.cards.length * 50}ms` }}
          >
            <div className={styles.timelineRail} aria-hidden="true">
              <span className={styles.timelineNode}>
                <CalendarDays
                  className={styles.timelineIcon}
                  strokeWidth={1.4}
                />
              </span>
            </div>

            <div className={styles.timelineBody}>
              <span className={styles.timelineStep}>{cta.step}</span>
              <div className={styles.timelineCopy}>
                <h3 className={styles.timelineTitle}>{cta.title}</h3>
                <ul className={styles.timelinePoints}>
                  {cta.points.map((point) => (
                    <li key={point} className={styles.timelinePoint}>
                      {point}
                    </li>
                  ))}
                </ul>
                <LeadButton
                  leadVariant="viewing"
                  variant="secondary"
                  size="md"
                  rounded="md"
                  fullWidth
                  className={styles.finaleButton}
                >
                  {cta.label}
                </LeadButton>
              </div>
            </div>
          </li>
        </ol>
      </LandingContainer>
    </LandingSection>
  );
}
