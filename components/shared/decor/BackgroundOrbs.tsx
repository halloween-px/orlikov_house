import type { CSSProperties, ReactNode } from "react";
import styles from "./background-orbs.module.css";

type OrbSize = "sm" | "md" | "lg" | "xl" | "xxl";

type BackgroundOrbProps = {
  size?: OrbSize;
  tone?: "gold" | "soft" | "mist";
  className?: string;
  style?: CSSProperties;
};

const join = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(" ");

/** Один декоративный кружок для фонов блоков */
export function BackgroundOrb({
  size = "md",
  tone = "gold",
  className,
  style,
}: BackgroundOrbProps) {
  return (
    <span
      aria-hidden
      className={join(
        styles.orb,
        styles[`size_${size}`],
        styles[`tone_${tone}`],
        className,
      )}
      style={style}
    />
  );
}

export type BackgroundOrbsPreset =
  | "cardCorner"
  | "sectionSparse"
  | "sectionLeft"
  | "sectionRight"
  | "sectionGlow"
  | "sectionRich";

type BackgroundOrbsProps = {
  /** Готовый набор кружков для типичных фонов */
  preset?: BackgroundOrbsPreset;
  className?: string;
  children?: ReactNode;
};

const presetOrbs: Record<BackgroundOrbsPreset, ReactNode> = {
  cardCorner: (
    <>
      <BackgroundOrb size="lg" className={styles.posTopRight} />
      <BackgroundOrb size="sm" tone="soft" className={styles.posBottomRight} />
    </>
  ),
  sectionSparse: (
    <>
      <BackgroundOrb size="md" tone="soft" className={styles.posSparseA} />
      <BackgroundOrb size="sm" className={styles.posSparseB} />
    </>
  ),
  sectionLeft: (
    <>
      <BackgroundOrb size="xl" tone="soft" className={styles.posLeftPrimary} />
      <BackgroundOrb size="md" className={styles.posLeftSecondary} />
      <BackgroundOrb size="sm" tone="soft" className={styles.posLeftAccent} />
    </>
  ),
  sectionRight: (
    <>
      <BackgroundOrb size="xl" className={styles.posRightPrimary} />
      <BackgroundOrb size="md" tone="soft" className={styles.posRightSecondary} />
      <BackgroundOrb size="sm" className={styles.posRightAccent} />
    </>
  ),
  sectionGlow: (
    <>
      <BackgroundOrb size="xl" className={styles.posSectionPrimary} />
      <BackgroundOrb size="md" tone="soft" className={styles.posSectionSecondary} />
      <BackgroundOrb size="sm" className={styles.posSectionAccent} />
    </>
  ),
  sectionRich: (
    <>
      <BackgroundOrb size="xl" tone="soft" className={styles.posRichA} />
      <BackgroundOrb size="lg" className={styles.posRichB} />
      <BackgroundOrb size="md" tone="soft" className={styles.posRichC} />
      <BackgroundOrb size="sm" className={styles.posRichD} />
    </>
  ),
};

/** Набор декоративных кружков — вставлять в relative + overflow:hidden контейнер */
export function BackgroundOrbs({
  preset = "cardCorner",
  className,
  children,
}: BackgroundOrbsProps) {
  return (
    <div
      aria-hidden
      data-decor-orbs
      className={join(styles.layer, styles[`preset_${preset}`], className)}
    >
      {children ?? presetOrbs[preset]}
    </div>
  );
}
