import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" }, // Fetch most recent notifications first
  });
  return NextResponse.json(notifications);
}

// PATCH request for updating a notification
export async function PATCH(req) {
  const { id, isRead } = await req.json();

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id }, // The ID of the notification to be updated
      data: {
        isRead,
      },
    });

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Error updating notification." },
      { status: 500 }
    );
  }
}
