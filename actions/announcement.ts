// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createAnnouncement(title: string, message: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        createdByAdminId: session.id,
      },
    });

    return { success: true, data: announcement };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, error: "Failed to create announcement" };
  }
}

export async function updateAnnouncement(
  announcementId: string,
  title: string,
  message: string,
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcement.update({
      where: { id: announcementId },
      data: { title, message },
    });

    return { success: true, data: announcement };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { success: false, error: "Failed to update announcement" };
  }
}

export async function deleteAnnouncement(announcementId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, error: "Failed to delete announcement" };
  }
}

export async function getAnnouncements() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: announcements };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return { success: false, error: "Failed to fetch announcements" };
  }
}

export async function getAnnouncementById(announcementId: string) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      return { success: false, error: "Announcement not found" };
    }

    return { success: true, data: announcement };
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return { success: false, error: "Failed to fetch announcement" };
  }
}
