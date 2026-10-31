import type { LeadAttribution } from "@/lib/lead-attribution";
import type { LeadAnswer } from "@/lib/lead-crm";

const ADMIN_LEADS_URL = "https://orlikovhouse.ru/admin/leads";

const TELEGRAM_TEXT_LIMIT = 4000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function field(label: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return `<b>${escapeHtml(label)}</b>\n${escapeHtml(trimmed)}`;
}

function phoneField(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const safePhone = escapeHtml(phone.trim());
  if (!digits) return field("Телефон", phone);
  return `<b>Телефон</b>\n<a href="tel:+${digits}">${safePhone}</a>`;
}

function attributionBlock(attribution?: LeadAttribution) {
  if (!attribution) return null;

  const lines = [
    [attribution.utmSource, attribution.utmMedium].filter(Boolean).join(" · "),
    attribution.utmCampaign ? `Кампания: ${attribution.utmCampaign}` : "",
    attribution.utmContent ? `Объявление: ${attribution.utmContent}` : "",
    attribution.utmTerm ? `Фраза: ${attribution.utmTerm}` : "",
  ].filter(Boolean);

  if (lines.length === 0) return null;
  return `<b>Реклама</b>\n${lines.map((line) => escapeHtml(line)).join("\n")}`;
}

function adminLeadsLink() {
  const href = escapeHtml(ADMIN_LEADS_URL);
  return `<a href="${href}">${href}</a>`;
}

function sentAt() {
  const time = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `<i>${escapeHtml(time)} · МСК</i>`;
}

function message(blocks: Array<string | null>) {
  return blocks.filter((block): block is string => Boolean(block)).join("\n\n");
}

export async function sendLeadTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";

  if (!token || !chatId) {
    console.error(
      "[lead:telegram] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не задан",
    );
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.slice(0, TELEGRAM_TEXT_LIMIT),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[lead:telegram]", response.status, body.slice(0, 300));
    }
  } catch (error) {
    console.error("[lead:telegram]", error);
  }
}

export function siteLeadTelegramText(input: {
  source: string;
  lot?: string;
  name: string;
  phone: string;
  comment?: string;
  attribution?: LeadAttribution;
}) {
  return message([
    "<b>Новая заявка · сайт</b>",
    field("Имя", input.name),
    phoneField(input.phone),
    field("Откуда", input.source),
    input.lot ? field("Лот", input.lot) : null,
    input.comment ? field("Комментарий", input.comment) : null,
    attributionBlock(input.attribution),
    adminLeadsLink(),
    sentAt(),
  ]);
}

export function quizLeadTelegramText(input: {
  phone: string;
  channel?: string;
  answers: LeadAnswer[];
  attribution?: LeadAttribution;
}) {
  return message([
    "<b>Новая заявка · квиз</b>",
    phoneField(input.phone),
    input.channel ? field("Куда связаться", input.channel) : null,
    ...input.answers.map((answer) => field(answer.label, answer.value)),
    attributionBlock(input.attribution),
    adminLeadsLink(),
    sentAt(),
  ]);
}
