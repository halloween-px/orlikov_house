export const LEAD_STATUSES = [
  { id: "new", label: "Новая" },
  { id: "in_progress", label: "В работе" },
  { id: "no_answer", label: "Не дозвонились" },
  { id: "viewing_scheduled", label: "Назначен просмотр" },
  { id: "viewing_done", label: "Просмотр состоялся" },
  { id: "no_show", label: "Клиент не приехал" },
  { id: "not_fit", label: "Не подходит" },
  { id: "reserved", label: "Бронь" },
  { id: "deal", label: "Сделка" },
] as const;

export const LEAD_ORIGINS = [
  { id: "site", label: "Сайт" },
  { id: "quiz", label: "Квиз" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["id"];
export type LeadOrigin = (typeof LEAD_ORIGINS)[number]["id"];

export type LeadAnswer = {
  label: string;
  value: string;
};

export type AdminLead = {
  id: string;
  createdAt: string;
  origin: LeadOrigin;
  name: string;
  phone: string;
  channel: string;
  source: string;
  lot: string;
  comment: string;
  answers: LeadAnswer[];
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  yclid: string;
  metrikaClientId: string;
  status: LeadStatus;
  managerComment: string;
};

const STATUS_IDS = new Set<string>(LEAD_STATUSES.map((item) => item.id));

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && STATUS_IDS.has(value);
}

export function leadStatusLabel(status: string) {
  return LEAD_STATUSES.find((item) => item.id === status)?.label ?? "Новая";
}

export function leadOriginLabel(origin: string) {
  return origin === "quiz" ? "Квиз" : "Сайт";
}

export function normalizeAnswers(input: unknown): LeadAnswer[] {
  if (!Array.isArray(input)) return [];

  const answers: LeadAnswer[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const label =
      typeof record.label === "string"
        ? record.label.replace(/\s+/g, " ").trim().slice(0, 120)
        : "";
    const value =
      typeof record.value === "string"
        ? record.value.replace(/\s+/g, " ").trim().slice(0, 300)
        : "";
    if (!label || !value) continue;
    answers.push({ label, value });
    if (answers.length >= 8) break;
  }

  return answers;
}
