// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

// Student Register Schema
const studentRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Invalid email format")
      .refine(
        (email) => email.toLowerCase().endsWith("@nitap.ac.in"),
        "Student email must be @nitap.ac.in",
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    branch: z.string().min(2, "Branch is required"),
    year: z.coerce.number().int().min(1).max(4),
    cgpa: z.coerce.number().min(0).max(10),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Recruiter Register Schema
const recruiterRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    company: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact name is required"),
    phone: z.string().min(10, "Valid phone number required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function registerStudentAction(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      branch: formData.get("branch") as string,
      year: formData.get("year") as string,
      cgpa: formData.get("cgpa") as string,
    };

    const validated = studentRegisterSchema.parse(data);

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user with student record
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: "STUDENT",
        emailVerified: true,
        student: {
          create: {
            branch: validated.branch,
            year: validated.year,
            cgpa: validated.cgpa,
          },
        },
      },
    });
    redirect(
      `/login?message=${encodeURIComponent("Registration successful. Please sign in.")}`,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0]?.message || "Validation failed");
    }
    throw error;
  }
}

export async function registerRecruiterAction(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      company: formData.get("company") as string,
      contactName: formData.get("contactName") as string,
      phone: formData.get("phone") as string,
    };

    const validated = recruiterRegisterSchema.parse(data);

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user with recruiter record
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: "RECRUITER",
        emailVerified: true,
        recruiter: {
          create: {
            company: validated.company,
            contactName: validated.contactName,
            phone: validated.phone,
            approved: false,
          },
        },
      },
    });

    // Recruiter registration pending approval - don't auto-login
    // Redirect to login with message
    redirect(
      "/login?message=Registration%20successful%20-%20awaiting%20admin%20approval",
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0]?.message || "Validation failed");
    }
    throw error;
  }
}
