// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface CreateJobInput {
  title: string;
  description: string;
  company: string;
  location: string;
  ctc: number;
  minCgpa: number;
  allowedBranches: string[];
  allowedYears: number[];
}

export async function createJob(input: CreateJobInput) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter || !recruiter.approved) {
      return {
        success: false,
        error: "Your account must be approved to create jobs",
      };
    }

    const job = await prisma.job.create({
      data: {
        title: input.title,
        description: input.description,
        company: input.company,
        location: input.location,
        ctc: parseFloat(input.ctc.toString()),
        minCgpa: parseFloat(input.minCgpa.toString()),
        allowedBranches: input.allowedBranches,
        allowedYears: input.allowedYears,
        recruiterId: recruiter.id,
      },
    });

    return { success: true, data: job };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, error: "Failed to create job" };
  }
}

export async function updateJob(jobId: string, input: CreateJobInput) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter profile not found" };
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only edit your own jobs",
      };
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: input.title,
        description: input.description,
        company: input.company,
        location: input.location,
        ctc: parseFloat(input.ctc.toString()),
        minCgpa: parseFloat(input.minCgpa.toString()),
        allowedBranches: input.allowedBranches,
        allowedYears: input.allowedYears,
      },
    });

    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, error: "Failed to update job" };
  }
}

export async function deleteJob(jobId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter profile not found" };
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only delete your own jobs",
      };
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, error: "Failed to delete job" };
  }
}

export async function getRecruiterJobs() {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter profile not found" };
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId: recruiter.id },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    return { success: false, error: "Failed to fetch jobs" };
  }
}

export async function getJobDetail(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            id: true,
            company: true,
            contactName: true,
            phone: true,
          },
        },
      },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    return { success: true, data: job };
  } catch (error) {
    console.error("Error fetching job detail:", error);
    return { success: false, error: "Failed to fetch job" };
  }
}

export async function getAdminJobs() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const jobs = await prisma.job.findMany({
      include: {
        recruiter: {
          select: {
            company: true,
            contactName: true,
          },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return { success: false, error: "Failed to fetch jobs" };
  }
}

export async function adminDeleteJob(jobId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, error: "Failed to delete job" };
  }
}

export async function getJobApplications(jobId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter profile not found" };
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only view applications for your own jobs",
      };
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return { success: true, data: applications };
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return { success: false, error: "Failed to fetch applications" };
  }
}
