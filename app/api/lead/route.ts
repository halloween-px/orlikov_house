import { NextResponse } from "next/server";
import {
  checkLeadRateLimit,
  getRequestIp,
  validateLeadPayload,
  verifyLeadChallenge,
} from "@/lib/lead-security";
import { saveLead } from "@/lib/admin-data";
import { sendLeadEmail } from "@/lib/send-lead-email";

type LeadBody = {
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
  source?: unknown;
  challenge?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rate = checkLeadRateLimit(ip);
    if (!rate.ok) {
      return NextResponse.json({ error: rate.reason }, { status: 429 });
    }

    const body = (await request.json()) as LeadBody;
    const challenge =
      typeof body.challenge === "string" ? body.challenge : "";
    const challengeCheck = verifyLeadChallenge(challenge);
    if (!challengeCheck.ok) {
      return NextResponse.json(
        { error: challengeCheck.reason },
        { status: 400 },
      );
    }

    const validated = validateLeadPayload({
      name: body.name,
      phone: body.phone,
      comment: body.comment,
      honeypot: body.website,
    });

    if (!validated.ok) {
      if ("silent" in validated && validated.silent) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: validated.reason }, { status: 400 });
    }

    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 80)
        : "Сайт";

    try {
      await saveLead({
        ...validated.data,
        source,
        ip,
      });
    } catch (error) {
      console.error("[lead:db]", error);
    }

    await sendLeadEmail({
      ...validated.data,
      source,
      ip,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead]", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте позже." },
      { status: 500 },
    );
  }
}
