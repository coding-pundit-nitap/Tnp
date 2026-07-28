import { z } from "zod";

// Auth validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "RECRUITER"]),
});

// Student registration
export const studentRegisterSchema = z.object({
  userId: z.string(),
  branch: z.string().min(1, "Branch is required"),
  year: z.number().min(1).max(4),
  cgpa: z.number().min(0).max(10, "CGPA must be between 0 and 10"),
});

// Recruiter registration
export const recruiterRegisterSchema = z.object({
  userId: z.string(),
  company: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
});

// Job creation/update
export const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z
    .string()
    .min(20, "Job description must be at least 20 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  ctc: z.number().min(0, "CTC must be a positive number"),
  minCgpa: z.number().min(0).max(10),
  allowedBranches: z.array(z.string()).min(1, "Select at least one branch"),
  allowedYears: z
    .array(z.number().min(1).max(4))
    .min(1, "Select at least one year"),
});

// Announcement creation
export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Interview round creation
export const interviewRoundSchema = z.object({
  name: z.string().min(2, "Round name is required"),
  roundNumber: z.number().min(1),
  date: z
    .string()
    .refine(
      (date) => new Date(date) > new Date(),
      "Interview date must be in the future",
    ),
  location: z.string().min(2, "Location is required"),
  notes: z.string().optional(),
});

// Interview result update
export const interviewResultSchema = z.object({
  status: z.enum(["PASS", "FAIL", "PENDING"]),
  remarks: z.string().optional(),
});

// Offer generation
export const offerSchema = z.object({
  ctcFinal: z.number().min(0, "CTC must be a positive number"),
  offerLetterUrl: z.string().url().optional(),
});

// Resume upload
export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "File must be a PDF")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    ),
});

// System settings
export const systemSettingsSchema = z.object({
  placementSeasonYear: z.number().min(2000).max(2100),
  defaultCgpaCutoff: z.number().min(0).max(10),
  portalOpen: z.boolean(),
  allowedDomains: z.array(z.string().email()).optional(),
  emailFrom: z.string().email(),
});

// Search and filter
export const searchFilterSchema = z.object({
  query: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Batch email send
export const emailSendSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(3),
  template: z.enum([
    "RECRUITER_APPROVAL",
    "JOB_POSTED",
    "APPLICATION_SHORTLISTED",
    "ROUND_SCHEDULED",
    "SELECTED",
    "OFFER_RELEASED",
  ]),
  templateData: z.record(z.string(), z.any()).optional(),
});

// Pagination
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Date range filter
export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// CSV export request
export const csvExportSchema = z.object({
  format: z.enum([
    "students",
    "recruiters",
    "jobs",
    "applications",
    "placements",
  ]),
  filters: z.record(z.string(), z.any()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type RecruiterRegisterInput = z.infer<typeof recruiterRegisterSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type InterviewRoundInput = z.infer<typeof interviewRoundSchema>;
export type InterviewResultInput = z.infer<typeof interviewResultSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;
export type SearchFilterInput = z.infer<typeof searchFilterSchema>;
export type EmailSendInput = z.infer<typeof emailSendSchema>;
export type CsvExportInput = z.infer<typeof csvExportSchema>;
