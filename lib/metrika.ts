"use client";

import { METRIKA_COUNTER_ID, siteGoals } from "@/config/metrika";
import {
  emptyAttribution,
  type LeadAttribution,
} from "@/lib/lead-attribution";

const STORAGE_KEY = "orlikov_visit_attribution";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

function clip(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 200);
}

function readStoredAttribution(): LeadAttribution {
  const empty = emptyAttribution();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<LeadAttribution>;
    return {
      utmSource: clip(parsed.utmSource || ""),
      utmMedium: clip(parsed.utmMedium || ""),
      utmCampaign: clip(parsed.utmCampaign || ""),
      utmContent: clip(parsed.utmContent || ""),
      utmTerm: clip(parsed.utmTerm || ""),
      yclid: clip(parsed.yclid || "").replace(/[^\d]/g, ""),
      metrikaClientId: "",
    };
  } catch {
    return empty;
  }
}

export function rememberAttribution() {
  const empty = emptyAttribution();
  if (typeof window === "undefined") return empty;

  const params = new URLSearchParams(window.location.search);
  const incoming: LeadAttribution = {
    utmSource: clip(params.get("utm_source") || ""),
    utmMedium: clip(params.get("utm_medium") || ""),
    utmCampaign: clip(params.get("utm_campaign") || ""),
    utmContent: clip(params.get("utm_content") || ""),
    utmTerm: clip(params.get("utm_term") || ""),
    yclid: clip(params.get("yclid") || "").replace(/[^\d]/g, ""),
    metrikaClientId: "",
  };
  const hasIncoming = Object.values(incoming).some(Boolean);
  const stored = hasIncoming ? incoming : readStoredAttribution();

  if (hasIncoming) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      return stored;
    }
  }

  return stored;
}

function clientIdFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)_ym_uid=([^;]+)/);
  if (!match) return "";
  return decodeURIComponent(match[1]).replace(/[^\d]/g, "").slice(0, 32);
}

function getMetrikaClientId() {
  return new Promise<string>((resolve) => {
    const finish = (clientId?: string) => {
      const fromApi = (clientId || "").replace(/[^\d]/g, "").slice(0, 32);
      resolve(fromApi || clientIdFromCookie());
    };

    if (!METRIKA_COUNTER_ID || typeof window.ym !== "function") {
      finish();
      return;
    }

    let settled = false;
    const done = (clientId?: string) => {
      if (settled) return;
      settled = true;
      finish(clientId);
    };

    try {
      window.ym(METRIKA_COUNTER_ID, "getClientID", (clientId: unknown) => {
        done(typeof clientId === "string" ? clientId : "");
      });
    } catch {
      done();
    }

    window.setTimeout(() => done(), 800);
  });
}

export async function collectAttribution(): Promise<LeadAttribution> {
  const stored = rememberAttribution();
  return {
    ...stored,
    metrikaClientId: await getMetrikaClientId(),
  };
}

export function reachGoal(goal: string, params?: Record<string, string>) {
  if (!METRIKA_COUNTER_ID || typeof window === "undefined") return;

  const send = () => {
    if (typeof window.ym !== "function") return false;
    window.ym(METRIKA_COUNTER_ID, "reachGoal", goal, params);
    return true;
  };

  if (send()) return;
  window.setTimeout(send, 700);
}

export function hitMetrika(url: string) {
  if (!METRIKA_COUNTER_ID || typeof window.ym !== "function") return;
  window.ym(METRIKA_COUNTER_ID, "hit", url);
}

export function reachSiteLeadGoals(input: {
  variant: "request" | "viewing" | "contacts";
  lot?: string;
}) {
  const params = input.lot ? { lot: input.lot } : undefined;
  reachGoal(siteGoals.formSubmit, params);
  if (input.variant === "viewing") {
    reachGoal(siteGoals.viewingRequest, params);
  }
  if (input.lot) {
    reachGoal(siteGoals.lotRequest, params);
  }
}
