import { NextResponse } from "next/server";
import { createLeadChallenge } from "@/lib/lead-security";

export async function GET() {
  const challenge = createLeadChallenge();
  return NextResponse.json(challenge, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
