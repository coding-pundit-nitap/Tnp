# Database Schema & Queries

Complete database schema documentation and practical query examples.

## Table of Contents

1. [Data Models](#data-models)
2. [Relationships](#relationships)
3. [Enums](#enums)
4. [Common Queries](#common-queries)
5. [Performance Tips](#performance-tips)
6. [Migration Guide](#migration-guide)

## Data Models

### User (Base)

Stores authentication and core user information.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(STUDENT)
  status        Status    @default(PENDING)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  student       Student?
  recruiter     Recruiter?
  auditLogs     AuditLog[]

  @@index([email])
  @@index([role])
}

enum Role {
  STUDENT
  RECRUITER
  ADMIN
}

enum Status {
  PENDING
  ACTIVE
  REJECTED
}
```

### Student

Student profile with eligibility information.

```prisma
model Student {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  branch        String
  year          Int       // 1-4
  cgpa          Float     // 0-10
  resumeUrl     String?

  resume        Resume?
  applications  Application[]
  interviews    InterviewRound[]
  offers        Offer[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([branch])
  @@index([year])
  @@index([cgpa])
}
```

### Recruiter

Recruiter company and contact information.

```prisma
model Recruiter {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  company       String
  contactPerson String
  email         String
  phone         String
  approved      Boolean   @default(false)

  jobs          Job[]
  rounds        InterviewRound[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([company])
  @@index([approved])
}
```

### Job

Job posting by recruiters.

```prisma
model Job {
  id            String    @id @default(cuid())
  recruiterId   String
  recruiter     Recruiter @relation(fields: [recruiterId], references: [id], onDelete: Cascade)

  title         String
  description   String
  location      String
  ctc           Float     // In lakhs
  minCgpa       Float     // 0-10
  allowedBranches String[] // ["CSE", "IT", ...]
  allowedYears  Int[]     // [3, 4]
  status        JobStatus @default(OPEN)

  applications  Application[]
  rounds        InterviewRound[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([recruiterId])
  @@index([status])
  @@index([createdAt])
}

enum JobStatus {
  OPEN
  CLOSED
  FILLED
}
```

### Application

Student job application.

```prisma
model Application {
  id            String    @id @default(cuid())
  studentId     String
  student       Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)

  jobId         String
  job           Job       @relation(fields: [jobId], references: [id], onDelete: Cascade)

  status        ApplicationStatus @default(APPLIED)
  matchScore    Float?    // 0-100, eligibility %
  appliedAt     DateTime  @default(now())

  interviews    InterviewResult[]
  offer         Offer?

  @@index([studentId])
  @@index([jobId])
  @@index([status])
  @@index([matchScore])
}

enum ApplicationStatus {
  APPLIED
  SHORTLISTED
  REJECTED
  SELECTED
  OFFERED
}
```

### InterviewRound

Interview scheduling.

```prisma
model InterviewRound {
  id            String    @id @default(cuid())
  jobId         String
  job           Job       @relation(fields: [jobId], references: [id], onDelete: Cascade)

  studentId     String    // Optional for group rounds
  student       Student?  @relation(fields: [studentId], references: [id], onDelete: Cascade)

  roundNumber   Int
  name          String    // "Technical", "HR", etc.
  scheduledDate DateTime?
  location      String?
  notes         String?

  results       InterviewResult[]

  @@index([jobId])
  @@index([studentId])
  @@index([scheduledDate])
}
```

### InterviewResult

Interview round results.

```prisma
model InterviewResult {
  id            String    @id @default(cuid())
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  roundId       String
  round         InterviewRound @relation(fields: [roundId], references: [id], onDelete: Cascade)

  result        ResultStatus
  feedback      String?
  score         Float?    // 0-100

  createdAt     DateTime  @default(now())

  @@index([applicationId])
  @@index([roundId])
}

enum ResultStatus {
  PASSED
  FAILED
  PENDING
}
```

### Offer

Job offer.

```prisma
model Offer {
  id            String    @id @default(cuid())
  applicationId String    @unique
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  cnctc         Float     // Final CTC in lakhs
  status        OfferStatus @default(PENDING)
  expiresAt     DateTime
  acceptedAt    DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([applicationId])
  @@index([status])
  @@index([acceptedAt])
}

enum OfferStatus {
  PENDING
  ACCEPTED
  DECLINED
}
```

### Resume

Parsed resume data.

```prisma
model Resume {
  id            String    @id @default(cuid())
  studentId     String    @unique
  student       Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)

  fileUrl       String
  skills        String[]
  education     Json[]    // [{degree, institution, year}]
  cgpaFromResume Float?
  keywords      String[]
  parsedAt      DateTime  @default(now())

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([studentId])
  @@index([parsedAt])
}
```

### AuditLog

System activity tracking.

```prisma
model AuditLog {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: SetNull)

  action        AuditActionType
  entityType    String    // "Job", "Application", "Resume", etc.
  entityId      String
  changes       Json      // {field: {oldValue, newValue}}

  ipAddress     String?
  userAgent     String?

  createdAt     DateTime  @default(now())

  @@index([userId])
  @@index([action])
  @@index([entityType])
  @@index([createdAt])
}

enum AuditActionType {
  CREATE_JOB
  UPDATE_JOB
  DELETE_JOB
  APPROVE_RECRUITER
  REJECT_RECRUITER
  CREATE_APPLICATION
  UPDATE_APPLICATION_STATUS
  SCHEDULE_INTERVIEW
  UPDATE_INTERVIEW_RESULT
  GENERATE_OFFER
  ACCEPT_OFFER
  DECLINE_OFFER
  CREATE_ANNOUNCEMENT
  UPDATE_ANNOUNCEMENT
  DELETE_ANNOUNCEMENT
  UPLOAD_RESUME
  UPDATE_SETTINGS
  OTHER
}
```

### SystemSettings

Portal configuration.

```prisma
model SystemSettings {
  id                    String  @id @default("default")
  placementSeasonYear   Int
  defaultCgpaCutoff     Float
  portalOpen            Boolean @default(true)
  allowedDomains        String[]
  emailFrom             String

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

## Relationships

```
User (1) ──────→ (1) Student
        ──────→ (1) Recruiter
        ──────→ (*) AuditLog

Student (1) ────→ (*) Application
         ────→ (1) Resume
         ────→ (*) InterviewRound
         ────→ (*) Offer

Recruiter (1) ──→ (*) Job
          ──→ (*) InterviewRound

Job (1) ─────→ (*) Application
    ────→ (*) InterviewRound

Application (1) ─→ (*) InterviewResult
             ─→ (1) Offer

InterviewRound (1) → (*) InterviewResult
```

## Enums

### Role

```typescript
"STUDENT";
"RECRUITER";
"ADMIN";
```

### Status

```typescript
"PENDING"; // Awaiting action
"ACTIVE"; // Approved
"REJECTED"; // Denied
```

### JobStatus

```typescript
"OPEN"; // Accepting applications
"CLOSED"; // No longer accepting
"FILLED"; // All positions filled
```

### ApplicationStatus

```typescript
"APPLIED"; // Initial application
"SHORTLISTED"; // Candidate is eligible
"REJECTED"; // Application rejected
"SELECTED"; // Selected for offer
"OFFERED"; // Offer letter sent
```

### ResultStatus

```typescript
"PASSED"; // Interview passed
"FAILED"; // Interview failed
"PENDING"; // Result not yet decided
```

### OfferStatus

```typescript
"PENDING"; // Waiting for student response
"ACCEPTED"; // Student accepted offer
"DECLINED"; // Student declined offer
```

## Common Queries

### Find eligible students for a job

```typescript
const eligibleStudents = await prisma.student.findMany({
  where: {
    AND: [
      { cgpa: { gte: job.minCgpa } },
      { branch: { in: job.allowedBranches } },
      { year: { in: job.allowedYears } },
    ],
  },
  include: {
    resume: true, // For skill matching
  },
});
```

### Get applications with match scores

```typescript
const applications = await prisma.application.findMany({
  where: { jobId: jobId },
  include: {
    student: { include: { resume: true } },
    job: true,
  },
  orderBy: { matchScore: "desc" }, // High scores first
});
```

### Get placement statistics by branch

```typescript
const stats = await prisma.student.groupBy({
  by: ["branch"],
  _count: { id: true }, // Total students
  _sum: { cgpa: true }, // Sum CGPA
  where: {
    offers: {
      some: { status: "ACCEPTED" }, // Has accepted offer
    },
  },
});

// Calculate placement rate
const results = stats.map((s) => ({
  branch: s.branch,
  total: s._count.id,
  placed: s._count.id, // From where clause
  placementRate: (s._count.id / totalInBranch) * 100, // Calculate
}));
```

### Get top companies by selection rate

```typescript
const companies = await prisma.recruiter.findMany({
  include: {
    jobs: {
      include: {
        applications: {
          where: { status: { in: ["SELECTED", "OFFERED"] } },
        },
      },
    },
  },
});

// Calculate and sort by selection rate
const stats = companies
  .map((recruiter) => {
    const totalApps = recruiter.jobs.reduce(
      (sum, job) => sum + job.applications.length,
      0,
    );
    const selected = recruiter.jobs.reduce(
      (sum, job) =>
        sum + job.applications.filter((a) => a.status === "SELECTED").length,
      0,
    );
    return {
      company: recruiter.company,
      selectionRate: (selected / totalApps) * 100,
    };
  })
  .sort((a, b) => b.selectionRate - a.selectionRate);
```

### Get resume keywords for job matching

```typescript
const studentResumes = await prisma.resume.findMany({
  where: {
    student: {
      cgpa: { gte: job.minCgpa },
      branch: { in: job.allowedBranches },
    },
  },
  select: { keywords: true },
});

// Find keyword matches
const jobKeywords = parseJobDescription(job.description);
const matchScores = studentResumes.map((resume) => {
  const matches = resume.keywords.filter((k) => jobKeywords.includes(k)).length;
  return (matches / jobKeywords.length) * 100;
});
```

### Get audit logs with filtering

```typescript
const logs = await prisma.auditLog.findMany({
  where: {
    AND: [
      { action: "CREATE_APPLICATION" },
      { createdAt: { gte: startDate, lte: endDate } },
      userId ? { userId } : {},
    ],
  },
  include: {
    user: { select: { name: true, email: true } },
  },
  orderBy: { createdAt: "desc" },
  take: 50, // Limit results
});
```

### Check if student is eligible for job

```typescript
async function checkEligibility(studentId: string, jobId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { resume: true },
  });

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  // Check criteria
  const eligibility = {
    cgpa: student.cgpa >= job.minCgpa,
    branch: job.allowedBranches.includes(student.branch),
    year: job.allowedYears.includes(student.year),
    skills:
      student.resume?.keywords.some((k) => jobKeywords.includes(k)) || false,
  };

  return eligibility;
}
```

## Performance Tips

### Key Indexes

- `User.email` - For login queries
- `Student.branch`, `Student.year`, `Student.cgpa` - For filtering
- `Job.status`, `Job.createdAt` - For listing jobs
- `Application.status`, `Application.matchScore` - For sorting
- `AuditLog.createdAt`, `AuditLog.action` - For log filtering

### Query Optimization

✅ **Good:**

```typescript
// Use include selectively
const job = await prisma.job.findUnique({
  where: { id: jobId },
  include: {
    applications: { take: 10 }, // Limit nested results
  },
});

// Batch operations
const results = await Promise.all([
  prisma.student.count(),
  prisma.job.count(),
  prisma.offer.count(),
]);
```

❌ **Avoid:**

```typescript
// Full include on large datasets
const jobs = await prisma.job.findMany({
  include: { applications: true }, // All applications!
});

// N+1 queries
const students = await prisma.student.findMany();
for (const student of students) {
  const offers = await prisma.offer.findMany({
    where: { student },
  }); // N queries!
}
```

## Migration Guide

### Creating a Migration

1. **Update schema.prisma**

   ```prisma
   model NewFeature {
     id String @id @default(cuid())
   }
   ```

2. **Create migration**

   ```bash
   npx prisma migrate dev --name add_new_feature
   ```

3. **Review migration file**

   ```bash
   # Check: prisma/migrations/[timestamp]_add_new_feature/migration.sql
   ```

4. **Test locally**

   ```bash
   # Migration is auto-applied
   npx prisma studio  # Verify schema
   ```

5. **Deploy**
   ```bash
   # On production
   npx prisma migrate deploy
   ```

### Deploying Migrations

```bash
# Check pending migrations
npx prisma migrate status

# Apply all pending
npx prisma migrate deploy

# Rollback (careful!)
npx prisma migrate resolve --rolled-back "migration_name"
```

---

For more examples and detailed documentation, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
