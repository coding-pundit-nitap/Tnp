// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoundResultStatus } from "@prisma/client";

export async function updateInterviewResult(
  applicationId: string,
  roundId: string,
  status: RoundResultStatus,
  remarks?: string,
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
        error: "You can only update results for your rounds",
      };
    }

    const result = await prisma.interviewResult.upsert({
      where: {
        applicationId_roundId: { applicationId, roundId },
      },
      update: {
        status,
        remarks: remarks || null,
        updatedAt: new Date(),
      },
      create: {
        applicationId,
        roundId,
        status,
        remarks: remarks || null,
      },
      include: {
        application: {
          include: {
            student: {
              select: { userId: true },
            },
          },
        },
      },
    });

    // Send notification to student
    await prisma.notification.create({
      data: {
        userId: result.application.student.userId,
        title: `Interview Result: ${round.name}`,
        message: `Your result for ${round.name} is ${status}`,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating interview result:", error);
    return { success: false, error: "Failed to update result" };
  }
}

export async function getRoundResults(roundId: string) {
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
      include: {
        job: true,
        results: {
          include: {
            application: {
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
            },
          },
        },
      },
    });

    if (!round || round.job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only view results for your rounds",
      };
    }

    return { success: true, data: round };
  } catch (error) {
    console.error("Error fetching round results:", error);
    return { success: false, error: "Failed to fetch results" };
  }
}

export async function getStudentInterviewResults(studentId: string) {
  try {
    const results = await prisma.interviewResult.findMany({
      where: {
        application: {
          studentId,
        },
      },
      include: {
        round: {
          include: {
            job: {
              select: {
                title: true,
                company: true,
              },
            },
          },
        },
      },
      orderBy: {
        round: {
          date: "desc",
        },
      },
    });

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching interview results:", error);
    return { success: false, error: "Failed to fetch results" };
  }
}

// OFFER MANAGEMENT

export async function generateOffer(
  applicationId: string,
  ctcFinal: number,
  offerLetterUrl?: string,
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

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, student: { select: { userId: true } } },
    });

    if (!application || application.job.recruiterId !== recruiter.id) {
      return {
        success: false,
        error: "You can only generate offers for your applications",
      };
    }

    if (application.status !== "SELECTED") {
      return {
        success: false,
        error: "Application must be SELECTED to generate offer",
      };
    }

    const offer = await prisma.offer.upsert({
      where: { applicationId },
      update: {
        ctcFinal,
        offerLetterUrl: offerLetterUrl || null,
        updatedAt: new Date(),
      },
      create: {
        applicationId,
        ctcFinal,
        offerLetterUrl: offerLetterUrl || null,
      },
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: application.student.userId,
        title: "Offer Generated",
        message: `You have received an offer for ₹${ctcFinal} LPA`,
      },
    });

    return { success: true, data: offer };
  } catch (error) {
    console.error("Error generating offer:", error);
    return { success: false, error: "Failed to generate offer" };
  }
}

export async function acceptOffer(applicationId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.studentId !== student.id) {
      return {
        success: false,
        error: "You can only accept your own offers",
      };
    }

    const offer = await prisma.offer.update({
      where: { applicationId },
      data: { accepted: true, updatedAt: new Date() },
    });

    return { success: true, data: offer };
  } catch (error) {
    console.error("Error accepting offer:", error);
    return { success: false, error: "Failed to accept offer" };
  }
}

export async function declineOffer(applicationId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.id },
    });

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.studentId !== student.id) {
      return {
        success: false,
        error: "You can only decline your own offers",
      };
    }

    const offer = await prisma.offer.update({
      where: { applicationId },
      data: { accepted: false, updatedAt: new Date() },
    });

    return { success: true, data: offer };
  } catch (error) {
    console.error("Error declining offer:", error);
    return { success: false, error: "Failed to decline offer" };
  }
}

export async function getStudentOffers(studentId: string) {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        application: {
          studentId,
        },
      },
      include: {
        application: {
          include: {
            job: {
              select: {
                title: true,
                company: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: offers };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return { success: false, error: "Failed to fetch offers" };
  }
}

export async function getRecruiterOffers(recruiterId: string) {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        application: {
          job: {
            recruiterId,
          },
        },
      },
      include: {
        application: {
          include: {
            job: true,
            student: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: offers };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return { success: false, error: "Failed to fetch offers" };
  }
}
