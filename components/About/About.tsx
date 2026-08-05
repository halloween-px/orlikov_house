import Image from "next/image";
import { getNavLabel, landingConfig } from "@/config";
import { Button } from "@/components/ui/Button";
import {
  LandingActions,
  LandingChipsList,
  LandingContainer,
  LandingSection,
  LandingText,
  LandingTitle,
} from "@/components/shared/landing";
import { BackgroundOrb } from "@/components/shared/decor";
import styles from "./styles/about.module.css";

export default function About() {
  const { about } = landingConfig;

  return (
    <LandingSection
      id={about.id}
      labelledBy="about-title"
      className={styles.aboutSection}
    >
      <LandingContainer>
        <div className={styles.conceptLayout}>
          <div className={styles.aboutMedia}>
            <Image
              src={about.image}
              alt="Интерьер апартаментов Орликов Хаус"
              fill
              className="object-cover"
              sizes="(max-width: 1100px) 100vw, 40vw"
            />
          </div>

          <div className={styles.conceptContent}>
            <BackgroundOrb
              size="xxl"
              tone="mist"
              className={styles.conceptOrb}
            />
            <LandingTitle
              id="about-title"
              as="h3"
              variant="secondary"
              measure="full"
              eyebrow={getNavLabel(about.id)}
            >
              Камерный{" "}
              <span className={styles.conceptTitlePrimary}>
                дом апартаментов
              </span>
            </LandingTitle>
            <LandingText measure="full" className={styles.conceptText}>
              {about.text}
            </LandingText>
            <div className={styles.conceptChips}>
              <LandingChipsList
                items={about.conceptChips}
                ariaLabel="Концепция дома"
              />
            </div>

            <LandingActions className={styles.conceptActions}>
              <Button
                href={about.presentationCta.href}
                download={about.presentationCta.download}
                variant="outline"
                size="lg"
              >
                {about.presentationCta.label}
              </Button>
            </LandingActions>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
