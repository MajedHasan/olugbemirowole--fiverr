import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const userId = searchParams.get("userId"); // Retrieve user ID if provided

  const skip = (page - 1) * limit;

  try {
    const whereConditions = {
      ...(userId ? { userId: parseInt(userId) } : {}), // Include userId condition if provided
      // Add more conditions if needed
    };

    const notifications = await prisma.notification.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" }, // Fetch most recent notifications first
    });

    const totalCount = await prisma.notification.count({
      where: whereConditions, // Use the same where conditions for counting
    });

    return NextResponse.json({ notifications, totalCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error getting notification." },
      { status: 500 }
    );
  }
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
