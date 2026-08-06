import { createHmac, timingSafeEqual } from "node:crypto";
import { leadConfig } from "@/config/lead";

type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();

function getSecret() {
  return (
    process.env.LEAD_SECRET ||
    process.env.SMTP_PASS ||
    process.env.RESEND_API_KEY ||
    "orlikov-haus-dev-lead-secret"
  );
}

export function createLeadChallenge(now = Date.now()) {
  const nonce = Math.random().toString(36).slice(2, 12);
  const payload = `${now}.${nonce}`;
  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  return {
    challenge: `${payload}.${signature}`,
    issuedAt: now,
  };
}

export function verifyLeadChallenge(challenge: string, now = Date.now()) {
  const parts = challenge.split(".");
  if (parts.length !== 3) {
    return { ok: false as const, reason: "Некорректный токен формы" };
  }

  const [issuedRaw, nonce, signature] = parts;
  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt) || !nonce || !signature) {
    return { ok: false as const, reason: "Некорректный токен формы" };
  }

  const payload = `${issuedAt}.${nonce}`;
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return { ok: false as const, reason: "Некорректный токен формы" };
  }

  const age = now - issuedAt;
  if (age < leadConfig.minFillMs) {
    return { ok: false as const, reason: "Форма отправлена слишком быстро" };
  }
  if (age > leadConfig.maxFillMs) {
    return { ok: false as const, reason: "Токен формы устарел, обновите страницу" };
  }

  return { ok: true as const };
}

export function checkLeadRateLimit(ip: string, now = Date.now()) {
  const existing = rateBuckets.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(ip, {
      count: 1,
      resetAt: now + leadConfig.rateLimit.windowMs,
    });
    return { ok: true as const };
  }

  if (existing.count >= leadConfig.rateLimit.max) {
    return {
      ok: false as const,
      reason: "Слишком много заявок. Попробуйте позже.",
    };
  }

  existing.count += 1;
  rateBuckets.set(ip, existing);
  return { ok: true as const };
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export function validateLeadPayload(input: {
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
  honeypot?: unknown;
}) {
  if (typeof input.honeypot === "string" && input.honeypot.trim()) {
    return { ok: false as const, reason: "spam", silent: true };
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phoneRaw = typeof input.phone === "string" ? input.phone.trim() : "";
  const comment =
    typeof input.comment === "string" ? input.comment.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return { ok: false as const, reason: "Укажите корректное имя" };
  }

  const phone = normalizePhone(phoneRaw);
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return { ok: false as const, reason: "Укажите корректный телефон" };
  }

  if (comment.length > 1000) {
    return { ok: false as const, reason: "Комментарий слишком длинный" };
  }

  if ((comment.match(/https?:\/\//gi) || []).length > 1) {
    return { ok: false as const, reason: "spam", silent: true };
  }

  return {
    ok: true as const,
    data: { name, phone: phoneRaw, comment },
  };
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}
