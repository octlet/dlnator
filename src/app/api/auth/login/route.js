import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  getSessionToken,
  timingSafeEqual,
} from "../../../../helpers/auth";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.AUTH_PASSWORD;

  if (!expected || !timingSafeEqual(password, expected)) {
    return NextResponse.json({ error: "incorrect password" }, { status: 401 });
  }

  const token = await getSessionToken();
  const res = NextResponse.json({ success: true });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Not marked secure: this app is designed for plain-HTTP LAN access
    // (see README), and browsers silently drop Secure cookies over HTTP.
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
