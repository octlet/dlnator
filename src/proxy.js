import { NextResponse } from "next/server";
import { SESSION_COOKIE, isAuthEnabled, getSessionToken } from "./helpers/auth";

const PUBLIC_PATHS = new Set([
  "/login",
  "/api/auth/login",
  "/api/health",
  "/logo.svg",
  "/plyr.svg",
]);

export async function proxy(req) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const expected = await getSessionToken();
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;

  if (cookie && cookie === expected) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
