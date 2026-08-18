import nodemailer from "nodemailer";
import { leadConfig } from "@/config/lead";

export type LeadMailPayload = {
  name: string;
  phone: string;
  comment?: string;
  source: string;
  ip: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "smtp.yandex.ru";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (!user || !pass) return null;

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from: process.env.SMTP_FROM || user,
  };
}

async function sendViaResend(payload: LeadMailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from =
    process.env.RESEND_FROM || "Орликов дом <onboarding@resend.dev>";
  const subject = `Заявка: ${payload.source} — ${payload.name}`;
  const text = [
    `Источник: ${payload.source}`,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.comment ? `Комментарий: ${payload.comment}` : null,
    `IP: ${payload.ip}`,
    `Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [leadConfig.toEmail],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend error: ${response.status} ${details}`);
  }

  return true;
}

async function sendViaSmtp(payload: LeadMailPayload) {
  const smtp = getSmtpConfig();
  if (!smtp) return false;

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });

  const subject = `Заявка: ${payload.source} — ${payload.name}`;
  const text = [
    `Источник: ${payload.source}`,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.comment ? `Комментарий: ${payload.comment}` : null,
    `IP: ${payload.ip}`,
    `Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: `"${leadConfig.fromName}" <${smtp.from}>`,
    to: leadConfig.toEmail,
    subject,
    text,
    replyTo: undefined,
  });

  return true;
}

export async function sendLeadEmail(payload: LeadMailPayload) {
  if (await sendViaResend(payload)) return { provider: "resend" as const };
  if (await sendViaSmtp(payload)) return { provider: "smtp" as const };

  if (process.env.NODE_ENV !== "production") {
    console.info("[lead:dev]", {
      to: leadConfig.toEmail,
      ...payload,
    });
    return { provider: "dev-log" as const };
  }

  throw new Error(
    "Почтовый сервис не настроен. Укажите RESEND_API_KEY или SMTP_USER/SMTP_PASS.",
  );
}
