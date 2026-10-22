"use client";

import { useEffect } from "react";
import { siteGoals } from "@/config/metrika";
import { reachGoal } from "@/lib/metrika";

type LotOpenTrackerProps = {
  unit: number;
};

export default function LotOpenTracker({ unit }: LotOpenTrackerProps) {
  useEffect(() => {
    reachGoal(siteGoals.lotOpen, { lot: String(unit) });
  }, [unit]);

  return null;
}
