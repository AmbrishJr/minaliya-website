import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "minaliya-admin-session";

function isValidToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return false;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(secret + ":");
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Allow access to the login page
    if (pathname === "/admin/login") {
      // If already authenticated, redirect to dashboard
      const token = request.cookies.get(COOKIE_NAME)?.value;
      if (token && isValidToken(token)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Block all other /admin routes if not authenticated
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !isValidToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
