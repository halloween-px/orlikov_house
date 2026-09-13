import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminApartments } from "@/lib/apartments";
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

    const apartments = await getAdminApartments();
    return NextResponse.json({ apartments });
  } catch (error) {
    console.error("[admin/apartments]", error);
    return NextResponse.json(
      { error: "Не удалось загрузить студии" },
      { status: 500 },
    );
  }
}
