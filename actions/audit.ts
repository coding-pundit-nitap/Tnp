// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditActionType } from "@prisma/client";

interface AuditLogInput {
  action: AuditActionType;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(input: AuditLogInput): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const log = await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        changes: input.changes,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return { success: true, data: log };
  } catch (error: any) {
    console.error("Create audit log error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(filters: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  success: boolean;
  data?: Array<any>;
  total?: number;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can view audit logs" };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { success: true, data: logs, total };
  } catch (error: any) {
    console.error("Get audit logs error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get audit log summary (counts by action)
 */
export async function getAuditLogSummary(): Promise<{
  success: boolean;
  data?: Record<string, number>;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can view audit logs" };
    }

    // Count logs by action type
    const actions = [
      "CREATE_JOB",
      "UPDATE_JOB",
      "DELETE_JOB",
      "APPROVE_RECRUITER",
      "REJECT_RECRUITER",
      "CREATE_APPLICATION",
      "UPDATE_APPLICATION_STATUS",
      "SCHEDULE_INTERVIEW",
      "UPDATE_INTERVIEW_RESULT",
      "GENERATE_OFFER",
      "ACCEPT_OFFER",
      "DECLINE_OFFER",
      "UPLOAD_RESUME",
    ];

    const summary: Record<string, number> = {};

    for (const action of actions) {
      const count = await prisma.auditLog.count({
        where: { action: action as AuditActionType },
      });
      summary[action] = count;
    }

    return { success: true, data: summary };
  } catch (error: any) {
    console.error("Get audit log summary error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Export audit logs to CSV
 */
export async function exportAuditLogs(filters: {
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10000,
    });

    // Convert to CSV
    const headers = [
      "Timestamp",
      "User",
      "Email",
      "Action",
      "Entity Type",
      "Entity ID",
      "Details",
    ];
    const rows = logs.map((log) => [
      new Date(log.createdAt).toISOString(),
      log.user.name,
      log.user.email,
      log.action,
      log.entityType,
      log.entityId || "N/A",
      log.changes ? JSON.stringify(log.changes) : "N/A",
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

    return { success: true, data: csv };
  } catch (error: any) {
    console.error("Export audit logs error:", error);
    return { success: false, error: error.message };
  }
}
