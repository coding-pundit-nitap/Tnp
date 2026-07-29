import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return response;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow public pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/student/register") ||
    pathname.startsWith("/recruiter/register")
  ) {
    return withSecurityHeaders(NextResponse.next());
  }

  // Check session via Better Auth
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/login", req.url)),
    );
  }

  const role = (session.user as any).role || "STUDENT";

  // Role-based access control
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
    );
  }

  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
    );
  }

  if (pathname.startsWith("/recruiter") && role !== "RECRUITER") {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
    );
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/recruiter/:path*"],
};
