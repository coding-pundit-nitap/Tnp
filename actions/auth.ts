"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const role = formData.get("role") as "STUDENT" | "RECRUITER" | "ADMIN";

  if (!email || !password || !role) {
    redirect(`/login?error=${encodeURIComponent("Missing credentials")}`);
  }

  // Validate student email domain
  if (role === "STUDENT" && !email.endsWith("@nitap.ac.in")) {
    redirect(
      `/login?error=${encodeURIComponent("Students must use @nitap.ac.in email")}`,
    );
  }

  // Check user exists and has correct role
  const user = await prisma.user.findUnique({
    where: { email },
    include: { recruiter: true },
  });

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
  }

  if (user.role !== role) {
    redirect(`/login?error=${encodeURIComponent("Role mismatch. Select correct role.")}`);
  }

  // Check recruiter approval
  if (role === "RECRUITER" && user.recruiter && !user.recruiter.approved) {
    redirect(
      `/login?error=${encodeURIComponent("Your account is awaiting admin approval")}`,
    );
  }

  // Sign in with Better Auth
  const result = await auth.api.signInEmail({
    body: { email, password },
    headers: await headers(),
  });

  if (!result || !result.token) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
  }

  // Redirect based on role
  if (role === "ADMIN") redirect("/admin");
  if (role === "STUDENT") redirect("/student");
  redirect("/recruiter");
}
