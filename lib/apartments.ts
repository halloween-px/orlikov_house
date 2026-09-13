import {
  allApartmentsConfig,
  TEMPORARILY_HIDDEN_UNITS,
  type Apartment,
  type ApartmentAvailability,
} from "@/config/apartments";
import { connectMongo, isMongoConfigured } from "@/lib/mongo";
import { ApartmentOverride } from "@/lib/models";

export type ApartmentEditableFields = {
  title: string;
  description: string;
  price: number;
  priceOld: number | null;
  promo: boolean;
  availability: ApartmentAvailability;
  highlights: string[];
  hidden: boolean;
};

export type AdminApartment = Apartment & {
  hidden: boolean;
  hasOverride: boolean;
};

type OverrideRecord = {
  apartmentId: string;
  title: string;
  description: string;
  price: number;
  priceOld?: number | null;
  promo?: boolean;
  availability: ApartmentAvailability;
  highlights?: string[];
  hidden?: boolean;
};

function baseHidden(unit: number) {
  return TEMPORARILY_HIDDEN_UNITS.has(unit);
}

function toPublicApartment(apartment: AdminApartment): Apartment {
  const result: Apartment = {
    id: apartment.id,
    unit: apartment.unit,
    floor: apartment.floor,
    name: apartment.name,
    title: apartment.title,
    area: apartment.area,
    rooms: apartment.rooms,
    windows: apartment.windows,
    finish: apartment.finish,
    finishLabel: apartment.finishLabel,
    description: apartment.description,
    highlights: apartment.highlights,
    price: apartment.price,
    availability: apartment.availability,
    address: apartment.address,
    preview: apartment.preview,
    images: apartment.images,
  };

  if (apartment.priceOld != null && apartment.priceOld > 0) {
    result.priceOld = apartment.priceOld;
  }
  if (apartment.promo) {
    result.promo = true;
  }

  return result;
}

function applyOverride(
  apartment: Apartment,
  override: OverrideRecord | undefined,
): AdminApartment {
  if (!override) {
    return {
      ...apartment,
      hidden: baseHidden(apartment.unit),
      hasOverride: false,
    };
  }

  const next: AdminApartment = {
    ...apartment,
    title: override.title,
    description: override.description,
    price: override.price,
    availability: override.availability,
    highlights: [...(override.highlights ?? [])],
    promo: Boolean(override.promo) || undefined,
    priceOld:
      override.priceOld != null && override.priceOld > 0
        ? override.priceOld
        : undefined,
    hidden: Boolean(override.hidden),
    hasOverride: true,
  };

  return next;
}

async function loadOverrides(): Promise<Map<string, OverrideRecord>> {
  const map = new Map<string, OverrideRecord>();
  if (!isMongoConfigured()) return map;

  try {
    await connectMongo();
    const rows = await ApartmentOverride.find().lean();
    for (const row of rows) {
      map.set(String(row.apartmentId), {
        apartmentId: String(row.apartmentId),
        title: String(row.title),
        description: String(row.description),
        price: Number(row.price),
        priceOld: row.priceOld == null ? null : Number(row.priceOld),
        promo: Boolean(row.promo),
        availability: row.availability as ApartmentAvailability,
        highlights: Array.isArray(row.highlights)
          ? row.highlights.map(String)
          : [],
        hidden: Boolean(row.hidden),
      });
    }
  } catch (error) {
    console.error("[apartments] failed to load overrides", error);
  }

  return map;
}

export async function getAdminApartments(): Promise<AdminApartment[]> {
  const overrides = await loadOverrides();
  return allApartmentsConfig
    .map((apartment) =>
      applyOverride(
        {
          ...apartment,
          highlights: [...apartment.highlights],
          images: [...apartment.images],
        },
        overrides.get(apartment.id),
      ),
    )
    .sort((a, b) => a.unit - b.unit);
}

export async function getVisibleApartments(): Promise<Apartment[]> {
  const all = await getAdminApartments();
  return all.filter((apartment) => !apartment.hidden).map(toPublicApartment);
}

export async function getVisibleApartmentById(
  id: string,
): Promise<Apartment | undefined> {
  const apartments = await getVisibleApartments();
  return apartments.find((apartment) => apartment.id === id);
}

export async function updateApartmentEditable(
  apartmentId: string,
  patch: ApartmentEditableFields,
): Promise<AdminApartment | null> {
  const base = allApartmentsConfig.find((item) => item.id === apartmentId);
  if (!base) return null;

  await connectMongo();

  await ApartmentOverride.findOneAndUpdate(
    { apartmentId },
    {
      apartmentId,
      title: patch.title.trim().slice(0, 120),
      description: patch.description.trim().slice(0, 300),
      price: patch.price,
      priceOld:
        patch.priceOld != null && patch.priceOld > 0 ? patch.priceOld : null,
      promo: Boolean(patch.promo),
      availability: patch.availability,
      highlights: patch.highlights
        .map((item) => item.trim().slice(0, 80))
        .filter(Boolean)
        .slice(0, 12),
      hidden: Boolean(patch.hidden),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const overrides = await loadOverrides();
  return applyOverride(
    {
      ...base,
      highlights: [...base.highlights],
      images: [...base.images],
    },
    overrides.get(apartmentId),
  );
}

export function isValidAvailability(
  value: unknown,
): value is ApartmentAvailability {
  return (
    value === "available" || value === "sold" || value === "rental_business"
  );
}

export function toEditableFields(
  apartment: AdminApartment,
): ApartmentEditableFields {
  return {
    title: apartment.title,
    description: apartment.description,
    price: apartment.price,
    priceOld: apartment.priceOld ?? null,
    promo: Boolean(apartment.promo),
    availability: apartment.availability,
    highlights: [...apartment.highlights],
    hidden: apartment.hidden,
  };
}
