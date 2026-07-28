# 🔧 Improvements Implementation Guide

**Companion to:** DEPLOYMENT_READINESS_CHECKLIST.md  
**Purpose:** Detailed implementation guidance for critical improvements  
**Last Updated:** February 17, 2026

---

## 📋 Table of Contents

1. [Critical Security Fixes (Implement First)](#critical-security-fixes-implement-first)
2. [Essential Features](#essential-features)
3. [Performance Optimizations](#performance-optimizations)
4. [Testing Setup](#testing-setup)
5. [Monitoring & Error Tracking](#monitoring--error-tracking)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Database Optimizations](#database-optimizations)

---

## 🚨 Critical Security Fixes (Implement First)

### 1. Create Middleware.ts (CRITICAL - BLOCKING)

**File:** `middleware.ts` (create in root directory)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

// Define protected routes
const protectedRoutes = {
  admin: ["/admin"],
  student: ["/student"],
  recruiter: ["/recruiter"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = [
    "/",
    "/login",
    "/why-recruit",
    "/placements",
    "/unauthorized",
  ];
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith("/api/public"),
    )
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify JWT
  const user = await verifyJWT(token);
  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  // Role-based access control
  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/student") && user.role !== "STUDENT") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/recruiter") && user.role !== "RECRUITER") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
```

**Update:** `lib/auth.ts` - Add verifyJWT function

```typescript
// Add this function to lib/auth.ts

import { cookies } from "next/headers";

export async function verifyJWT(
  token: string,
): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

// Helper to get current user in Server Components
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  return await verifyJWT(token);
}
```

---

### 2. Enhance Security Headers in next.config.ts

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Hide X-Powered-By header

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Restrict this in production to specific domains
      },
    ],
  },

  // Compression
  compress: true,

  // Production source maps (disable for security)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
```

---

### 3. Enhance Database Connection Pooling

**File:** `lib/prisma.ts` (update)

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "minimal",
  }).$extends({
    query: {
      $allOperations({ operation, model, args, query }) {
        // Add connection timeout
        const start = performance.now();
        const result = query(args);
        const end = performance.now();

        // Log slow queries in production
        if (end - start > 1000) {
          console.warn(
            `Slow query detected: ${model}.${operation} took ${end - start}ms`,
          );
        }

        return result;
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Connection pooling configuration for production
// Add to .env.production:
// DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10&pool_timeout=20"
```

---

### 4. Add Error Boundary Component

**File:** `components/ErrorBoundary.tsx` (create)

```typescript
"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service (Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // TODO: Send to Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="flex mb-4 items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 p-4 bg-gray-100 rounded">
                  <summary className="cursor-pointer font-semibold">Error Details</summary>
                  <pre className="mt-2 text-sm text-red-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Usage:** Wrap critical pages in `app/layout.tsx`

```typescript
// app/layout.tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## ✨ Essential Features

### 1. Password Recovery Flow

**File:** `app/forgot-password/page.tsx` (create)

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Password reset link sent! Check your email.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send reset link");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            <p>{message}</p>
            <Link href="/login" className="text-green-600 hover:underline mt-2 block">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {status === "error" && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-blue-600 hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

**File:** `actions/auth.ts` (add functions)

```typescript
// Add to actions/auth.ts

import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function requestPasswordReset(email: string) {
  "use server";

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return { success: true };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to database (add these fields to User model)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetTokenExpiry,
      },
    });

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: `Click here to reset your password: ${resetUrl}\n\nThis link expires in 15 minutes.`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to process request" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  "use server";

  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      return { success: false, error: "Invalid or expired token" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Password Changed",
      text: "Your password has been successfully changed.",
      html: `
        <h2>Password Changed</h2>
        <p>Your password has been successfully changed.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
```

**Database Migration:** Add to `schema.prisma`

```prisma
model User {
  // ... existing fields

  passwordResetToken    String?
  passwordResetExpiry   DateTime?

  // ... rest of model
}
```

Run: `npx prisma migrate dev --name add_password_reset`

---

### 2. Real-time Notifications

**File:** `lib/notifications.ts` (create)

```typescript
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  link?: string;
}) {
  try {
    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });

    // Get user email preference
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    // Send email notification (optional - check user preferences)
    if (user) {
      await sendEmail({
        to: user.email,
        subject: title,
        text: message,
        html: `
          <h2>${title}</h2>
          <p>${message}</p>
          ${link ? `<p><a href="${process.env.NEXT_PUBLIC_APP_URL}${link}">View Details</a></p>` : ""}
        `,
      });
    }

    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

// Helper functions
export async function notifyApplicationStatus(
  studentId: string,
  jobTitle: string,
  status: string,
) {
  return createNotification({
    userId: studentId,
    title: "Application Status Update",
    message: `Your application for ${jobTitle} has been ${status.toLowerCase()}`,
    type:
      status === "SELECTED"
        ? "SUCCESS"
        : status === "REJECTED"
          ? "ERROR"
          : "INFO",
    link: "/student/applications",
  });
}

export async function notifyInterviewScheduled(
  studentId: string,
  jobTitle: string,
  roundName: string,
  date: Date,
) {
  return createNotification({
    userId: studentId,
    title: "Interview Scheduled",
    message: `Interview scheduled for ${jobTitle} - ${roundName} on ${date.toLocaleDateString()}`,
    type: "INFO",
    link: "/student/interviews",
  });
}
```

---

## ⚡ Performance Optimizations

### 1. Database Indexing

**File:** `prisma/schema.prisma` (add indexes)

```prisma
model User {
  // ... existing fields

  @@index([email])
  @@index([role, status])
}

model Job {
  // ... existing fields

  @@index([recruiterId])
  @@index([createdAt])
  @@index([minCgpa])
}

model Application {
  // ... existing fields

  @@index([jobId, status])
  @@index([studentId, status])
  @@index([status, updatedAt])
}

model InterviewRound {
  // ... existing fields

  @@index([jobId, date])
}
```

Run: `npx prisma migrate dev --name add_performance_indexes`

---

### 2. Caching Strategy

**File:** `lib/cache.ts` (create)

```typescript
// Simple in-memory cache (use Redis in production)
class SimpleCache {
  private cache = new Map<string, { data: any; expiry: number }>();

  set(key: string, data: any, ttlSeconds: number = 300) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiry });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const cache = new SimpleCache();

// Usage in server actions
export async function getCachedJobs() {
  const cacheKey = "jobs:active";

  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Fetch from database
  const jobs = await prisma.job.findMany({
    where: {
      /* ... */
    },
  });

  // Cache for 5 minutes
  cache.set(cacheKey, jobs, 300);

  return jobs;
}
```

---

## 🧪 Testing Setup

### 1. Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
npm install --save-dev @types/jest
```

### 2. Jest Configuration

**File:** `jest.config.js` (create)

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "actions/**/*.ts",
    "lib/**/*.ts",
    "components/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

**File:** `jest.setup.js` (create)

```javascript
import "@testing-library/jest-dom";
```

### 3. Example Test File

**File:** `lib/__tests__/security.test.ts` (create)

```typescript
import {
  sanitizeInput,
  validateFileUpload,
  isRateLimited,
  recordLoginAttempt,
} from "../security";

describe("Security Utils", () => {
  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeInput("<script>alert('xss')</script>test")).toBe("test");
    });

    it("should trim whitespace", () => {
      expect(sanitizeInput("  test  ")).toBe("test");
    });

    it("should limit length to 1000 chars", () => {
      const longString = "a".repeat(2000);
      expect(sanitizeInput(longString).length).toBe(1000);
    });
  });

  describe("validateFileUpload", () => {
    it("should accept PDF files under 5MB", () => {
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      Object.defineProperty(file, "size", { value: 1024 * 1024 }); // 1MB

      const result = validateFileUpload(file);
      expect(result.valid).toBe(true);
    });

    it("should reject files over size limit", () => {
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 }); // 10MB

      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("size");
    });
  });

  describe("Rate Limiting", () => {
    it("should track login attempts", () => {
      const email = "test@example.com";

      expect(recordLoginAttempt(email)).toBe(1);
      expect(recordLoginAttempt(email)).toBe(2);
      expect(isRateLimited(email)).toBe(false);
    });
  });
});
```

**Update:** `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 📊 Monitoring & Error Tracking

### 1. Setup Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**File:** `sentry.client.config.ts` (created by wizard, customize)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% in development, reduce to 0.1 in production

  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive data from events
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});
```

**Usage:** Errors are automatically caught. Manual tracking:

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // risky operation
} catch (error) {
  Sentry.captureException(error, {
    tags: { section: "job-application" },
    extra: { jobId, studentId },
  });
}
```

---

### 2. Simple Analytics Tracking

**File:** `lib/analytics.ts` (create)

```typescript
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  if (process.env.NODE_ENV === "production") {
    // Send to your analytics service
    console.log("Analytics:", eventName, properties);

    // Example with Vercel Analytics
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("track", eventName, properties);
    }
  }
}

// Usage examples
// trackEvent("job_applied", { jobId, studentId });
// trackEvent("profile_completed", { studentId });
```

---

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Workflow

**File:** `.github/workflows/ci.yml` (create)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          JWT_SECRET: test-secret

      - name: Build application
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Staging
        run: |
          echo "Deploy to staging environment"
          # Add your deployment commands here

  deploy-production:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to Production
        run: |
          echo "Deploy to production environment"
          # Add your deployment commands here
```

---

## 📁 Essential Files to Create

### 1. robots.txt

**File:** `public/robots.txt` (create)

```txt
# Allow all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /student/
Disallow: /recruiter/

# Sitemap location
Sitemap: https://yoursite.com/sitemap.xml
```

### 2. Sitemap (Dynamic)

**File:** `app/sitemap.ts` (create)

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/why-recruit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/placements`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
```

### 3. Environment Template

**File:** `.env.production.template` (create)

```env
# Production Environment Variables Template
# Copy this to .env.production and fill in real values

# Database (use managed PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?connection_limit=10&pool_timeout=20"

# Security (CHANGE THESE!)
JWT_SECRET="GENERATE-STRONG-SECRET-HERE-MIN-32-CHARS"
NEXTAUTH_SECRET="GENERATE-DIFFERENT-SECRET-HERE"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Email (use production SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your-app-specific-password"
EMAIL_FROM="NIT Arunachal T&P <noreply@yourdomain.com>"

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# File Storage (AWS S3 or Cloudinary)
# AWS_ACCESS_KEY_ID="your-key"
# AWS_SECRET_ACCESS_KEY="your-secret"
# AWS_REGION="us-east-1"
# AWS_S3_BUCKET="your-bucket"

# Or Cloudinary
# CLOUDINARY_CLOUD_NAME="your-cloud"
# CLOUDINARY_API_KEY="your-key"
# CLOUDINARY_API_SECRET="your-secret"
```

---

## 🚀 Quick Implementation Priority

### Week 1 (Critical)

1. ✅ Create middleware.ts
2. ✅ Add security headers to next.config.ts
3. ✅ Setup error boundaries
4. ✅ Add password recovery
5. ✅ Setup Sentry error tracking

### Week 2 (Important)

1. ✅ Write unit tests for critical functions
2. ✅ Setup GitHub Actions CI/CD
3. ✅ Add database indexes
4. ✅ Configure production environment
5. ✅ Create legal pages (Privacy/ToS)

### Week 3 (Nice to have)

1. ✅ Implement caching
2. ✅ Optimize images
3. ✅ Add loading states
4. ✅ Improve mobile responsiveness
5. ✅ Add analytics tracking

---

## 📚 Additional Resources

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [OWASP Security Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Web Vitals Optimization](https://web.dev/vitals/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

**Last Updated:** February 17, 2026  
**Version:** 1.0  
**Next Review:** After implementing Week 1 tasks
