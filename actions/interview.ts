// @ts-nocheck
"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { RoundResultStatus } from "@prisma/client";

export interface CreateInterviewRoundInput {
  jobId: string;
  name: string;
  roundNumber: number;
  date: string;
  location: string;
  notes?: string;
}

export async function createInterviewRound(input: CreateInterviewRoundInput) {
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
        error: "Your account must be approved",
      };
    }

    const job = await prisma.job.findUnique({
      where: { id: input.jobId },
    });

    if (!job || job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only manage rounds for your own jobs",
      };
    }

    const round = await prisma.interviewRound.create({
      data: {
        jobId: input.jobId,
        name: input.name,
        roundNumber: input.roundNumber,
        date: new Date(input.date),
        location: input.location,
        notes: input.notes || null,
      },
    });

    // Create notifications for all shortlisted applicants
    const shortlistedApps = await prisma.application.findMany({
      where: {
        jobId: input.jobId,
        status: "SHORTLISTED",
      },
      include: {
        student: {
          select: { userId: true },
        },
      },
    });

    for (const app of shortlistedApps) {
      await prisma.notification.create({
        data: {
          userId: app.student.userId,
          title: `Interview Round: ${input.name}`,
          message: `You have an interview round on ${new Date(input.date).toLocaleDateString()} at ${input.location}`,
        },
      });
    }

    return { success: true, data: round };
  } catch (error) {
    console.error("Error creating interview round:", error);
    return { success: false, error: "Failed to create interview round" };
  }
}

export async function getJobRounds(jobId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter not found" };
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only view rounds for your own jobs",
      };
    }

    const rounds = await prisma.interviewRound.findMany({
      where: { jobId },
      include: {
        _count: { select: { results: true } },
      },
      orderBy: { roundNumber: "asc" },
    });

    return { success: true, data: rounds };
  } catch (error) {
    console.error("Error fetching rounds:", error);
    return { success: false, error: "Failed to fetch rounds" };
  }
}

export async function getRoundDetail(roundId: string) {
  try {
    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: {
        job: {
          select: { title: true, company: true },
        },
      },
    });

    if (!round) {
      return { success: false, error: "Round not found" };
    }

    return { success: true, data: round };
  } catch (error) {
    console.error("Error fetching round:", error);
    return { success: false, error: "Failed to fetch round" };
  }
}

export async function updateInterviewRound(
  roundId: string,
  input: CreateInterviewRoundInput,
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
      return { success: false, error: "Recruiter not found" };
    }

    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: { job: true },
    });

    if (!round || round.job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only update your own rounds",
      };
    }

    const updated = await prisma.interviewRound.update({
      where: { id: roundId },
      data: {
        name: input.name,
        roundNumber: input.roundNumber,
        date: new Date(input.date),
        location: input.location,
        notes: input.notes || null,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating round:", error);
    return { success: false, error: "Failed to update round" };
  }
}

export async function deleteInterviewRound(roundId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return { success: false, error: "Unauthorized" };
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.id },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter not found" };
    }

    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: { job: true },
    });

    if (!round || round.job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only delete your own rounds",
      };
    }

    await prisma.interviewRound.delete({
      where: { id: roundId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting round:", error);
    return { success: false, error: "Failed to delete round" };
  }
}
