// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearLoginAttempts,
  isRateLimited,
  recordLoginAttempt,
  sanitizeInput,
} from "@/lib/security";

export async function loginAction(formData: FormData) {
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
  const role = formData.get("role") as "STUDENT" | "RECRUITER" | "ADMIN";

  const email = sanitizeInput(rawEmail || "").toLowerCase();
  const password = sanitizeInput(rawPassword || "");

  if (!email || !password || !role) {
    redirect(`/login?error=${encodeURIComponent("Missing credentials")}`);
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") || "";
  const ipAddress = forwardedFor.split(",")[0]?.trim() || "unknown";

  const emailKey = `email:${email}`;
  const ipKey = `ip:${ipAddress}`;

  if (isRateLimited(emailKey) || isRateLimited(ipKey)) {
    redirect(
      `/login?error=${encodeURIComponent("Too many failed attempts. Please try again in 15 minutes")}`,
    );
  }

  // Only allow @nitap.ac.in emails for students
  if (role === "STUDENT" && !email.toLowerCase().endsWith("@nitap.ac.in")) {
    redirect(
      `/login?error=${encodeURIComponent("Students must use @nitap.ac.in email address")}`,
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { recruiter: true },
  });

  if (!user)
    return redirect(
      `/login?error=${encodeURIComponent("Invalid credentials")}`,
    );

  if (user.role !== role) {
    return redirect(`/login?error=${encodeURIComponent("Role mismatch")}`);
  }

  // Optional enforcement: set REQUIRE_EMAIL_VERIFICATION=true to enable.
  if (
    process.env.REQUIRE_EMAIL_VERIFICATION === "true" &&
    user.role !== "ADMIN" &&
    !user.emailVerified
  ) {
    return redirect(
      `/login?error=${encodeURIComponent("Please verify your email before logging in")}`,
    );
  }

  if (
    user.role === "RECRUITER" &&
    (!user.recruiter || user.recruiter.approved === false)
  ) {
    return redirect(
      `/login?error=${encodeURIComponent("Awaiting admin approval")}`,
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    recordLoginAttempt(emailKey);
    recordLoginAttempt(ipKey);
    return redirect(
      `/login?error=${encodeURIComponent("Invalid credentials")}`,
    );
  }

  clearLoginAttempts(emailKey);
  clearLoginAttempts(ipKey);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "STUDENT") redirect("/student");
  redirect("/recruiter");
}

export async function verifyEmailAction(formData: FormData) {
  void formData;
  redirect(
    `/login?message=${encodeURIComponent("Email verification is disabled")}`,
  );
}

export async function resendVerificationAction(formData: FormData) {
  void formData;
  redirect(
    `/login?message=${encodeURIComponent("Email verification is disabled")}`,
  );
}
