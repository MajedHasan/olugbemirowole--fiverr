import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendNotification } from "@/lib/notificationService";

const prisma = new PrismaClient();

// Fetch all treatment requests with pagination, search, and filter
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  const skip = (page - 1) * limit;
  const treatmentRequests = await prisma.treatmentRequest.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              enrollee: {
                contains: search,
                //  mode: "insensitive"
              },
            },
            {
              hospitalName: {
                contains: search,
                // mode: "insensitive"
              },
            },
          ],
        },
        {
          // Add additional filters here if needed
        },
      ],
    },
    skip: skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      diagnoses: true, // Include associated diagnoses
      treatments: true, // Include associated treatments
    },
  });

  const totalCount = await prisma.treatmentRequest.count({
    where: {
      AND: [
        {
          OR: [
            {
              enrollee: {
                contains: search,
                // mode: "insensitive"
              },
            },
            {
              hospitalName: {
                contains: search,
                // mode: "insensitive"
              },
            },
          ],
        },
        {
          // Add additional filters here if needed
        },
      ],
    },
  });

  return NextResponse.json({ treatmentRequests, totalCount });
}

// Fetch a single treatment request by ID
export async function GET_SINGLE(req) {
  const { id } = req.query;
  const treatmentRequest = await prisma.treatmentRequest.findUnique({
    where: { id: parseInt(id) },
    include: {
      diagnoses: true, // Include associated diagnoses
      treatments: true, // Include associated treatments
    },
  });

  if (!treatmentRequest) {
    return NextResponse.json(
      { error: "Treatment request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(treatmentRequest);
}

// Create a new treatment request
export async function POST(req) {
  const {
    hospitalId,
    // enrolleeId,
    enrollee,
    policyNo,
    healthPlan,
    // diagnosisIds, // Use IDs of diagnoses
    diagnosis, // Use IDs of diagnoses
    treatmentCost,
    receipt,
    hospitalName,
    hospitalEmail,
    hospitalPhone,
    // treatmentIds, // Use IDs of treatments
    treatments, // Use IDs of treatments
    status = "PENDING",
  } = await req.json();
  const adminUserId = 1; // Replace with actual admin user ID logic

  try {
    const treatmentRequest = await prisma.treatmentRequest.create({
      data: {
        hospitalId,
        enrollee, // Set enrollee ID directly
        policyNo,
        healthPlan,
        treatmentCost,
        receipt,
        hospitalName,
        hospitalEmail,
        hospitalPhone,
        status,
        diagnoses: {
          connect: diagnosis.map((id) => ({ id })), // Connect diagnoses
        },
        treatments: {
          connect: treatments.map((id) => ({ id })), // Connect treatments
        },
      },
    });

    // Create notification message
    const notificationMessage = `A new treatment request has been submitted by ${hospitalName} for policy number ${policyNo}.`;

    // Send notifications
    await sendNotification(adminUserId, notificationMessage, "DB");
    await sendNotification(
      [
        "mdmajedhasan01811@gmail.com",
        "noreply@sterlinghealthhmo.com",
        "Claims@sterlinghealthmcs.com",
        "Claims@sterlinghealthhmo.com",
      ],
      notificationMessage,
      "Email"
    );
    // await sendNotification("+2348034586746", notificationMessage, "SMS");

    return NextResponse.json(treatmentRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating treatment request." },
      { status: 500 }
    );
  }
}

// Update a treatment request
export async function PUT(req) {
  const { id, ...data } = await req.json();

  try {
    const findTreatmentRequest = await prisma.treatmentRequest.findUnique({
      where: { id: parseInt(id) },
    });

    const findHospital = await prisma.hospital.findUnique({
      where: { id: data.hospitalId },
      include: {
        user: true,
      },
    });

    const updatedRequest = await prisma.treatmentRequest.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        diagnoses: data.diagnosisIds
          ? {
              set: data.diagnosisIds.map((id) => ({ id })),
            }
          : undefined, // Update diagnoses if provided
        treatments: data.treatmentIds
          ? {
              set: data.treatmentIds.map((id) => ({ id })),
            }
          : undefined, // Update treatments if provided
      },
    });

    if (
      data.status === "ACCEPTED" &&
      findTreatmentRequest.status === "PENDING"
    ) {
      // Create notification message
      const notificationMessage = `Treatment request has been Accepted by HMO for policy number ${data.policyNo}.`;

      // Send notifications
      await sendNotification(findHospital.user.id, notificationMessage, "DB");
      await sendNotification(
        [
          "mdmajedhasan01811@gmail.com",
          "noreply@sterlinghealthhmo.com",
          "Claims@sterlinghealthmcs.com",
          "Claims@sterlinghealthhmo.com",
        ],
        notificationMessage,
        "Email"
      );
      // await sendNotification("+2348034586746", notificationMessage, "SMS");
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating treatment request." },
      { status: 500 }
    );
  }
}

// Delete a treatment request
export async function DELETE(req) {
  const { id } = req.query;

  try {
    await prisma.treatmentRequest.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({
      message: "Treatment request deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting treatment request." },
      { status: 500 }
    );
  }
}
