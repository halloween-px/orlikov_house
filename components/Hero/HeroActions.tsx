"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useMainContext } from "@/context/MainProvider";
import type { HeroCta } from "@/types/hero";
import styles from "./styles/hero.module.css";

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

function HeroCtaButton({
  cta,
  className,
  children,
}: {
  cta: HeroCta;
  className?: string;
  children?: ReactNode;
}) {
  const { openLeadModal } = useMainContext();

  if (cta.action === "lead") {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={className}
        onClick={() => openLeadModal("viewing")}
      >
        {children ?? cta.label}
      </Button>
    );
  }

  return (
    <Button href={cta.href} variant="outline" size="lg" className={className}>
      {children ?? cta.label}
    </Button>
  );
}

export default function HeroActions({
  primaryCta,
  secondaryCta,
}: HeroActionsProps) {
  return (
    <div className={styles.actions}>
      <HeroCtaButton cta={primaryCta} className={styles.offersLink}>
        <span className={styles.offersLinkText}>{primaryCta.label}</span>
        <ArrowLine />
      </HeroCtaButton>

      {secondaryCta ? <HeroCtaButton cta={secondaryCta} /> : null}
    </div>
  );
}
