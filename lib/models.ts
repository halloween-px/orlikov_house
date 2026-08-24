import { createHash } from "node:crypto";
import { Schema, models, model, type InferSchemaType } from "mongoose";

const VisitSchema = new Schema(
  {
    path: { type: String, required: true, maxlength: 300 },
    referrer: { type: String, default: "", maxlength: 500 },
    userAgent: { type: String, default: "", maxlength: 400 },
    ipHash: { type: String, required: true, maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

VisitSchema.index({ createdAt: -1 });
VisitSchema.index({ path: 1, createdAt: -1 });

const LeadSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    phone: { type: String, required: true, maxlength: 32 },
    comment: { type: String, default: "", maxlength: 1000 },
    source: { type: String, required: true, maxlength: 80 },
    ipHash: { type: String, required: true, maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

LeadSchema.index({ createdAt: -1 });

export type VisitDoc = InferSchemaType<typeof VisitSchema> & {
  _id: { toString(): string };
  createdAt: Date;
};

export type LeadDoc = InferSchemaType<typeof LeadSchema> & {
  _id: { toString(): string };
  createdAt: Date;
};

export const Visit =
  models.Visit || model("Visit", VisitSchema, "visits");

export const Lead = models.Lead || model("Lead", LeadSchema, "leads");

export function hashIp(ip: string) {
  const salt =
    process.env.ADMIN_SECRET ||
    process.env.LEAD_SECRET ||
    "orlikov-admin-ip-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function shortIpHash(hash: string) {
  return hash.slice(0, 8);
}
