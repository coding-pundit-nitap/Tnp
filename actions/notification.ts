// @ts-nocheck
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getNotifications() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return { success: true, data: notification };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.id,
        read: false,
      },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function getUnreadCount() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized", data: 0 };
    }

    const count = await prisma.notification.count({
      where: {
        userId: session.id,
        read: false,
      },
    });

    return { success: true, data: count };
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return { success: false, error: "Failed to count", data: 0 };
  }
}
