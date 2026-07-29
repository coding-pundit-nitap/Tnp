// @ts-nocheck
"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateStudentProfileSchema = z.object({
  branch: z.string().min(1, "Branch is required"),
  year: z.coerce.number().min(1).max(4),
  cgpa: z.coerce.number().min(0).max(10),
  resumeUrl: z.string().optional(),
});

export async function updateStudentProfile(formData: Record<string, any>) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = updateStudentProfileSchema.parse(formData);

    const student = await prisma.student.update({
      where: { userId: session.id },
      data: {
        branch: validated.branch,
        year: validated.year,
        cgpa: validated.cgpa,
        ...(validated.resumeUrl && { resumeUrl: validated.resumeUrl }),
        profileCompleted: true,
      },
    });

    return { success: true, data: student };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

export async function getStudentProfile() {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    return { success: true, data: student };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch profile",
    };
  }
}
