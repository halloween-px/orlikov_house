import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
  isAdminConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

type LoginBody = {
  login?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Админка не настроена: задайте ADMIN_PASSWORD" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as LoginBody;
    const login = typeof body.login === "string" ? body.login.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyAdminCredentials(login, password)) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 },
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(getAdminCookieName(), token, getAdminCookieOptions());
    return response;
  } catch (error) {
    console.error("[admin/login]", error);
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
