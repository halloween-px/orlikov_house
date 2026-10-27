import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listAdminLeads } from "@/lib/admin-data";
import { isDemoLeadsEnabled, listDemoLeads } from "@/lib/demo-leads-store";
import { isMongoConfigured } from "@/lib/mongo";

export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isMongoConfigured()) {
      if (isDemoLeadsEnabled()) {
        return NextResponse.json(listDemoLeads());
      }
      return NextResponse.json(
        { error: "MONGODB_URI не задан" },
        { status: 503 },
      );
    }

    const data = await listAdminLeads();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[admin/leads]", error);
    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 500 },
    );
  }
}
