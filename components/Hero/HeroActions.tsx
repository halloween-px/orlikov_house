"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useMainContext } from "@/context/MainProvider";
import type { HeroCta } from "@/types/hero";
import styles from "./styles/hero.module.css";

type HeroActionsProps = {
  secondaryCta?: HeroCta;
};

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

export default function HeroActions({ secondaryCta }: HeroActionsProps) {
  if (!secondaryCta) return null;

  return (
    <div className={styles.actions}>
      <HeroCtaButton cta={secondaryCta} />
    </div>
  );
}
