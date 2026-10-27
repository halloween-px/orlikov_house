import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { updateAdminLead } from "@/lib/admin-data";
import { isDemoLeadsEnabled, updateDemoLead } from "@/lib/demo-leads-store";
import { isLeadStatus, type LeadStatus } from "@/lib/lead-crm";
import { isMongoConfigured } from "@/lib/mongo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parsePatch(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const patch: {
    status?: LeadStatus;
    managerComment?: string;
  } = {};

  if ("status" in data) {
    if (!isLeadStatus(data.status)) return null;
    patch.status = data.status;
  }

  if ("managerComment" in data) {
    if (typeof data.managerComment !== "string") return null;
    patch.managerComment = data.managerComment.replace(/\r\n/g, "\n").trim();
  }

  if (
    patch.status === undefined && patch.managerComment === undefined
  ) {
    return null;
  }

  return patch;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isMongoConfigured()) {
      if (!isDemoLeadsEnabled()) {
        return NextResponse.json(
          { error: "MONGODB_URI не задан" },
          { status: 503 },
        );
      }

      const { id } = await context.params;
      const body = await request.json().catch(() => null);
      const patch = parsePatch(body);
      if (!patch) {
        return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
      }
      const lead = updateDemoLead(id, patch);
      if (!lead) {
        return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
      }
      return NextResponse.json({ lead });
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const patch = parsePatch(body);
    if (!patch) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const lead = await updateAdminLead(id, patch);
    if (!lead) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    console.error("[admin/leads/patch]", error);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }
}
