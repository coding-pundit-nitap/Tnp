import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  role: "ADMIN" | "STUDENT" | "RECRUITER";
};

export function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return response;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const pathname = req.nextUrl.pathname;

  // allow login page
  if (pathname.startsWith("/login")) {
    return withSecurityHeaders(NextResponse.next());
  }

  // allow public registration pages
  if (
    pathname.startsWith("/student/register") ||
    pathname.startsWith("/recruiter/register")
  ) {
    return withSecurityHeaders(NextResponse.next());
  }

  if (!token) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/login", req.url)),
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/unauthorized", req.url)),
      );
    }

    if (pathname.startsWith("/student") && decoded.role !== "STUDENT") {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/unauthorized", req.url)),
      );
    }

    if (pathname.startsWith("/recruiter") && decoded.role !== "RECRUITER") {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/unauthorized", req.url)),
      );
    }

    return withSecurityHeaders(NextResponse.next());
  } catch {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/login", req.url)),
    );
  }
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/recruiter/:path*"],
};

// Use Node.js runtime since jsonwebtoken doesn't support Edge
export const runtime = "nodejs";
