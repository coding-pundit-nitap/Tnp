// @ts-nocheck
"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  generateStudentCSV,
  generateRecruiterCSV,
  generateJobsCSV,
  generateApplicationsCSV,
  generatePlacementsCSV,
  getCSVHeaders,
} from "@/lib/csv";

/**
 * Export students to CSV
 */
export async function exportStudentsCSV(): Promise<{
  success: boolean;
  csv?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can export data" };
    }

    const students = await prisma.student.findMany({
      include: {
        user: { select: { name: true, email: true, status: true } },
        applications: {
          where: {
            offer: {
              accepted: true,
            },
          },
        },
      },
    });

    const enrichedStudents = students.map((s) => ({
      ...s,
      placements: s.applications.length,
    }));

    const csv = generateStudentCSV(enrichedStudents);

    return {
      success: true,
      csv,
      filename: `students_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error: any) {
    console.error("Export students error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Export recruiters to CSV
 */
export async function exportRecruitersCSV(): Promise<{
  success: boolean;
  csv?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can export data" };
    }

    const recruiters = await prisma.recruiter.findMany({
      include: {
        user: { select: { name: true, email: true } },
        jobs: {
          include: {
            applications: true,
          },
        },
      },
    });

    const enrichedRecruiters = recruiters.map((r) => ({
      ...r,
      jobsCount: r.jobs.length,
      applicationsCount: r.jobs.reduce(
        (sum, job) => sum + job.applications.length,
        0,
      ),
    }));

    const csv = generateRecruiterCSV(enrichedRecruiters);

    return {
      success: true,
      csv,
      filename: `recruiters_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error: any) {
    console.error("Export recruiters error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Export jobs to CSV
 */
export async function exportJobsCSV(): Promise<{
  success: boolean;
  csv?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can export data" };
    }

    const jobs = await prisma.job.findMany({
      include: {
        applications: true,
      },
    });

    const enrichedJobs = jobs.map((j) => ({
      ...j,
      applicationsCount: j.applications.length,
    }));

    const csv = generateJobsCSV(enrichedJobs);

    return {
      success: true,
      csv,
      filename: `jobs_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error: any) {
    console.error("Export jobs error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Export applications to CSV
 */
export async function exportApplicationsCSV(): Promise<{
  success: boolean;
  csv?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can export data" };
    }

    const applications = await prisma.application.findMany({
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });

    const csv = generateApplicationsCSV(applications);

    return {
      success: true,
      csv,
      filename: `applications_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error: any) {
    console.error("Export applications error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Export placement results to CSV
 */
export async function exportPlacementsCSV(): Promise<{
  success: boolean;
  csv?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can export data" };
    }

    const placements = await prisma.offer.findMany({
      where: { accepted: true },
      include: {
        application: {
          include: {
            student: {
              include: {
                user: { select: { name: true } },
              },
            },
            job: {
              select: {
                title: true,
                company: true,
              },
            },
          },
        },
      },
    });

    const csv = generatePlacementsCSV(
      placements.map((p) => ({
        offer: p,
        application: p.application,
      })),
    );

    return {
      success: true,
      csv,
      filename: `placements_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error: any) {
    console.error("Export placements error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get CSV download headers
 */
export async function getDownloadHeaders(
  filename: string,
): Promise<Record<string, string>> {
  return getCSVHeaders(filename);
}
