// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseResume, extractTextFromPDF } from "@/lib/resume-parser";
import { createAuditLog } from "./audit";
import { logInfo, logError, logAuth, createTimer } from "@/lib/logger";

/**
 * Upload resume for a student
 * Note: In production, you would upload to S3 or similar
 */
export async function uploadResume(formData: FormData): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const timer = createTimer();

  try {
    logInfo("resume", "Starting resume upload");

    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      logInfo("resume", "Unauthorized resume upload attempt", {
        userId: session?.id,
      });
      return { success: false, error: "Only students can upload resumes" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      logError("resume", "No file provided in form data");
      return { success: false, error: "No file provided" };
    }

    // Validate file
    if (file.type !== "application/pdf") {
      logInfo("resume", "Invalid file type", { type: file.type });
      return { success: false, error: "File must be a PDF" };
    }

    if (file.size > 5 * 1024 * 1024) {
      logInfo("resume", "File size exceeds limit", {
        size: file.size,
        limit: "5MB",
      });
      return { success: false, error: "File size must be less than 5MB" };
    }

    // Get student
    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      logError("resume", "Student profile not found", {
        userId: session.id,
      });
      return { success: false, error: "Student profile not found" };
    }

    logInfo("resume", "Found student profile", { studentId: student.id });

    // In production, upload to S3 and get the URL
    // For now, create a placeholder URL
    const filename = `resume-${student.id}-${Date.now()}.pdf`;
    const fileUrl = `/uploads/resumes/${filename}`;

    // Convert file to buffer for text extraction
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromPDF(arrayBuffer);

    logInfo("resume", "Extracted text from PDF", {
      length: text?.length || 0,
    });

    // Parse resume
    const parsed = await parseResume(text || file.name);

    logInfo("resume", "Resume parsed successfully", {
      skills: parsed.skills.length,
      education: parsed.education.length,
      cgpa: parsed.cgpaFromResume,
      keywords: parsed.keywords.length,
    });

    // Save or update resume record
    const resume = await prisma.resume.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        fileUrl,
        skills: parsed.skills,
        education: parsed.education,
        cgpaFromResume: parsed.cgpaFromResume,
        keywords: parsed.keywords,
        parsedAt: new Date(),
      },
      update: {
        fileUrl,
        skills: parsed.skills,
        education: parsed.education,
        cgpaFromResume: parsed.cgpaFromResume,
        keywords: parsed.keywords,
        parsedAt: new Date(),
      },
    });

    // Update student resume URL
    await prisma.student.update({
      where: { id: student.id },
      data: { resumeUrl: fileUrl },
    });

    logInfo("resume", "Resume saved to database", { resumeId: resume.id });

    // Log audit
    await createAuditLog({
      action: "UPLOAD_RESUME",
      entityType: "Resume",
      entityId: resume.id,
      changes: {
        skills: parsed.skills.length,
        keywords: parsed.keywords.length,
      },
    });

    const duration = timer.log("resume", "Resume upload completed");

    return {
      success: true,
      data: {
        resume,
        parsed,
      },
    };
  } catch (error: any) {
    logError("resume", error, { action: "uploadResume" });
    return {
      success: false,
      error:
        error.message || "Failed to upload and parse resume. Please try again.",
    };
  }
}

/**
 * Get student's parsed resume data
 */
export async function getStudentResume(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    let studentId: string;

    if (session.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: session.id },
      });
      if (!student) {
        return { success: false, error: "Student profile not found" };
      }
      studentId = student.id;
    } else if (session.role === "ADMIN") {
      // Get studentId from query or context, for now return error
      return { success: false, error: "Provide student ID" };
    } else {
      return { success: false, error: "Unauthorized" };
    }

    const resume = await prisma.resume.findUnique({
      where: { studentId },
    });

    return {
      success: true,
      data: resume,
    };
  } catch (error: any) {
    console.error("Get student resume error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete student resume
 */
export async function deleteResume(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    await prisma.resume.delete({
      where: { studentId: student.id },
    });

    await prisma.student.update({
      where: { id: student.id },
      data: { resumeUrl: null },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Delete resume error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all student resumes (admin only)
 */
export async function getAllStudentResumes(
  page: number = 1,
  limit: number = 20,
): Promise<{
  success: boolean;
  data?: Array<any>;
  total?: number;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can view all resumes" };
    }

    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { parsedAt: "desc" },
      }),
      prisma.resume.count(),
    ]);

    return { success: true, data: resumes, total };
  } catch (error: any) {
    console.error("Get all resumes error:", error);
    return { success: false, error: error.message };
  }
}
