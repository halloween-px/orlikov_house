import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminStats } from "@/lib/admin-data";
import { isMongoConfigured } from "@/lib/mongo";

export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: "MONGODB_URI не задан" },
        { status: 503 },
      );
    }

    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[admin/stats]", error);
    return NextResponse.json(
      { error: "Не удалось загрузить статистику" },
      { status: 500 },
    );
  }
}
