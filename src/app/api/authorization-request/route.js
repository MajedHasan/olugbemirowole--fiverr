import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendNotification } from "@/lib/notificationService";

const prisma = new PrismaClient();

// Fetch all authorization requests with pagination, search, and filter
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");

  const skip = (page - 1) * limit;

  try {
    let hospitalId;

    // If userId is provided, fetch the hospital associated with that user
    if (userId) {
      const hospital = await prisma.hospital.findUnique({
        where: { userId: parseInt(userId) },
        select: { id: true },
      });

      hospitalId = hospital ? hospital.id : null;
    }

    const authorizationRequests = await prisma.authorizationRequest.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                enrollee: {
                  contains: search,
                },
              },
              {
                hospitalName: {
                  contains: search,
                },
              },
            ],
          },
          ...(status ? [{ status }] : []),
          ...(hospitalId ? [{ hospitalId }] : []),
        ],
      },
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: {
        diagnosis: true,
        treatments: true,
        authorizationRequestDrugs: {
          include: {
            drugs: true, // Include drug details
          },
        },
        hmo: true,
      },
    });

    const totalCount = await prisma.authorizationRequest.count({
      where: {
        AND: [
          {
            OR: [
              {
                enrollee: {
                  contains: search,
                },
              },
              {
                hospitalName: {
                  contains: search,
                },
              },
            ],
          },
          ...(status ? [{ status }] : []),
          ...(hospitalId ? [{ hospitalId }] : []),
        ],
      },
    });

    return NextResponse.json({
      authorizationRequests,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching authorization requests:", error);
    return NextResponse.json(
      { error: "Error fetching authorization requests." },
      { status: 500 }
    );
  }
}

// Fetch a single authorization request by ID
export async function GET_SINGLE(req) {
  const { id } = req.query;

  const authorizationRequest = await prisma.authorizationRequest.findUnique({
    where: { id: parseInt(id) },
    include: {
      diagnosis: true,
      treatments: true,
      authorizationRequestDrugs: {
        include: {
          drugs: true,
        },
      },
    },
  });

  if (!authorizationRequest) {
    return NextResponse.json(
      { error: "Authorization request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(authorizationRequest);
}

// Create a new authorization request
export async function POST(req) {
  const {
    hospitalId,
    enrollee,
    policyNo,
    healthPlan,
    treatmentCost,
    receipt,
    hospitalName,
    hospitalEmail,
    hospitalPhone,
    submitedBy,
    submiterId,
    diagnosis, // Array of diagnosis IDs
    treatments, // Array of treatment IDs
    drugs, // Array of drugs with { drugId, quantity }
    status = "PENDING",
  } = await req.json();

  // return NextResponse.json(
  //   {
  //     hospitalId,
  //     enrollee,
  //     policyNo,
  //     healthPlan,
  //     treatmentCost,
  //     receipt,
  //     hospitalName,
  //     hospitalEmail,
  //     hospitalPhone,
  //     diagnosis,
  //     treatments,
  //     drugs,
  //     status,
  //   },
  //   { status: 201 }
  // );

  const findHospital = await prisma.hospital.findUnique({
    where: { id: hospitalId },
    include: {
      user: true,
    },
  });

  try {
    const authorizationRequest = await prisma.authorizationRequest.create({
      data: {
        hospitalId,
        enrollee,
        policyNo,
        healthPlan,
        treatmentCost,
        receipt,
        hospitalName,
        hospitalEmail,
        hospitalPhone,
        submitedBy,
        submiterId,
        status,
        diagnosis: {
          connect: diagnosis.map((id) => ({ id })), // Connect diagnoses
        },
        treatments: {
          connect: treatments.map((id) => ({ id })), // Connect treatments
        },
        authorizationRequestDrugs: {
          create: drugs.map((drug) => ({
            drugId: drug.drugId,
            quantity: drug.quantity,
          })),
        },
      },
    });

    // Create notification message
    const notificationMessage = `A new Authorization request has been submitted by ${hospitalName} for policy number ${policyNo}.`;

    // Send notifications
    await sendNotification(findHospital?.user?.id, notificationMessage, "DB");
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

    return NextResponse.json(authorizationRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating authorization request." },
      { status: 500 }
    );
  }
}

// Update an authorization request
export async function PUT(req) {
  const {
    id,
    diagnosis,
    treatments,
    authorizationRequestDrugs,
    hospitalId,
    hmo,
    responsedBy,
    ...data
  } = await req.json();

  try {
    const findAuthorizationRequest =
      await prisma.authorizationRequest.findUnique({
        where: { id: parseInt(id) },
      });

    const findHospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: {
        user: true,
      },
    });

    const updatedRequest = await prisma.authorizationRequest.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        hospital: {
          connect: { id: hospitalId }, // Explicitly connecting the relation
        },
        hmo: responsedBy
          ? {
              connect: { id: responsedBy }, // Connect to the HMO (for responsedBy)
            }
          : undefined,
        diagnosis: diagnosis
          ? {
              set: diagnosis.map((d) => ({ id: d.id })),
            }
          : undefined,
        treatments: treatments
          ? {
              set: treatments.map((t) => ({ id: t.id })),
            }
          : undefined,
        authorizationRequestDrugs: {
          deleteMany: {}, // Optional: Clear existing drugs before adding new ones
          create: authorizationRequestDrugs.map((drug) => ({
            drugId: drug.drugId,
            quantity: drug.quantity,
          })),
        },
      },
    });

    if (
      data.status === "ACCEPTED" &&
      findAuthorizationRequest.status === "PENDING"
    ) {
      // Create notification message
      const notificationMessage = `Authorization request has been Accepted by HMO for policy number ${data.policyNo}.`;

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
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating authorization request." },
      { status: 500 }
    );
  }
}

// Delete an authorization request
export async function DELETE(req) {
  const { id } = req.query;

  try {
    await prisma.authorizationRequest.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({
      message: "Authorization request deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting authorization request." },
      { status: 500 }
    );
  }
}
