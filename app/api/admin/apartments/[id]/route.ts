import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  isValidAvailability,
  updateApartmentEditable,
  type ApartmentEditableFields,
} from "@/lib/apartments";
import { isMongoConfigured } from "@/lib/mongo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseBody(body: unknown): ApartmentEditableFields | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  if (typeof data.title !== "string" || !data.title.trim()) return null;
  if (typeof data.description !== "string" || !data.description.trim()) {
    return null;
  }
  if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price < 0) {
    return null;
  }
  if (!isValidAvailability(data.availability)) return null;
  if (typeof data.promo !== "boolean") return null;
  if (typeof data.hidden !== "boolean") return null;
  if (!Array.isArray(data.highlights)) return null;

  const highlights = data.highlights
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  let priceOld: number | null = null;
  if (data.priceOld === null || data.priceOld === "" || data.priceOld === undefined) {
    priceOld = null;
  } else if (
    typeof data.priceOld === "number" &&
    Number.isFinite(data.priceOld) &&
    data.priceOld > 0
  ) {
    priceOld = data.priceOld;
  } else {
    return null;
  }

  return {
    title: data.title,
    description: data.description,
    price: data.price,
    priceOld,
    promo: data.promo,
    availability: data.availability,
    highlights,
    hidden: data.hidden,
  };
}

export async function PATCH(request: Request, context: RouteContext) {
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

    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const patch = parseBody(body);
    if (!patch) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const apartment = await updateApartmentEditable(id, patch);
    if (!apartment) {
      return NextResponse.json({ error: "Лот не найден" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/apartments");
    revalidatePath(`/apartments/${id}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ apartment });
  } catch (error) {
    console.error("[admin/apartments/:id]", error);
    return NextResponse.json(
      { error: "Не удалось сохранить лот" },
      { status: 500 },
    );
  }
}
