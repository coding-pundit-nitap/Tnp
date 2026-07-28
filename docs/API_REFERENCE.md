# API Reference

Complete documentation of all Server Actions available in the T&P Portal.

## Table of Contents

1. [Authentication](#authentication)
2. [Jobs & Applications](#jobs--applications)
3. [Resume Management](#resume-management)
4. [Analytics & Reporting](#analytics--reporting)
5. [Audit Logs](#audit-logs)
6. [System Settings](#system-settings)
7. [Email Notifications](#email-notifications)
8. [Data Export](#data-export)

## Authentication

### `getSession(): Promise<SessionType | null>`

Get the current user's session.

**Returns:**

```typescript
{
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
} | null
```

**Usage:**

```typescript
const session = await getSession();
if (!session) {
  redirect("/login");
}
```

### `loginAction(email: string, password: string)`

Authenticate user and create session.

**Request:**

```typescript
{
  email: string; // Valid email format
  password: string; // Min 6 characters
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    redirectUrl: string;  // Role-based redirect
  };
  error?: string;
}
```

### `registerAction(formData: RegisterFormData)`

Create new user account.

**Request:** (for Student)

```typescript
{
  nameOrCompany: string;
  email: string;
  password: string;
  role: "STUDENT" | "RECRUITER";
  // For Student:
  branch: string;
  year: 1 | 2 | 3 | 4;
  cgpa: number;
  // For Recruiter:
  contactPerson: string;
  phone: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    redirectUrl: string;
  };
  error?: string;
}
```

### `logoutAction(): Promise<void>`

Clear session and redirect to login.

**Usage:**

```typescript
<form action={logoutAction}>
  <button type="submit">Logout</button>
</form>
```

## Jobs & Applications

### `createJob(jobData: JobFormData)`

Post a new job opening. **Admin/Recruiter only**.

**Request:**

```typescript
{
  title: string;
  description: string;
  location: string;
  ctc: number;           // In lakhs
  minCgpa: number;       // 0-10
  allowedBranches: string[];  // e.g., ["CSE", "IT"]
  allowedYears: number[];      // e.g., [3, 4]
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    jobId: string;
  };
  error?: string;
}
```

### `applyToJob(jobId: string)`

Apply to a job opening. **Student only**.

**Request:**

```typescript
{
  jobId: string; // Job ID to apply for
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    applicationId: string;
    eligible: boolean;
    matchScore: number;  // 0-100
  };
  error?: string;
}
```

**Note:** Eligibility is automatically checked based on:

- Student CGPA vs job minimum CGPA
- Student branch in allowed branches
- Student year in allowed years
- Resume skills matching job keywords

### `getStudentApplications(page: number, limit: number)`

Fetch student's applications. **Server Component**.

**Request:**

```typescript
{
  page: number; // Default: 1
  limit: number; // Default: 20
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    applications: [
      {
        id: string;
        job: {
          id: string;
          title: string;
          company: string;  // From recruiter
          ctc: number;
          location: string;
        };
        status: "APPLIED" | "SHORTLISTED" | "REJECTED" | "SELECTED" | "OFFERED";
        appliedAt: string;  // ISO date
        matchScore: number; // 0-100
      }
    ];
  };
  total: number;
  error?: string;
}
```

### `updateApplicationStatus(applicationId: string, status: string)`

Change application status. **Recruiter only**.

**Request:**

```typescript
{
  applicationId: string;
  status: "SHORTLISTED" | "REJECTED" | "SELECTED";
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    applicationId: string;
    status: string;
  };
  error?: string;
}
```

## Resume Management

### `uploadResume(formData: FormData)`

Upload and parse student resume. **Student only**.

**Request:**

```typescript
// FormData with file field
formData.append("file", pdfFile); // PDF only, max 5MB
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    resume: {
      id: string;
      fileUrl: string;
      skills: string[];
      education: [
        {
          degree: string;
          institution: string;
          year?: number;
        }
      ];
      cgpaFromResume?: number;
      keywords: string[];
      parsedAt: string;  // ISO date
    };
  };
  error?: string;
}
```

**Example:**

```typescript
"use client";
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadResume(formData);
  if (result.success) {
    console.log("Resume parsed:", result.data.resume);
  }
};
```

### `getStudentResume()`

Fetch current student's resume. **Server Action**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    id: string;
    skills: string[];
    education: [...];
    cgpaFromResume?: number;
    keywords: string[];
    parsedAt: string;
  };
  error?: string;
}
```

### `deleteResume()`

Remove student's resume. **Student only**.

**Response:**

```typescript
{
  success: boolean;
  error?: string;
}
```

## Analytics & Reporting

### `getPlacementStats()`

Get overall placement statistics. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    totalStudents: number;
    totalRecruiters: number;
    totalJobs: number;
    totalApplications: number;
    placedStudents: number;
    placementRate: number;      // Percentage
    averageCtc: number;         // In lakhs
    highestCtc: number;         // In lakhs
  };
  error?: string;
}
```

### `getBranchPlacementStats()`

Per-branch placement statistics. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      branch: string;
      totalStudents: number;
      placedStudents: number;
      placementRate: number;     // Percentage
    }
  ];
  error?: string;
}
```

### `getCompanyStats()`

Company-wise statistics. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      company: string;
      recruiterName: string;
      totalJobs: number;
      totalApplications: number;
      selected: number;
      offered: number;
      accepted: number;
      ctcRange: {
        min: number;
        max: number;
        average: number;
      };
      selectionRate: number;     // Percentage
    }
  ];
  error?: string;
}
```

### `getRecruiterStats()`

Recruiter-wise statistics. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      recruiterId: string;
      recruiterName: string;
      company: string;
      totalJobs: number;
      totalApplications: number;
      selected: number;
      accepted: number;
      selectionRate: number;     // Percentage
    }
  ];
  error?: string;
}
```

### `getYearPlacementStats()`

Year-wise placement statistics. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      year: number;
      totalStudents: number;
      placedStudents: number;
      placementRate: number;     // Percentage
      averageCtc: number;
    }
  ];
  error?: string;
}
```

### `getApplicationTimeline()`

Timeline data for charts. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      date: string;              // ISO date
      applications: number;
      shortlisted: number;
      rejected: number;
      selected: number;
    }
  ];
  error?: string;
}
```

### `getTopSkills(limit: number = 10)`

Most common skills from resumes. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      skill: string;
      frequency: number;
      percentage: number;        // % of students
    }
  ];
  error?: string;
}
```

## Audit Logs

### `createAuditLog(input: AuditLogInput)`

Create audit log entry. **Internal use**.

**Request:**

```typescript
{
  action: "CREATE_JOB" | "UPDATE_JOB" | "DELETE_JOB" |
          "CREATE_APPLICATION" | "UPDATE_APPLICATION_STATUS" |
          "UPLOAD_RESUME" | "UPDATE_SETTINGS" | /* ... 17 types */;
  entityType: string;            // e.g., "Job", "Application"
  entityId: string;
  changes: Record<string, any>;  // What changed
  ipAddress?: string;
  userAgent?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    logId: string;
  };
  error?: string;
}
```

### `getAuditLogs(page: number, limit: number, filters: AuditFilters)`

Fetch audit logs. **Admin only**.

**Request:**

```typescript
{
  page: number;
  limit: number;
  filters: {
    action?: string;           // Filter by action type
    entityType?: string;       // Filter by entity type
    userId?: string;           // Filter by user
    startDate?: Date;          // Date range
    endDate?: Date;
  }
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: [
    {
      id: string;
      timestamp: string;       // ISO date
      user: {
        id: string;
        name: string;
        email: string;
      };
      action: string;
      entityType: string;
      entityId: string;
      changes: Record<string, any>;
      ipAddress?: string;
      userAgent?: string;
    }
  ];
  total: number;
  error?: string;
}
```

### `exportAuditLogs(startDate: Date, endDate: Date)`

Export audit logs as CSV. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    csv: string;               // CSV content
    filename: string;          // Suggested filename
  };
  error?: string;
}
```

## System Settings

### `getSystemSettings()`

Get portal configuration. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    placementSeasonYear: number;
    defaultCgpaCutoff: number;
    portalOpen: boolean;
    allowedDomains: string[];
    emailFrom: string;
  };
  error?: string;
}
```

### `updateSystemSettings(input: SystemSettingsInput)`

Update portal configuration. **Admin only**.

**Request:**

```typescript
{
  placementSeasonYear?: number;
  defaultCgpaCutoff?: number;
  portalOpen?: boolean;
  allowedDomains?: string[];
  emailFrom?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    settings: SystemSettings;
  };
  error?: string;
}
```

### `isPortalOpen(): Promise<boolean>`

Check if portal is accepting applications.

### `getCurrentPlacementSeason(): Promise<number>`

Get current placement season year.

## Email Notifications

### `sendRecruiterApprovalEmail(recruiterId: string)`

Send approval notification to recruiter. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  sentCount: number;
  error?: string;
}
```

### `sendJobPostedEmail(jobId: string)`

Notify eligible students about new job. **Recruit only**.

Automatically sends to:

- Students matching CGPA criteria
- In allowed branches
- In allowed years

**Response:**

```typescript
{
  success: boolean;
  sentCount: number;     // Recipients
  error?: string;
}
```

### `sendApplicationStatusEmail(applicationId: string, status: string)`

Notify student of application status change.

**Response:**

```typescript
{
  success: boolean;
  sentCount: number;
  error?: string;
}
```

### `sendInterviewRoundEmail(roundId: string, applicationIds: string[])`

Schedule interview notifications. **Recruiter only**.

**Response:**

```typescript
{
  success: boolean;
  sentCount: number;     // Recipients
  error?: string;
}
```

## Data Export

### `exportStudentsCSV()`

Export all students data. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    csv: string;
    filename: string;  // students-{date}.csv
  };
  error?: string;
}
```

**Columns:** Name, Email, Branch, Year, CGPA, Status, Placed, Last Updated

### `exportRecruitersCSV()`

Export recruiters data. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    csv: string;
    filename: string;  // recruiters-{date}.csv
  };
  error?: string;
}
```

**Columns:** Company, Contact Person, Email, Phone, Status, Jobs Posted, Applications, Approved

### `exportJobsCSV()`

Export jobs data. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    csv: string;
    filename: string;  // jobs-{date}.csv
  };
  error?: string;
}
```

**Columns:** Company, Title, Location, CTC, Min CGPA, Branches, Years, Applications, Status

### `exportApplicationsCSV()`

Export applications data. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    csv: string;
    filename: string;  // applications-{date}.csv
  };
  error?: string;
}
```

**Columns:** Student, Email, Job, Company, Status, Match Score, Applied Date

### `exportPlacementsCSV()`

Export placements data. **Admin only**.

**Response:**

```typescript
{
  success: boolean;
  data?: {
    csv: string;
    filename: string;  // placements-{date}.csv
  };
  error?: string;
}
```

**Columns:** Student, Branch, Company, Job Title, CTC, Acceptance Date

---

## Error Handling

All responses follow consistent error handling:

```typescript
{
  success: false;
  error: string; // User-friendly error message
}
```

Common errors:

- `"Unauthorized"` - User not logged in
- `"Forbidden"` - User lacks required role
- `"Validation error"` - Invalid input data
- `"Not found"` - Resource doesn't exist
- `"Database error"` - Server error

## Rate Limiting

Authentication endpoints are rate-limited:

- **Max attempts:** 5 per 15 minutes
- **Lockout duration:** 15 minutes

## Pagination

All list endpoints support pagination:

```typescript
page?: number;    // 1-indexed, default: 1
limit?: number;   // Items per page, default: 20, max: 100
```

Response includes `total` field for offset calculation.

## Development Notes

- All IDs are strings (CUID or UUID)
- Dates are ISO 8601 format
- Times are milliseconds (performance timing)
- Currency values are in Indian Rupees (Lakhs)
- GPA values are on 0-10 scale

For more information, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
