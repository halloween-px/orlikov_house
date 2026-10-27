import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/mongo";
import {
  isLeadStatus,
  normalizeAnswers,
  type AdminLead,
  type LeadAnswer,
  type LeadOrigin,
  type LeadStatus,
} from "@/lib/lead-crm";
import { Lead, Visit, hashIp, shortIpHash } from "@/lib/models";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function saveVisit(input: {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip: string;
}) {
  if (!isMongoConfigured()) return null;
  await connectMongo();

  const path = input.path.slice(0, 300);
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return null;
  }

  return Visit.create({
    path,
    referrer: (input.referrer || "").slice(0, 500),
    userAgent: (input.userAgent || "").slice(0, 400),
    ipHash: hashIp(input.ip || "unknown"),
  });
}

type StoredLead = {
  _id: { toString(): string };
  createdAt?: Date;
  name?: string;
  phone?: string;
  comment?: string;
  source?: string;
  lot?: string;
  channel?: string;
  answers?: unknown;
  origin?: string;
  status?: string;
  managerComment?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  yclid?: string;
  metrikaClientId?: string;
};

function mapAdminLead(lead: StoredLead): AdminLead {
  const origin: LeadOrigin = lead.origin === "quiz" ? "quiz" : "site";
  const status: LeadStatus = isLeadStatus(lead.status) ? lead.status : "new";

  return {
    id: String(lead._id),
    createdAt: new Date(lead.createdAt || Date.now()).toISOString(),
    origin,
    name: lead.name || "",
    phone: lead.phone || "",
    channel: lead.channel || "",
    source: lead.source || "",
    lot: lead.lot || "",
    comment: lead.comment || "",
    answers: normalizeAnswers(lead.answers),
    utmSource: lead.utmSource || "",
    utmMedium: lead.utmMedium || "",
    utmCampaign: lead.utmCampaign || "",
    utmContent: lead.utmContent || "",
    utmTerm: lead.utmTerm || "",
    yclid: lead.yclid || "",
    metrikaClientId: lead.metrikaClientId || "",
    status,
    managerComment: lead.managerComment || "",
  };
}

export async function saveLead(input: {
  name: string;
  phone: string;
  comment?: string;
  source: string;
  lot?: string;
  channel?: string;
  answers?: LeadAnswer[];
  origin?: LeadOrigin;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  yclid?: string;
  metrikaClientId?: string;
  ip: string;
}) {
  if (!isMongoConfigured()) return null;
  await connectMongo();

  return Lead.create({
    name: input.name.slice(0, 80),
    phone: input.phone.slice(0, 32),
    comment: (input.comment || "").slice(0, 1000),
    source: input.source.slice(0, 80),
    lot: (input.lot || "").slice(0, 8),
    channel: (input.channel || "").slice(0, 80),
    answers: normalizeAnswers(input.answers),
    origin: input.origin === "quiz" ? "quiz" : "site",
    status: "new",
    managerComment: "",
    utmSource: (input.utmSource || "").slice(0, 200),
    utmMedium: (input.utmMedium || "").slice(0, 200),
    utmCampaign: (input.utmCampaign || "").slice(0, 200),
    utmContent: (input.utmContent || "").slice(0, 200),
    utmTerm: (input.utmTerm || "").slice(0, 200),
    yclid: (input.yclid || "").slice(0, 64),
    metrikaClientId: (input.metrikaClientId || "").slice(0, 32),
    ipHash: hashIp(input.ip || "unknown"),
  });
}

export async function listAdminLeads() {
  await connectMongo();

  const [docs, total] = await Promise.all([
    Lead.find().sort({ createdAt: -1 }).limit(1000).lean(),
    Lead.countDocuments(),
  ]);

  return {
    leads: docs.map((lead) => mapAdminLead(lead as StoredLead)),
    total,
  };
}

export async function updateAdminLead(
  id: string,
  patch: {
    status?: LeadStatus;
    managerComment?: string;
  },
) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectMongo();

  const $set: Record<string, string> = {};
  if (patch.status) $set.status = patch.status;
  if (patch.managerComment !== undefined) {
    $set.managerComment = patch.managerComment.slice(0, 2000);
  }
  if (Object.keys($set).length === 0) return null;

  const updated = await Lead.findByIdAndUpdate(
    id,
    { $set },
    { new: true, runValidators: true },
  ).lean();

  return updated ? mapAdminLead(updated as StoredLead) : null;
}

export async function getAdminStats() {
  await connectMongo();

  const now = new Date();
  const today = startOfDay(now);
  const day7 = new Date(today);
  day7.setDate(day7.getDate() - 6);
  const day30 = new Date(today);
  day30.setDate(day30.getDate() - 29);

  const [
    visitsToday,
    visits7d,
    visitsTotal,
    leadsToday,
    leadsTotal,
    recentVisits,
    recentLeads,
    visitsForChart,
  ] = await Promise.all([
    Visit.countDocuments({ createdAt: { $gte: today } }),
    Visit.countDocuments({ createdAt: { $gte: day7 } }),
    Visit.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: today } }),
    Lead.countDocuments(),
    Visit.find().sort({ createdAt: -1 }).limit(40).lean(),
    Lead.find().sort({ createdAt: -1 }).limit(50).lean(),
    Visit.find({ createdAt: { $gte: day30 } })
      .select({ createdAt: 1 })
      .lean(),
  ]);

  const chartMap = new Map<string, number>();
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(day30);
    d.setDate(day30.getDate() + i);
    chartMap.set(dayKey(d), 0);
  }

  for (const visit of visitsForChart) {
    const key = dayKey(new Date(visit.createdAt as Date));
    chartMap.set(key, (chartMap.get(key) || 0) + 1);
  }

  const visitsByDay = [...chartMap.entries()].map(([date, count]) => ({
    date,
    count,
  }));

  return {
    kpi: {
      visitsToday,
      visits7d,
      visitsTotal,
      leadsToday,
      leadsTotal,
    },
    visitsByDay,
    recentVisits: recentVisits.map((visit) => ({
      id: String(visit._id),
      path: visit.path,
      referrer: visit.referrer || "",
      userAgent: visit.userAgent || "",
      visitor: shortIpHash(String(visit.ipHash || "")),
      createdAt: new Date(visit.createdAt as Date).toISOString(),
    })),
    recentLeads: recentLeads.map((lead) => ({
      id: String(lead._id),
      name: lead.name,
      phone: lead.phone,
      comment: lead.comment || "",
      source: lead.source,
      lot: lead.lot || "",
      utmSource: lead.utmSource || "",
      utmCampaign: lead.utmCampaign || "",
      utmContent: lead.utmContent || "",
      metrikaClientId: lead.metrikaClientId || "",
      visitor: shortIpHash(String(lead.ipHash || "")),
      createdAt: new Date(lead.createdAt as Date).toISOString(),
    })),
  };
}
