import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { saveLead } from "@/lib/admin-data";
import { sanitizeAttribution } from "@/lib/lead-attribution";
import { normalizeAnswers } from "@/lib/lead-crm";
import { isMongoConfigured } from "@/lib/mongo";
import {
  quizLeadTelegramText,
  sendLeadTelegram,
} from "@/lib/send-lead-telegram";

function secretMatches(provided: string, expected: string) {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function readSecret(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

export async function POST(request: Request) {
  const expected = process.env.LEAD_INGEST_SECRET?.trim() || "";
  if (!expected) {
    return NextResponse.json(
      { error: "Приём заявок не настроен" },
      { status: 503 },
    );
  }

  if (!secretMatches(readSecret(request), expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI не задан" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 11 || digits.length > 15) {
    return NextResponse.json({ error: "Некорректный телефон" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const channel =
    typeof body.channel === "string" ? body.channel.trim().slice(0, 80) : "";
  const answers = normalizeAnswers(body.answers);
  const attribution = sanitizeAttribution(body.attribution);
  const ip = typeof body.ip === "string" ? body.ip.trim().slice(0, 64) : "";

  try {
    await saveLead({
      name,
      phone: phone.slice(0, 32),
      source: "Квиз",
      channel,
      answers,
      origin: "quiz",
      ...attribution,
      ip: ip || "unknown",
    });
  } catch (error) {
    console.error("[leads/ingest]", error);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }

  await sendLeadTelegram(
    quizLeadTelegramText({
      phone,
      channel,
      answers,
      attribution,
    }),
  );

  return NextResponse.json({ ok: true });
}
