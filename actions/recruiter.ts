// @ts-nocheck
"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const registerRecruiterSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export async function registerRecruiter(formData: Record<string, any>) {
  try {
    const validated = registerRecruiterSchema.parse(formData);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Create user via Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        name: validated.contactName,
        email: validated.email,
        password: validated.password,
        role: "RECRUITER",
        status: "PENDING",
      },
      headers: await headers(),
    });

    if (!result || !result.user) {
      return { success: false, error: "Registration failed" };
    }

    // Create recruiter profile
    await prisma.recruiter.create({
      data: {
        userId: result.user.id,
        company: validated.company,
        contactName: validated.contactName,
        phone: validated.phone,
        approved: false,
      },
    });

    return {
      success: true,
      message: "Registration submitted. Please wait for admin approval.",
      data: result.user,
    };
  } catch (error: any) {
    console.error("Recruiter registration error:", error);
    if (error.issues) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message || "Registration failed" };
  }
}

const approveRecruiterSchema = z.object({
  recruiterId: z.string().min(1),
});

export async function approveRecruiter(formData: Record<string, any>) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = approveRecruiterSchema.parse(formData);

    const recruiter = await prisma.recruiter.update({
      where: { id: validated.recruiterId },
      data: { approved: true },
      include: { user: true },
    });

    return { success: true, data: recruiter };
  } catch (error: any) {
    console.error("Approve recruiter error:", error);
    return {
      success: false,
      error: error.message || "Failed to approve recruiter",
    };
  }
}

export async function rejectRecruiter(formData: Record<string, any>) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const { recruiterId } = z
      .object({ recruiterId: z.string() })
      .parse(formData);

    // Delete user and associated recruiter
    const recruiter = await prisma.recruiter.findUnique({
      where: { id: recruiterId },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter not found" };
    }

    await prisma.user.delete({
      where: { id: recruiter.userId },
    });

    return { success: true, message: "Recruiter rejected" };
  } catch (error: any) {
    console.error("Reject recruiter error:", error);
    return {
      success: false,
      error: error.message || "Failed to reject recruiter",
    };
  }
}

export async function getPendingRecruiters() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiters = await prisma.recruiter.findMany({
      where: { approved: false },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: recruiters };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch recruiters",
    };
  }
}
