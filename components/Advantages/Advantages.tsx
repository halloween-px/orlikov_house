import {
  Building2,
  Hotel,
  KeyRound,
  Lock,
  MapPin,
  Palette,
  ShieldCheck,
  TrainFront,
  TrendingUp,
  VolumeX,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getNavLabel, landingConfig } from "@/config";
import { Button } from "@/components/ui/Button";
import {
  LandingActions,
  LandingContainer,
  LandingSection,
  LandingTitle,
} from "@/components/shared/landing";
import { BackgroundOrb } from "@/components/shared/decor";
import styles from "./styles/advantages.module.css";

const iconMap = {
  metro: TrainFront,
  quiet: VolumeX,
  chamber: Building2,
  design: Palette,
  ready: KeyRound,
  security: ShieldCheck,
  management: Wrench,
  storage: Lock,
  hotel: Hotel,
  invest: TrendingUp,
  formats: KeyRound,
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

        <ol className={styles.timeline} aria-label="Преимущества дома">
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
                    <p className={styles.timelineText}>{card.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <LandingActions className={styles.advantagesCta}>
          <Button href={advantages.cta.href} variant="secondary" size="lg">
            {advantages.cta.label}
          </Button>
        </LandingActions>
      </LandingContainer>
    </LandingSection>
  );
}
