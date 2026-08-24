import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "orlikov_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getAdminLogin() {
  return process.env.ADMIN_LOGIN || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getAdminSecret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.LEAD_SECRET ||
    "orlikov-admin-dev-secret"
  );
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminCredentials(login: string, password: string) {
  if (!getAdminPassword()) return false;
  return login === getAdminLogin() && password === getAdminPassword();
}

function sign(payload: string) {
  return createHmac("sha256", getAdminSecret()).update(payload).digest("hex");
}

export function createAdminSessionToken(now = Date.now()) {
  const payload = `admin.${now}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string, now = Date.now()) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [role, issuedRaw, signature] = parts;
  if (role !== "admin") return false;

  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const ageMs = now - issuedAt;
  if (ageMs < 0 || ageMs > MAX_AGE_SEC * 1000) return false;

  const payload = `${role}.${issuedRaw}`;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return false;
  }

  return true;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export function readAdminTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return "";
  return decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
}

export function isAdminRequest(request: Request) {
  const token = readAdminTokenFromCookieHeader(request.headers.get("cookie"));
  return verifyAdminSessionToken(token);
}
