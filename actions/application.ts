// @ts-nocheck
"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function applyToJob(jobId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      return { success: false, error: "Student profile not found" };
    }

    // Check if basic profile details are present
    if (
      !student.branch ||
      !student.year ||
      student.cgpa === undefined ||
      student.cgpa === null
    ) {
      return {
        success: false,
        error:
          "Please complete your basic profile details (branch, year, CGPA) before applying",
      };
    }

    // Check for existing application
    const existingApp = await prisma.application.findUnique({
      where: { jobId_studentId: { jobId, studentId: student.id } },
    });

    if (existingApp) {
      return {
        success: false,
        error: "You have already applied to this job",
      };
    }

    // Verify student is eligible
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Check eligibility
    if (student.cgpa < job.minCgpa) {
      return {
        success: false,
        error: `Minimum CGPA required: ${job.minCgpa}`,
      };
    }

    if (!job.allowedBranches.includes(student.branch)) {
      return {
        success: false,
        error: `Your branch (${student.branch}) is not eligible for this job`,
      };
    }

    if (!job.allowedYears.includes(student.year)) {
      return {
        success: false,
        error: `Your year (${student.year}) is not eligible for this job`,
      };
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        studentId: student.id,
        status: "APPLIED",
      },
    });

    return { success: true, data: application };
  } catch (error) {
    console.error("Error applying to job:", error);
    return { success: false, error: "Failed to apply to job" };
  }
}

export async function getStudentApplications() {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      return { success: false, error: "Student profile not found" };
    }

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            ctc: true,
            recruiter: {
              select: {
                contactName: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return { success: true, data: applications };
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { success: false, error: "Failed to fetch applications" };
  }
}

export async function getEligibleJobs() {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      return { success: false, error: "Student profile not found" };
    }

    // Get all jobs where recruiter is approved
    const jobs = await prisma.job.findMany({
      where: {
        recruiter: {
          approved: true,
        },
      },
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

    // Filter eligible jobs and add eligibility info
    const eligibleJobs = jobs
      .map((job) => {
        const isCgpaEligible = student.cgpa >= job.minCgpa;
        const isBranchEligible = job.allowedBranches.includes(student.branch);
        const isYearEligible = job.allowedYears.includes(student.year);
        const isEligible = isCgpaEligible && isBranchEligible && isYearEligible;

        return {
          ...job,
          isEligible,
          eligibilityDetails: {
            cgpa: { required: job.minCgpa, eligible: isCgpaEligible },
            branch: {
              allowed: job.allowedBranches,
              eligible: isBranchEligible,
            },
            year: { allowed: job.allowedYears, eligible: isYearEligible },
          },
        };
      })
      .sort((a, b) => (b.isEligible ? 1 : -1)); // Eligible jobs first

    return { success: true, data: eligibleJobs };
  } catch (error) {
    console.error("Error fetching eligible jobs:", error);
    return { success: false, error: "Failed to fetch jobs" };
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

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
) {
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

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    if (application.job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only update applications for your own jobs",
      };
    }

    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: { status, updatedAt: new Date() },
    });

    return { success: true, data: updatedApp };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: "Failed to update application" };
  }
}
