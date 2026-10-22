"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FLOORS_COUNT,
  formatApartmentPrice,
  getApartmentAvailability,
  landingConfig,
  type Apartment,
} from "@/config";
import {
  LandingContainer,
  LandingSection,
  LandingTitle,
} from "@/components/shared/landing";
import { siteGoals } from "@/config/metrika";
import { reachGoal } from "@/lib/metrika";
import styles from "./styles/floor-plans.module.css";

type FloorPlansProps = {
  apartments: Apartment[];
};

export default function FloorPlans({ apartments }: FloorPlansProps) {
  const { floorPlans } = landingConfig;
  const [activeFloor, setActiveFloor] = useState(1);
  const planRef = useRef<HTMLDivElement>(null);
  const seenFloors = useRef(new Set<number>());

  useEffect(() => {
    const node = planRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (seenFloors.current.has(activeFloor)) return;
        seenFloors.current.add(activeFloor);
        reachGoal(siteGoals.layoutView, { floor: String(activeFloor) });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activeFloor]);

  const floorMeta =
    floorPlans.floors.find((item) => item.floor === activeFloor) ??
    floorPlans.floors[0];

  const floorLots = useMemo(
    () =>
      apartments
        .filter((apartment) => apartment.floor === activeFloor)
        .sort((a, b) => a.unit - b.unit),
    [apartments, activeFloor],
  );

  return (
    <LandingSection
      id={floorPlans.id}
      labelledBy="floor-plans-title"
      variant="alt"
      className={styles.section}
    >
      <LandingContainer>
        <header className={styles.header}>
          <LandingTitle
            id="floor-plans-title"
            measure="full"
            eyebrow={floorPlans.eyebrow}
            className={styles.title}
          >
            {floorMeta.label}
          </LandingTitle>

          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Этажность"
          >
            {floorPlans.floors.map((item) => {
              const isActive = item.floor === activeFloor;
              return (
                <button
                  key={item.floor}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  onClick={() => setActiveFloor(item.floor)}
                >
                  {item.floor}
                  <span className={styles.tabSuffix}>/{FLOORS_COUNT}</span>
                </button>
              );
            })}
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.planCol}>
            <div className={styles.planFrame} ref={planRef}>
              <Image
                key={floorMeta.plan}
                src={floorMeta.plan}
                alt={`Планировка ${floorMeta.label}`}
                fill
                className={styles.planImage}
                sizes="(max-width: 980px) 100vw, 58vw"
                priority={activeFloor === 1}
              />
            </div>
            <p className={styles.disclaimer}>{floorPlans.disclaimer}</p>
          </div>

          <div className={styles.listCol}>
            <p className={styles.listTitle}>
              {floorPlans.listTitle}{" "}
              <span className={styles.listCount}>· {floorLots.length}</span>
            </p>

            <ul className={styles.lotList}>
              {floorLots.length === 0 ? (
                <li className={styles.lotEmpty}>
                  На этом этаже нет доступных лотов
                </li>
              ) : (
                floorLots.map((apartment) => {
                  const isSold = apartment.availability === "sold";
                  const status = getApartmentAvailability(
                    apartment.availability,
                  );

                  return (
                    <li key={apartment.id}>
                      <Link
                        href={`/apartments/${apartment.id}`}
                        className={styles.lotRow}
                      >
                        <span className={styles.lotNumber}>
                          № {apartment.unit}
                        </span>
                        <span className={styles.lotMeta}>
                          <span className={styles.lotArea}>
                            {apartment.area}
                          </span>
                          <span className={styles.lotFinish}>
                            {apartment.finishLabel}
                          </span>
                        </span>
                        <span className={styles.lotPrice}>
                          {isSold
                            ? status.label
                            : formatApartmentPrice(apartment.price)}
                        </span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
