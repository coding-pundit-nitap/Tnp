"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const studentSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Invalid email")
      .refine(
        (e) => e.toLowerCase().endsWith("@nitap.ac.in"),
        "Must use @nitap.ac.in email",
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    branch: z.string().min(2, "Branch is required"),
    year: z.coerce.number().int().min(1).max(4),
    cgpa: z.coerce.number().min(0).max(10),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const recruiterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    company: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact name is required"),
    phone: z.string().min(10, "Valid phone number required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function registerStudentAction(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    branch: formData.get("branch") as string,
    year: formData.get("year") as string,
    cgpa: formData.get("cgpa") as string,
  };

  const validated = studentSchema.parse(data);

  // Check existing
  const existing = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  // Create user via Better Auth
  const result = await auth.api.signUpEmail({
    body: {
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: "STUDENT",
      status: "ACTIVE",
    },
    headers: await headers(),
  });

  if (!result || !result.user) {
    throw new Error("Registration failed");
  }

  // Create student profile
  await prisma.student.create({
    data: {
      userId: result.user.id,
      branch: validated.branch,
      year: validated.year,
      cgpa: validated.cgpa,
    },
  });

  // Update user status to ACTIVE
  await prisma.user.update({
    where: { id: result.user.id },
    data: { status: "ACTIVE", role: "STUDENT" },
  });

  redirect(
    `/login?message=${encodeURIComponent("Registration successful. Please sign in.")}`,
  );
}

export async function registerRecruiterAction(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    company: formData.get("company") as string,
    contactName: formData.get("contactName") as string,
    phone: formData.get("phone") as string,
  };

  const validated = recruiterSchema.parse(data);

  // Check existing
  const existing = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  // Create user via Better Auth
  const result = await auth.api.signUpEmail({
    body: {
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: "RECRUITER",
      status: "PENDING",
    },
    headers: await headers(),
  });

  if (!result || !result.user) {
    throw new Error("Registration failed");
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

  redirect(
    `/login?message=${encodeURIComponent("Registration successful — awaiting admin approval")}`,
  );
}
