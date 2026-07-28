// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logInfo, logError, logPermission, createTimer } from "@/lib/logger";

/**
 * Get overall placement statistics
 */
export async function getPlacementStats(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const timer = createTimer();

  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      logPermission("analytics", "getPlacementStats", false, session?.id);
      return { success: false, error: "Only admins can view analytics" };
    }

    logInfo("analytics", "Fetching placement statistics", {
      userId: session.id,
    });

    const [
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalApplications,
      selectedApplications,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.recruiter.count({ where: { approved: true } }),
      prisma.job.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: "SELECTED" } }),
    ]);

    const offers = await prisma.offer.findMany({
      where: { accepted: true },
    });

    const placedStudents = new Set(offers.map((o: any) => o.applicationId));

    // Calculate average CTC
    const avgCtc =
      offers.length > 0
        ? Math.round(
            (offers.reduce((sum: number, o: any) => sum + o.ctcFinal, 0) / offers.length) *
              100,
          ) / 100
        : 0;

    // Calculate highest CTC
    const highestCtc =
      offers.length > 0 ? Math.max(...offers.map((o: any) => o.ctcFinal)) : 0;

    const placementRate =
      totalStudents > 0
        ? Math.round((placedStudents.size / totalStudents) * 10000) / 100
        : 0;

    return {
      success: true,
      data: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
        selectedApplications,
        placedStudents: placedStudents.size,
        placementRate,
        averageCtc: avgCtc,
        highestCtc,
      },
    };
  } catch (error: any) {
    logError("analytics", error, { action: "getPlacementStats" });
    return {
      success: false,
      error: error.message || "Failed to fetch placement statistics",
    };
  }
}

/**
 * Get branch-wise placement statistics
 */
export async function getBranchPlacementStats(): Promise<{
  success: boolean;
  data?: Array<any>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can view analytics" };
    }

    const students = await prisma.student.findMany({
      include: {
        applications: {
          include: {
            offer: true,
          },
        },
      },
    });

    // Group by branch and calculate stats
    const branchStats: Record<
      string,
      {
        branch: string;
        total: number;
        placed: number;
        placementRate: number;
        avgCtc: number;
      }
    > = {};

    students.forEach((student) => {
      if (!branchStats[student.branch]) {
        branchStats[student.branch] = {
          branch: student.branch,
          total: 0,
          placed: 0,
          placementRate: 0,
          avgCtc: 0,
        };
      }

      branchStats[student.branch].total++;

      const offer = student.applications.find((app) => app.offer?.accepted);
      if (offer) {
        branchStats[student.branch].placed++;
      }
    });

    // Calculate percentages
    Object.values(branchStats).forEach((stat) => {
      stat.placementRate =
        stat.total > 0 ? Math.round((stat.placed / stat.total) * 100) : 0;
    });

    return {
      success: true,
      data: Object.values(branchStats),
    };
  } catch (error: any) {
    console.error("Get branch stats error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get company-wise application statistics
 */
export async function getCompanyStats(): Promise<{
  success: boolean;
  data?: Array<any>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can view analytics" };
    }

    const jobs = await prisma.job.findMany({
      include: {
        applications: {
          include: {
            offer: true,
          },
        },
      },
    });

    const companyStats = jobs.map((job) => {
      const selected = job.applications.filter(
        (app) => app.status === "SELECTED",
      ).length;
      const offered = job.applications.filter((app) => app.offer).length;
      const accepted = job.applications.filter(
        (app) => app.offer?.accepted,
      ).length;

      return {
        company: job.company,
        jobTitle: job.title,
        ctc: job.ctc,
        applications: job.applications.length,
        selected,
        offered,
        accepted,
        selectionRate:
          job.applications.length > 0
            ? Math.round((selected / job.applications.length) * 100)
            : 0,
      };
    });

    return {
      success: true,
      data: companyStats.sort((a, b) => b.accepted - a.accepted),
    };
  } catch (error: any) {
    console.error("Get company stats error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get recruiter-wise statistics
 */
export async function getRecruiterStats(): Promise<{
  success: boolean;
  data?: Array<any>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiters = await prisma.recruiter.findMany({
      include: {
        jobs: {
          include: {
            applications: {
              include: {
                offer: true,
              },
            },
          },
        },
      },
    });

    const recruiterStats = recruiters.map((recruiter) => {
      const totalApplications = recruiter.jobs.reduce(
        (sum, job) => sum + job.applications.length,
        0,
      );
      const totalSelected = recruiter.jobs.reduce(
        (sum, job) =>
          sum +
          job.applications.filter((app) => app.status === "SELECTED").length,
        0,
      );
      const totalAccepted = recruiter.jobs.reduce(
        (sum, job) =>
          sum + job.applications.filter((app) => app.offer?.accepted).length,
        0,
      );

      return {
        recruiter: recruiter.company,
        contactPerson: recruiter.contactName,
        jobsPosted: recruiter.jobs.length,
        totalApplications,
        selected: totalSelected,
        accepted: totalAccepted,
        selectionRate:
          totalApplications > 0
            ? Math.round((totalSelected / totalApplications) * 100)
            : 0,
      };
    });

    return {
      success: true,
      data: recruiterStats.sort((a, b) => b.accepted - a.accepted),
    };
  } catch (error: any) {
    console.error("Get recruiter stats error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get year-wise placement statistics
 */
export async function getYearPlacementStats(): Promise<{
  success: boolean;
  data?: Array<any>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const students = await prisma.student.findMany({
      include: {
        applications: {
          include: {
            offer: true,
          },
        },
      },
    });

    const yearStats: Record<
      number,
      {
        year: number;
        total: number;
        placed: number;
        placementRate: number;
      }
    > = {};

    students.forEach((student) => {
      if (!yearStats[student.year]) {
        yearStats[student.year] = {
          year: student.year,
          total: 0,
          placed: 0,
          placementRate: 0,
        };
      }

      yearStats[student.year].total++;

      if (student.applications.some((app) => app.offer?.accepted)) {
        yearStats[student.year].placed++;
      }
    });

    Object.values(yearStats).forEach((stat) => {
      stat.placementRate =
        stat.total > 0 ? Math.round((stat.placed / stat.total) * 100) : 0;
    });

    return {
      success: true,
      data: Object.values(yearStats).sort((a, b) => a.year - b.year),
    };
  } catch (error: any) {
    console.error("Get year stats error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get application timeline data (for charts)
 */
export async function getApplicationTimeline(): Promise<{
  success: boolean;
  data?: Array<{ date: string; count: number }>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const applications = await prisma.application.findMany({
      select: { appliedAt: true },
    });

    // Group by date
    const timelineData: Record<string, number> = {};

    applications.forEach((app) => {
      const date = new Date(app.appliedAt).toISOString().split("T")[0];
      timelineData[date] = (timelineData[date] || 0) + 1;
    });

    const data = Object.entries(timelineData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { success: true, data };
  } catch (error: any) {
    console.error("Get timeline error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get top skills in demand
 */
export async function getTopSkills(limit: number = 10): Promise<{
  success: boolean;
  data?: Array<{ skill: string; count: number }>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const resumes = await prisma.resume.findMany({
      select: { skills: true },
    });

    const skillCounts: Record<string, number> = {};

    resumes.forEach((resume) => {
      resume.skills.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));

    return { success: true, data: topSkills };
  } catch (error: any) {
    console.error("Get top skills error:", error);
    return { success: false, error: error.message };
  }
}
