import {
  Building2,
  KeyRound,
  Layers3,
  Maximize2,
  TrainFront,
  type LucideIcon,
} from "lucide-react";
import { landingConfig } from "@/config";
import { LandingContainer } from "@/components/shared/landing";
import styles from "./styles/facts.module.css";

const iconMap = {
  building: Building2,
  layers: Layers3,
  maximize: Maximize2,
  train: TrainFront,
  key: KeyRound,
} satisfies Record<string, LucideIcon>;

type FactIcon = keyof typeof iconMap;

export default function Facts() {
  const { facts } = landingConfig;

  return (
    <section className={styles.facts} aria-label="Короткие факты">
      <LandingContainer>
        <ul className={styles.factsRow}>
          {facts.items.map((fact) => {
            const Icon = iconMap[fact.icon as FactIcon];

            return (
              <li key={fact.label} className={styles.factItem}>
                <Icon className={styles.factIcon} aria-hidden="true" strokeWidth={1.25} />
                <p className={styles.factValue}>{fact.value}</p>
                <p className={styles.factLabel}>{fact.label}</p>
              </li>
            );
          })}
        </ul>
      </LandingContainer>
    </section>
  );
}
