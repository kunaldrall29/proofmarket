import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = [
  "/home",
  "/profile",
  "/reports",
  "/health",
  "/medicines",
  "/appointments",
  "/wellness",
  "/consult",
  "/services",
  "/admin",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!needsAuth) return NextResponse.next();

  // Auth.js sets `__Secure-authjs.session-token` on HTTPS (Vercel).
  // getToken defaults to the non-secure cookie name unless secureCookie is true.
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: true,
  });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/reports/:path*",
    "/health/:path*",
    "/medicines/:path*",
    "/appointments/:path*",
    "/wellness/:path*",
    "/consult/:path*",
    "/services/:path*",
    "/admin/:path*",
  ],
};
