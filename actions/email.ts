// @ts-nocheck
"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatEmailTemplate, sendEmail } from "@/lib/email";

/**
 * Send email notification for recruiter approval
 */
export async function sendRecruiterApprovalEmail(recruiterId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { id: recruiterId },
      include: { user: true },
    });

    if (!recruiter) {
      return { success: false, error: "Recruiter not found" };
    }

    const { subject, body } = formatEmailTemplate("RECRUITER_APPROVAL", {
      recruiterName: recruiter.contactName,
      company: recruiter.company,
      portalUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    return sendEmail({
      to: [recruiter.user.email],
      subject,
      body,
    });
  } catch (error: any) {
    console.error("Send recruiter approval email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send job posted notification to eligible students
 */
export async function sendJobPostedEmail(jobId: string): Promise<{
  success: boolean;
  sentCount?: number;
  error?: string;
}> {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Find eligible students
    const students = await prisma.student.findMany({
      where: {
        branch: { in: job.allowedBranches },
        year: { in: job.allowedYears },
        cgpa: { gte: job.minCgpa },
      },
      include: { user: true },
    });

    if (students.length === 0) {
      return { success: true, sentCount: 0 };
    }

    // Send email to batch
    const { subject, body } = formatEmailTemplate("JOB_POSTED", {
      jobTitle: job.title,
      company: job.company,
      ctc: job.ctc,
      minCgpa: job.minCgpa,
      location: job.location,
      description: job.description,
      jobId,
      portalUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    const emailResult = await sendEmail({
      to: students.map((s) => s.user.email),
      subject,
      body,
    });

    return {
      success: emailResult.success,
      sentCount: students.length,
      error: emailResult.error,
    };
  } catch (error: any) {
    console.error("Send job posted email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send batch email notification
 */
export async function sendBatchEmail(
  emails: string[],
  templateKey: string,
  templateData: Record<string, any>,
): Promise<{
  success: boolean;
  sentCount?: number;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can send batch emails" };
    }

    if (emails.length === 0) {
      return { success: false, error: "No email addresses provided" };
    }

    const { subject, body } = formatEmailTemplate(templateKey, templateData);

    const result = await sendEmail({
      to: emails,
      subject,
      body,
    });

    return {
      success: result.success,
      sentCount: emails.length,
      error: result.error,
    };
  } catch (error: any) {
    console.error("Send batch email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send application status notification to student
 */
export async function sendApplicationStatusEmail(
  applicationId: string,
  status: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { include: { user: true } },
        job: true,
      },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    let templateKey = "OTHER";
    if (status === "SHORTLISTED") {
      templateKey = "APPLICATION_SHORTLISTED";
    } else if (status === "SELECTED") {
      templateKey = "SELECTED";
    }

    const { subject, body } = formatEmailTemplate(templateKey, {
      studentName: application.student.user.name,
      jobTitle: application.job.title,
      company: application.job.company,
      portalUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    return sendEmail({
      to: [application.student.user.email],
      subject,
      body,
    });
  } catch (error: any) {
    console.error("Send application status email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send interview round scheduled notification
 */
export async function sendInterviewRoundEmail(
  roundId: string,
  applicationIds: string[],
): Promise<{
  success: boolean;
  sentCount?: number;
  error?: string;
}> {
  try {
    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: { job: true },
    });

    if (!round) {
      return { success: false, error: "Interview round not found" };
    }

    const applications = await prisma.application.findMany({
      where: { id: { in: applicationIds } },
      include: {
        student: { include: { user: true } },
      },
    });

    if (applications.length === 0) {
      return { success: true, sentCount: 0 };
    }

    const { subject, body } = formatEmailTemplate("ROUND_SCHEDULED", {
      roundName: round.name,
      jobTitle: round.job.title,
      date: new Date(round.date).toLocaleDateString(),
      time: new Date(round.date).toLocaleTimeString(),
      location: round.location,
      notes: round.notes,
      portalUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    const result = await sendEmail({
      to: applications.map((a) => a.student.user.email),
      subject,
      body,
    });

    return {
      success: result.success,
      sentCount: applications.length,
      error: result.error,
    };
  } catch (error: any) {
    console.error("Send interview round email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send offer released notification
 */
export async function sendOfferEmail(offerId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        application: {
          include: {
            student: { include: { user: true } },
            job: true,
          },
        },
      },
    });

    if (!offer) {
      return { success: false, error: "Offer not found" };
    }

    const { subject, body } = formatEmailTemplate("OFFER_RELEASED", {
      studentName: offer.application.student.user.name,
      jobTitle: offer.application.job.title,
      company: offer.application.job.company,
      ctcFinal: offer.ctcFinal,
      offerLetterUrl: offer.offerLetterUrl,
      portalUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    return sendEmail({
      to: [offer.application.student.user.email],
      subject,
      body,
    });
  } catch (error: any) {
    console.error("Send offer email error:", error);
    return { success: false, error: error.message };
  }
}
