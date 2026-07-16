import { Button } from "@/components/ui/Button";
import styles from "./styles/hero.module.css";

type HeroCta = {
  label: string;
  href: string;
};

type HeroActionsProps = {
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
};

function ArrowLine() {
  return (
    <svg
      className={styles.offersLinkArrow}
      height="23"
      viewBox="0 0 136 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="0" y1="11.5" x2="115" y2="11.5" stroke="currentColor" />
      <path d="M119 1L135 11.5L119 22" stroke="currentColor" />
    </svg>
  );
}

export default function HeroActions({
  primaryCta,
  secondaryCta,
}: HeroActionsProps) {
  return (
    <div className={styles.actions}>
      <Button
        href={primaryCta.href}
        variant="outline"
        size="lg"
        className={styles.offersLink}
      >
        <span className={styles.offersLinkText}>{primaryCta.label}</span>
        <ArrowLine />
      </Button>

      {secondaryCta && (
        <Button href={secondaryCta.href} variant="outline" size="lg">
          {secondaryCta.label}
        </Button>
      )}
    </div>
  );
}
