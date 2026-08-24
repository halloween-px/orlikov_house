import { NextResponse } from "next/server";
import { getRequestIp } from "@/lib/lead-security";
import { isMongoConfigured } from "@/lib/mongo";
import { saveVisit } from "@/lib/admin-data";

const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview/i;

type VisitBody = {
  path?: unknown;
  referrer?: unknown;
};

export async function POST(request: Request) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const ua = request.headers.get("user-agent") || "";
    if (BOT_UA.test(ua)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = (await request.json()) as VisitBody;
    const path = typeof body.path === "string" ? body.path.trim() : "";
    if (!path.startsWith("/")) {
      return NextResponse.json({ error: "bad path" }, { status: 400 });
    }

    const referrer =
      typeof body.referrer === "string" ? body.referrer.trim() : "";

    await saveVisit({
      path,
      referrer,
      userAgent: ua,
      ip: getRequestIp(request),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/visit]", error);
    return NextResponse.json({ ok: true, skipped: true });
  }
}
