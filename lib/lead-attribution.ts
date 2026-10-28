export type LeadAttribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  yclid: string;
  metrikaClientId: string;
};

export function emptyAttribution(): LeadAttribution {
  return {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    yclid: "",
    metrikaClientId: "",
  };
}

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

export function sanitizeAttribution(input: unknown): LeadAttribution {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  return {
    utmSource: clip(source.utmSource, 200),
    utmMedium: clip(source.utmMedium, 200),
    utmCampaign: clip(source.utmCampaign, 200),
    utmContent: clip(source.utmContent, 200),
    utmTerm: clip(source.utmTerm, 200),
    yclid: clip(source.yclid, 64).replace(/[^\d]/g, ""),
    metrikaClientId: clip(source.metrikaClientId, 32).replace(/[^\d]/g, ""),
  };
}
