# Developer Guide

Comprehensive documentation for developers working on the T&P Portal codebase.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack Details](#tech-stack-details)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Database Schema](#database-schema)
6. [Server Actions API](#server-actions-api)
7. [Component Patterns](#component-patterns)
8. [Error Handling](#error-handling)
9. [Logging & Debugging](#logging--debugging)
10. [Testing](#testing)
11. [Deployment](#deployment)

## Architecture Overview

### Next.js App Router Architecture

```
Request → Middleware → Route Handler/Server Action → Database → Response
```

**Key Architectural Decisions:**

- **Server Actions**: All business logic runs on server (security + performance)
- **Server Components**: Default rendering for data fetching pages
- **Client Components**: Interactive UI with hooks, server action calls
- **Type Safety**: End-to-end TypeScript with Zod validation
- **SWR/Revalidation**: Automatic cache invalidation after mutations

### Authentication Flow

```
User Input → Validation (Zod) → Server Action
    ↓
Password Check (bcryptjs) → Generate JWT
    ↓
Store in HTTP-only Cookie → Create Session
    ↓
Middleware Verification → Route Protection
    ↓
Dashboard Access (role-based)
```

## Tech Stack Details

### Frontend Layer

- **Next.js 16.1.1**: App Router, React Server Components, Streaming
- **React 19.0+**: Hooks, Suspense, automatic batching
- **TypeScript 5.7+**: Full type safety, exhaustive checks
- **Tailwind CSS 3.4**: Utility-first CSS, dark mode support

### Backend Layer

- **Next.js Server Actions**: RPC-style API, automatic serialization
- **Prisma 6.19.2**: Type-safe ORM with query builder
- **PostgreSQL 15+**: Relational database with indexing

### Validation & Security

- **Zod 4.3.5**: Runtime schema validation with inference
- **bcryptjs**: Password hashing (10 rounds min)
- **jsonwebtoken**: JWT signing and verification
- **next/headers**: Secure cookies (HTTP-only, SameSite)

### Utilities

- **axios**: HTTP client for external API calls
- **recharts**: React chart library for analytics

## Project Structure

```
tnp-portal/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── login/                   # Auth pages
│   ├── logout/
│   ├── unauthorized/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout (optional)
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── settings/            # System settings
│   │   ├── audit-logs/          # Activity logs
│   │   ├── export/              # Data export
│   │   ├── jobs/                # Job management
│   │   ├── recruiters/          # Recruiter approval
│   │   └── announcements/       # Announcements
│   ├── student/
│   │   ├── page.tsx             # Student dashboard
│   │   ├── register/            # Registration page
│   │   ├── profile/             # Profile management
│   │   ├── jobs/                # Job browsing
│   │   ├── applications/        # Application tracking
│   │   ├── interviews/          # Interview schedule
│   │   ├── offers/              # Offer management
│   │   └── resume/              # Resume upload & display
│   └── recruiter/
│       ├── page.tsx             # Recruiter dashboard
│       ├── register/            # Registration page
│       ├── jobs/                # Job posting
│       ├── offers/              # Offer management
│       └── rounds/              # Interview rounds
│
├── actions/                      # Server Actions (RPC)
│   ├── auth.ts                  # Login/logout/session
│   ├── register.ts              # Registration flow
│   ├── profile.ts               # User profile updates
│   ├── job.ts                   # Job creation/updates
│   ├── application.ts           # Application handling
│   ├── interview.ts             # Interview management
│   ├── offer.ts                 # Offer operations
│   ├── announcement.ts          # Announcements
│   ├── audit.ts                 # Audit logging
│   ├── resume.ts                # Resume parsing
│   ├── analytics.ts             # Statistics queries
│   ├── export.ts                # CSV export
│   ├── email.ts                 # Email sending
│   └── settings.ts              # System settings
│
├── components/                   # React Components
│   ├── Card.tsx                 # Base card component
│   ├── FormInput.tsx            # Form input wrapper
│   ├── DataTable.tsx            # Data table component
│   ├── StatusBadge.tsx          # Status display
│   ├── MetricCard.tsx           # Dashboard metrics
│   ├── ChartCard.tsx            # Chart container
│   ├── ExportButton.tsx         # CSV download
│   ├── FileUploadBox.tsx        # Drag-drop upload
│   ├── SearchFilterBar.tsx      # Search & filters
│   ├── PaginationControls.tsx   # Pagination UI
│   └── landing/                 # Landing page components
│
├── lib/                          # Utilities & Helpers
│   ├── auth.ts                  # Authentication utilities
│   ├── prisma.ts                # Prisma client singleton
│   ├── validations.ts           # Zod schemas (20+)
│   ├── security.ts              # Rate limiting, sanitization
│   ├── resume-parser.ts         # Resume PDF parsing
│   ├── email.ts                 # Email templates
│   ├── csv.ts                   # CSV generation
│   ├── eligibility.ts           # Eligibility scoring
│   └── logger.ts                # Dev logging (new)
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeding
│   └── migrations/              # Migration history
│
├── public/                       # Static assets
│   └── recruiters/              # Company logos
│
├── middleware.ts                # Route protection
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
├── package.json                # Dependencies
└── docs/                        # Developer documentation
    ├── DEVELOPER_GUIDE.md       # This file
    ├── API_REFERENCE.md         # Server actions API
    ├── DATABASE.md              # Schema & queries
    ├── PATTERNS.md              # Code patterns
    └── TESTING.md               # Testing guide
```

## Development Workflow

### Setting Up Development Environment

1. **Clone and Install**

   ```bash
   git clone https://github.com/yourorg/tnp-portal.git
   cd tnp-portal
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

3. **Database Setup**

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

### Making Changes

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop & Test**
   - Make changes following established patterns
   - Use dev console logging for debugging
   - Run lint checks: `npm run lint`

3. **Database Changes**
   - Update `prisma/schema.prisma`
   - Create migration: `npx prisma migrate dev --name description`
   - Test migration: `npx prisma migrate reset`

4. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Describe changes and testing done
   - Request code review
   - Ensure CI/CD passes

### Code Style Guidelines

- **Naming**: camelCase for functions/variables, PascalCase for components/classes
- **Files**: Use `.ts` for utilities, `.tsx` for components
- **Imports**: Group by external, internal, relative
- **Comments**: Use for WHY, not WHAT (code should be self-documenting)
- **Error Messages**: User-friendly, non-technical where possible

## Database Schema

### Core User Models

**User**

- `id: String @id @default(cuid())`
- `email: String @unique`
- `password: String`
- `name: String`
- `role: String` (STUDENT|RECRUITER|ADMIN)
- `status: String` (PENDING|ACTIVE|REJECTED)
- `createdAt: DateTime @default(now())`
- Relations: student?, recruiter?, auditLogs[]

**Student**

- `id: String @id @default(cuid())`
- `userId: String @unique`
- `branch: String`
- `year: Int` (1-4)
- `cgpa: Float`
- `resume: Resume?`
- Relations: user, applications[], offers[]

**Recruiter**

- `id: String @id @default(cuid())`
- `userId: String @unique`
- `company: String`
- `contactPerson: String`
- `email: String`
- `phone: String`
- `approved: Boolean @default(false)`
- Relations: user, jobs[], interviewRounds[]

### Placement Models

**Job**

- `id: String @id`
- `recruiterId: String`
- `title: String`
- `description: String`
- `location: String`
- `ctc: Float`
- `minCgpa: Float`
- `allowedBranches: String[]`
- `allowedYears: Int[]`
- `status: String` (OPEN|CLOSED|FILLED)
- Relations: applications[], interviewRounds[]

**Application**

- `id: String @id`
- `studentId: String`
- `jobId: String`
- `status: String` (APPLIED|SHORTLISTED|REJECTED|SELECTED|OFFERED)
- `matchScore: Float?` (0-100 eligibility %)
- Relations: student, job, interviewResults[]

**InterviewRound**

- `id: String @id`
- `jobId: String`
- `roundNumber: Int`
- `name: String` (Technical, HR, etc.)
- `scheduledDate: DateTime?`
- Relations: results[]

**Offer**

- `id: String @id`
- `applicationId: String`
- `ctcFinal: Float`
- `status: String` (PENDING|ACCEPTED|DECLINED)
- `expiresAt: DateTime`
- Relations: application

### System Models

**Resume**

- `id: String @id`
- `studentId: String @unique`
- `fileUrl: String`
- `skills: String[]`
- `education: Json[]`
- `cgpaFromResume: Float?`
- `keywords: String[]`
- `parsedAt: DateTime`

**AuditLog**

- `id: String @id`
- `userId: String`
- `action: String` (enum with 17 types)
- `entityType: String`
- `entityId: String`
- `changes: Json`
- `ipAddress: String?`
- `userAgent: String?`
- `createdAt: DateTime @default(now())`

**SystemSettings**

- `id: String @id @default("default")`
- `placementSeasonYear: Int`
- `defaultCgpaCutoff: Float`
- `portalOpen: Boolean @default(true)`
- `allowedDomains: String[]`
- `emailFrom: String`

See [DATABASE.md](./DATABASE.md) for detailed schema and query examples.

## Server Actions API

All server actions follow a consistent pattern for type safety and error handling.

### Pattern

```typescript
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { someSchema } from "@/lib/validations";

export async function someAction(input: unknown) {
  try {
    // Authentication
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Authorization
    if (session.user.role !== "REQUIRED_ROLE") {
      return { success: false, error: "Forbidden" };
    }

    // Validation
    const validated = someSchema.parse(input);

    // Database Operations
    const result = await prisma.model.create({
      data: validated,
    });

    // Audit Logging (for sensitive actions)
    await createAuditLog({
      action: "CREATE_RESOURCE",
      entityType: "Model",
      entityId: result.id,
    });

    return { success: true, data: result };
  } catch (error: any) {
    logError("someAction", error); // Dev logging
    return { success: false, error: error.message };
  }
}
```

### Response Format

All server actions return:

```typescript
{
  success: boolean;
  data?: T;                    // Returned data (if successful)
  error?: string;              // Error message (if failed)
  total?: number;              // For paginated responses
}
```

### Key Server Actions

**Authentication**

- `loginAction(email, password)` - User login
- `registerAction(formData)` - User registration
- `logoutAction()` - Session logout
- `getSession()` - Get current session

**Jobs & Applications**

- `createJob(jobData)` - Post new job
- `applyToJob(jobId)` - Submit application
- `getStudentApplications(page, limit)` - Fetch applications
- `updateApplicationStatus(appId, status)` - Accept/reject

**Resume & Skills**

- `uploadResume(formData)` - Parse and store resume
- `getStudentResume()` - Fetch parsed resume
- `deleteResume()` - Remove resume file

**Analytics**

- `getPlacementStats()` - Overall statistics
- `getBranchPlacementStats()` - Per-branch breakdown
- `getCompanyStats()` - Company performance

**Exports**

- `exportStudentsCSV()` - Student data export
- `exportJobsCSV()` - Job listings export
- `exportApplicationsCSV()` - Applications export

**System**

- `getSystemSettings()` - Get portal configuration
- `updateSystemSettings(settings)` - Update settings
- `getAuditLogs(page, limit, filters)` - Activity logs

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

## Component Patterns

### Server Component (Data Fetching)

```typescript
// app/admin/analytics/page.tsx
import { MetricCard } from "@/components/MetricCard";
import { getPlacementStats } from "@/actions/analytics";

export default async function AnalyticsPage() {
  const stats = await getPlacementStats();

  if (!stats.success) {
    return <div>Error loading analytics</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard label="Total Students" value={stats.data?.totalStudents} />
      <MetricCard label="Placed" value={stats.data?.placedStudents} />
      <MetricCard label="Avg CTC" value={`₹${stats.data?.avgCTC}L`} />
    </div>
  );
}
```

### Client Component (Interactivity)

```typescript
// components/SearchFilterBar.tsx
"use client";

import { useTransition } from "react";
import { useState } from "react";

export function SearchFilterBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isPending, useTransition] = useTransition();

  const handleSearch = async (q: string) => {
    setQuery(q);
    // Call server action
    startTransition(async () => {
      await onSearch(q);
    });
  };

  return (
    <input
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      disabled={isPending}
      placeholder="Search..."
    />
  );
}
```

### Composition Pattern

```typescript
// app/student/resume/page.tsx (Server)
import { getSession } from "@/lib/auth";
import { ResumeUploadClient } from "./ResumeUploadClient";

export default async function ResumePage() {
  const session = await getSession();
  const resume = await getStudentResume();

  return <ResumeUploadClient existingResume={resume.data} />;
}

// app/student/resume/ResumeUploadClient.tsx (Client)
"use client";
export function ResumeUploadClient({ existingResume }) {
  const [file, setFile] = useState<File | null>(null);
  // Interactive upload UI
}
```

## Error Handling

### Consistent Error Handling Pattern

```typescript
// ✅ Good
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error: any) {
  logError("operationName", error);
  return {
    success: false,
    error: error.message || "Operation failed",
  };
}

// ✅ With specific errors
try {
  // ...
} catch (error: any) {
  if (error.code === "P2025") {
    return { success: false, error: "Record not found" };
  }
  logError("operation", error);
  return { success: false, error: "Database operation failed" };
}
```

### Client-side Error Handling

```typescript
"use client";
import { useState } from "react";

export function FormComponent() {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (data) => {
    setError("");
    try {
      const result = await submitForm(data);
      if (!result.success) {
        setError(result.error || "Operation failed");
        return;
      }
      // Success handling
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div>
      {error && <div className="text-red-600">{error}</div>}
      {/* Form */}
    </div>
  );
}
```

## Logging & Debugging

### Development Logging Utility

```typescript
// lib/logger.ts
export function logInfo(context: string, message: string, data?: any) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${context}] ${message}`, data ? data : "");
  }
}

export function logError(context: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${context}] Error:`, error);
  }
}

export function logDebug(context: string, message: string, data?: any) {
  if (process.env.DEBUG === "true") {
    console.debug(`[${context}] DEBUG: ${message}`, data);
  }
}
```

### Using Logger in Code

```typescript
import { logInfo, logError } from "@/lib/logger";

export async function getPlacementStats() {
  try {
    logInfo("analytics", "Fetching placement stats");
    const stats = await prisma.application.groupBy({
      by: ["status"],
      _count: true,
    });
    logInfo("analytics", "Stats fetched", { count: stats.length });
    return { success: true, data: stats };
  } catch (error) {
    logError("analytics", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}
```

### Development Console Tips

```javascript
// Check current user session
fetch("/api/session")
  .then((r) => r.json())
  .then(console.log);

// View audit logs
db.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } });

// Check eligibility calculations
fetch("/api/debug/eligibility", {
  method: "POST",
  body: JSON.stringify({ studentId: "123", jobId: "456" }),
});
```

## Testing

### Manual Testing Checklist

```
Authentication:
  ☐ Register as student
  ☐ Register as recruiter
  ☐ Login with valid credentials
  ☐ Login with invalid credentials
  ☐ Logout functionality
  ☐ Session persistence after refresh

Jobs & Applications:
  ☐ Create job as recruiter
  ☐ View jobs as student
  ☐ Apply to eligible job
  ☐ Apply to ineligible job (should auto-reject)
  ☐ View applications as recruiter
  ☐ Shortlist application
  ☐ Update application status

Resume & Skills:
  ☐ Upload PDF resume
  ☐ Verify skills extracted
  ☐ Check CGPA parsing
  ☐ Delete resume

Analytics:
  ☐ View placement statistics
  ☐ Filter by branch
  ☐ Export data as CSV
  ☐ Check charts render

Audit Logs:
  ☐ Verify log creation on actions
  ☐ Check timestamp accuracy
  ☐ View audit log details
```

### Using Prisma Studio

```bash
# Open interactive database browser
npx prisma studio

# Available at http://localhost:5555
```

## Deployment

### Pre-deployment Checklist

```
Environment:
  ☐ NODE_ENV=production set
  ☐ JWT_SECRET configured
  ☐ DATABASE_URL using managed service
  ☐ NEXTAUTH_URL set to production domain

Security:
  ☐ All environment secrets in CI/CD
  ☐ HTTPS enabled
  ☐ CORS properly configured
  ☐ Rate limiting enabled
  ☐ Input sanitization active

Database:
  ☐ Backups configured
  ☐ Migrations applied
  ☐ Indexes created
  ☐ Database monitored

Performance:
  ☐ Next.js build optimized
  ☐ Images optimized
  ☐ CSS minified
  ☐ Code split properly
  ☐ Cache headers set
```

### Deployment Steps

```bash
# Production build
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel deploy --prod

# Or deploy to other platforms
# Follow platform-specific instructions
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
- [Zod Validation](https://zod.dev/)

---

**For specific documentation, see:**

- [API_REFERENCE.md](./API_REFERENCE.md) - Server actions API
- [DATABASE.md](./DATABASE.md) - Schema and queries
- [PATTERNS.md](./PATTERNS.md) - Code patterns and examples
- [TESTING.md](./TESTING.md) - Testing guide
