import { HTMLAttributes, ReactNode } from "react";
import {
  BackgroundOrbs,
  type BackgroundOrbsPreset,
} from "@/components/shared/decor";
import styles from "./common.module.css";

type LandingSectionProps = {
  id?: string;
  labelledBy?: string;
  variant?: "default" | "alt" | "muted";
  className?: string;
  /** Декоративные кружки на фоне секции */
  orbs?: false | BackgroundOrbsPreset;
  children: ReactNode;
};

const join = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(" ");

export function LandingSection({
  id,
  labelledBy,
  variant = "default",
  className,
  orbs = false,
  children,
}: LandingSectionProps) {
  const variantClassName =
    variant === "alt"
      ? styles.sectionAlt
      : variant === "muted"
        ? styles.sectionMuted
        : undefined;

  return (
    <section
      id={id}
      className={join(
        styles.section,
        variantClassName,
        orbs && styles.sectionOrbs,
        className,
      )}
      aria-labelledby={labelledBy}
    >
      {orbs ? <BackgroundOrbs preset={orbs} /> : null}
      {children}
    </section>
  );
}

type LandingContainerProps = {
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function LandingContainer({
  className,
  children,
  ...props
}: LandingContainerProps) {
  return (
    <div className={join(styles.inner, className)} {...props}>
      {children}
    </div>
  );
}

type TextTag = "p" | "div" | "span";
type HeadingTag = "h1" | "h2" | "h3" | "h4";
type LandingTitleVariant = "primary" | "secondary";
type LandingTextVariant = "default" | "muted";
type LandingMeasure = "default" | "full";
type LandingAlign = "start" | "center";

type BaseTextProps<T extends TextTag | HeadingTag> = {
  as?: T;
  className?: string;
  children: ReactNode;
  /** `default` — читаемая ширина строки; `full` — на всю колонку */
  measure?: LandingMeasure;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function LandingTitle<T extends HeadingTag = "h2">({
  as,
  variant = "primary",
  measure = "default",
  align = "start",
  eyebrow,
  className,
  children,
  ...props
}: BaseTextProps<T> & {
  variant?: LandingTitleVariant;
  align?: LandingAlign;
  /** Подпись в pill-обводке, как в Hero (обычно название из навигации) */
  eyebrow?: string;
}) {
  const Component = (as ?? "h2") as HeadingTag;
  const heading = (
    <Component
      className={join(
        styles.title,
        variant === "secondary" && styles.titleSecondary,
        measure === "full" && styles.titleFull,
        align === "center" && styles.titleCenter,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );

  if (!eyebrow) return heading;

  return (
    <div
      className={join(
        styles.titleBlock,
        align === "center" && styles.titleBlockCenter,
      )}
    >
      <span
        className={join(
          styles.eyebrow,
          align === "center" && styles.eyebrowCenter,
        )}
      >
        {eyebrow}
      </span>
      {heading}
    </div>
  );
}

export function LandingSubtitle<T extends TextTag = "p">({
  as,
  measure = "default",
  className,
  children,
  ...props
}: BaseTextProps<T>) {
  const Component = (as ?? "p") as TextTag;
  return (
    <Component
      className={join(
        styles.subtitle,
        measure === "full" && styles.subtitleFull,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function LandingText<T extends TextTag = "p">({
  as,
  variant = "default",
  measure = "default",
  className,
  children,
  ...props
}: BaseTextProps<T> & { variant?: LandingTextVariant }) {
  const Component = (as ?? "p") as TextTag;
  return (
    <Component
      className={join(
        styles.text,
        variant === "muted" && styles.textMuted,
        measure === "full" && styles.textFull,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

type LandingActionsProps = {
  className?: string;
  children: ReactNode;
};

export function LandingActions({
  className,
  children,
}: LandingActionsProps) {
  return <div className={join(styles.actions, className)}>{children}</div>;
}

type LandingChipsListProps = {
  items?: readonly string[];
  ariaLabel?: string;
  className?: string;
  itemClassName?: string;
};

export function LandingChipsList({
  items,
  ariaLabel,
  className,
  itemClassName,
}: LandingChipsListProps) {
  if (!items?.length) return null;

  return (
    <ul className={join(styles.chipsList, className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item} className={join(styles.chipPill, itemClassName)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const Landing = {
  Section: LandingSection,
  Container: LandingContainer,
  Title: LandingTitle,
  Subtitle: LandingSubtitle,
  Text: LandingText,
  Actions: LandingActions,
  ChipList: LandingChipsList,
  ChipsList: LandingChipsList,
};
