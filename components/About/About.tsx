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
  const { hotelStatus } = about;

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
              alt="Орликов дом — фасад и двор"
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
              measure="full"
              eyebrow={getNavLabel(about.id)}
            >
              Камерный дом{" "}
              <span className={styles.conceptTitleAccent}>премиум-класса</span>
            </LandingTitle>
            {about.text.map((paragraph) => (
              <LandingText
                key={paragraph}
                measure="full"
                className={styles.conceptText}
              >
                {paragraph}
              </LandingText>
            ))}
            <div className={styles.conceptChips}>
              <LandingChipsList items={about.conceptChips} ariaLabel="О доме" />
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

        <div className={styles.hotelStatus}>
          <LandingTitle
            id="hotel-status-title"
            as="h3"
            measure="full"
            className={styles.hotelStatusTitle}
          >
            {hotelStatus.title}{" "}
            <span className={styles.conceptTitleAccent}>
              — {hotelStatus.titleAccent}
            </span>
          </LandingTitle>

          <div className={styles.hotelStatusGrid}>
            <div className={styles.hotelStatusBody}>
              <div className={styles.hotelStatusCopy}>
                {hotelStatus.paragraphs.map((paragraph) => (
                  <LandingText
                    key={paragraph}
                    measure="full"
                    className={styles.hotelStatusText}
                  >
                    {paragraph}
                  </LandingText>
                ))}
              </div>

              <aside className={styles.hotelStatusPanel}>
                <p className={styles.hotelStatusPanelLead}>
                  <strong>{hotelStatus.ownershipTitle}</strong>{" "}
                  {hotelStatus.ownershipText}
                </p>
                <ul className={styles.hotelStatusStats}>
                  {hotelStatus.stats.map((stat) => (
                    <li key={stat.label}>
                      <span className={styles.hotelStatusStatLabel}>
                        {stat.label}
                      </span>
                      <strong className={styles.hotelStatusStatValue}>
                        {stat.value}
                      </strong>
                    </li>
                  ))}
                </ul>
              </aside>

              <LandingChipsList
                items={hotelStatus.chips}
                ariaLabel="Гостиничный статус"
                className={styles.hotelStatusChips}
              />

              <p className={styles.hotelStatusFootnote}>
                {hotelStatus.footnote}
              </p>
            </div>

            <div className={styles.hotelStatusMedia}>
              <Image
                src={hotelStatus.image}
                alt="Орликов дом — гостиничный формат"
                fill
                className="object-cover"
                sizes="(max-width: 1100px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
