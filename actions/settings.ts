// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { systemSettingsSchema } from "@/lib/validations";
import { createAuditLog } from "./audit";

/**
 * Get system settings
 */
export async function getSystemSettings(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    // Create default settings if not exist
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "default",
          placementSeasonYear: new Date().getFullYear(),
          defaultCgpaCutoff: 6.0,
          portalOpen: true,
          allowedDomains: [],
          emailFrom: "noreply@placement.portal.com",
        },
      });
    }

    return { success: true, data: settings };
  } catch (error: any) {
    console.error("Get settings error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update system settings (admin only)
 */
export async function updateSystemSettings(input: any): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only admins can update settings" };
    }

    // Validate input
    const validated = systemSettingsSchema.parse(input);

    const settings = await prisma.systemSettings.update({
      where: { id: "default" },
      data: {
        placementSeasonYear: validated.placementSeasonYear,
        defaultCgpaCutoff: validated.defaultCgpaCutoff,
        portalOpen: validated.portalOpen,
        allowedDomains: validated.allowedDomains || [],
        emailFrom: validated.emailFrom,
      },
    });

    // Log audit
    await createAuditLog({
      action: "UPDATE_SETTINGS",
      entityType: "SystemSettings",
      changes: validated,
    });

    return { success: true, data: settings };
  } catch (error: any) {
    console.error("Update settings error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if portal is open
 */
export async function isPortalOpen(): Promise<{
  success: boolean;
  open?: boolean;
  error?: string;
}> {
  try {
    const settings = await getSystemSettings();
    return {
      success: settings.success,
      open: settings.data?.portalOpen ?? true,
    };
  } catch (error: any) {
    console.error("Check portal open error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current placement season
 */
export async function getCurrentPlacementSeason(): Promise<{
  success: boolean;
  year?: number;
  error?: string;
}> {
  try {
    const settings = await getSystemSettings();
    return {
      success: settings.success,
      year: settings.data?.placementSeasonYear,
    };
  } catch (error: any) {
    console.error("Get placement season error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get default CGPA cutoff
 */
export async function getDefaultCGPACutoff(): Promise<{
  success: boolean;
  cutoff?: number;
  error?: string;
}> {
  try {
    const settings = await getSystemSettings();
    return {
      success: settings.success,
      cutoff: settings.data?.defaultCgpaCutoff,
    };
  } catch (error: any) {
    console.error("Get default CGPA cutoff error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate email domain against allowed list
 */
export async function validateEmailDomain(email: string): Promise<{
  success: boolean;
  valid?: boolean;
  error?: string;
}> {
  try {
    const settings = await getSystemSettings();

    if (!settings.success || !settings.data) {
      return { success: false, error: "Failed to get settings" };
    }

    const allowedDomains = settings.data.allowedDomains || [];
    if (allowedDomains.length === 0) {
      return { success: true, valid: true }; // No restrictions
    }

    const domain = email.split("@")[1];
    const isValid = allowedDomains.includes(domain);

    return { success: true, valid: isValid };
  } catch (error: any) {
    console.error("Validate email domain error:", error);
    return { success: false, error: error.message };
  }
}
