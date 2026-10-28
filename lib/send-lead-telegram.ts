import {
  attributionLines,
  type LeadAttribution,
} from "@/lib/lead-attribution";
import type { LeadAnswer } from "@/lib/lead-crm";

const TELEGRAM_TEXT_LIMIT = 4000;

export async function sendLeadTelegram(lines: Array<string | null | undefined>) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";

  if (!token || !chatId) {
    console.error(
      "[lead:telegram] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не задан",
    );
    return;
  }

  const text = lines
    .filter((line): line is string => Boolean(line))
    .join("\n")
    .slice(0, TELEGRAM_TEXT_LIMIT);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
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

export function siteLeadTelegramLines(input: {
  source: string;
  lot?: string;
  name: string;
  phone: string;
  comment?: string;
  attribution?: LeadAttribution;
}) {
  return [
    "Новая заявка с сайта",
    `Источник: ${input.source}`,
    input.lot ? `Лот: ${input.lot}` : null,
    `Имя: ${input.name}`,
    `Телефон: ${input.phone}`,
    input.comment ? `Комментарий: ${input.comment}` : null,
    ...(input.attribution ? attributionLines(input.attribution) : []),
  ];
}

export function quizLeadTelegramLines(input: {
  phone: string;
  channel?: string;
  answers: LeadAnswer[];
  attribution?: LeadAttribution;
}) {
  return [
    "Новая заявка с квиза",
    `Телефон: ${input.phone}`,
    input.channel ? `Куда связаться: ${input.channel}` : null,
    ...input.answers.map((answer) => `${answer.label}: ${answer.value}`),
    ...(input.attribution ? attributionLines(input.attribution) : []),
  ];
}
