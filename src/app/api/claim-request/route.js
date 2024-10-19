import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendNotification } from "@/lib/notificationService";

const prisma = new PrismaClient();

// Fetch all claim requests with pagination, search, and filter
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

    const claimRequests = await prisma.claimRequest.findMany({
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
        claimRequestTreatments: {
          include: {
            treatment: true,
          },
        },
        claimRequestDrugs: {
          include: {
            drugs: true, // Include drug details
          },
        },
        hmo: true,
      },
    });

    const totalCount = await prisma.claimRequest.count({
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
      claimRequests: claimRequests,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching claim requests:", error);
    return NextResponse.json(
      { error: "Error fetching claim requests." },
      { status: 500 }
    );
  }
}

// Fetch a single claim request by ID
export async function GET_SINGLE(req) {
  const { id } = req.query;

  const claimRequest = await prisma.claimRequest.findUnique({
    where: { id: parseInt(id) },
    include: {
      diagnosis: true,
      claimRequestTreatments: {
        include: {
          treatments: true,
        },
      },
      claimRequestDrugs: {
        include: {
          drugs: true,
        },
      },
    },
  });

  if (!claimRequest) {
    return NextResponse.json(
      { error: "Claim request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(claimRequest);
}

// Create a new claim request
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
    dob,
    gender,
    company,
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
    const claimRequest = await prisma.claimRequest.create({
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
        dob,
        gender,
        company,
        diagnosis: {
          connect: diagnosis.map((id) => ({ id })), // Connect diagnoses
        },
        claimRequestTreatments: {
          create: treatments.map((treatmentId) => ({
            treatmentId,
          })),
        },
        claimRequestDrugs: {
          create: drugs.map((drug) => ({
            drugId: drug.drugId,
            quantity: drug.quantity,
          })),
        },
      },
    });

    // Create notification message
    const notificationMessage = `A new Claim request has been submitted by ${hospitalName} for policy number ${policyNo}.`;

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

    return NextResponse.json(claimRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating claim request." },
      { status: 500 }
    );
  }
}

// Update an claim request
// export async function PUT(req) {
//   const {
//     id,
//     diagnosis,
//     treatments,
//     claimRequestTreatments,
//     claimRequestDrugs,
//     hospitalId,
//     hmo,
//     responsedBy,
//     ...data
//   } = await req.json();

//   try {
//     const findClaimRequest = await prisma.claimRequest.findUnique({
//       where: { id: parseInt(id) },
//     });

//     const findHospital = await prisma.hospital.findUnique({
//       where: { id: hospitalId },
//       include: {
//         user: true,
//       },
//     });

//     const updatedRequest = await prisma.claimRequest.update({
//       where: { id: parseInt(id) },
//       data: {
//         ...data,
//         hospital: {
//           connect: { id: hospitalId }, // Explicitly connecting the relation
//         },
//         hmo: responsedBy
//           ? {
//               connect: { id: responsedBy }, // Connect to the HMO (for responsedBy)
//             }
//           : undefined,
//         diagnosis: diagnosis
//           ? {
//               set: diagnosis.map((d) => ({ id: d.id })),
//             }
//           : undefined,
//         claimRequestTreatments: claimRequestTreatments
//           ? {
//               deleteMany: {}, // Delete existing treatments before adding new ones
//               create: claimRequestTreatments.map((t) => ({
//                 treatmentId: t.treatmentId, // Add new treatments
//                 status: t.status, // If you want to store status for treatments
//               })),
//             }
//           : undefined,
//         claimRequestDrugs: {
//           deleteMany: {}, // Optional: Clear existing drugs before adding new ones
//           create: claimRequestDrugs.map((drug) => ({
//             drugId: drug.drugId,
//             quantity: drug.quantity,
//           })),
//         },
//       },
//     });

//     if (data.status === "ACCEPTED" && findClaimRequest.status === "PENDING") {
//       // Create notification message
//       const notificationMessage = `Claim request has been Accepted by HMO for policy number ${data.policyNo}.`;

//       // Send notifications
//       await sendNotification(findHospital.user.id, notificationMessage, "DB");
//       await sendNotification(
//         [
//           "mdmajedhasan01811@gmail.com",
//           "noreply@sterlinghealthhmo.com",
//           "Claims@sterlinghealthmcs.com",
//           "Claims@sterlinghealthhmo.com",
//         ],
//         notificationMessage,
//         "Email"
//       );
//     }

//     return NextResponse.json(updatedRequest);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Error updating claim request." },
//       { status: 500 }
//     );
//   }
// }

// Update a claim request
export async function PUT(req) {
  const {
    id,
    diagnosis,
    claimRequestTreatments,
    claimRequestDrugs,
    hospitalId,
    responsedBy,
    ...data
  } = await req.json();

  try {
    // Retrieve the existing claim request with necessary relations
    const findClaimRequest = await prisma.claimRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        diagnosis: true,
        claimRequestTreatments: {
          include: {
            treatment: true, // Include treatment details
          },
        },
        claimRequestDrugs: {
          include: {
            drugs: true, // Include drug details
          },
        },
        hmo: true,
      },
    });

    // Retrieve hospital details
    const findHospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: {
        user: true,
      },
    });

    // Initialize acceptedCost and rejectedCost
    let acceptedCost = 0;
    let rejectedCost = 0;

    // Process claimRequestTreatments and calculate costs
    for (const treatment of claimRequestTreatments) {
      // Find the existing treatment in the database
      const existingTreatment = findClaimRequest.claimRequestTreatments.find(
        (t) => t.id === treatment.id
      );

      if (existingTreatment) {
        if (
          treatment.status === "ACCEPTED" &&
          existingTreatment.status !== "ACCEPTED"
        ) {
          acceptedCost += existingTreatment.treatment.price; // Use treatment's price from existing treatment
        } else if (
          treatment.status === "REJECTED" &&
          existingTreatment.status !== "REJECTED"
        ) {
          rejectedCost += existingTreatment.treatment.price; // Use treatment's price from existing treatment
        }
      }
    }

    // Process claimRequestDrugs and calculate costs
    for (const drug of claimRequestDrugs) {
      // Find the existing drug in the database
      const existingDrug = findClaimRequest.claimRequestDrugs.find(
        (d) => d.id === drug.id
      );

      if (existingDrug) {
        // Handle accepted status: use acceptedQuantity for cost calculations
        if (drug.status === "ACCEPTED") {
          // Only add to accepted cost if the status has changed from a previous state
          if (existingDrug.status !== "ACCEPTED") {
            acceptedCost += existingDrug.drugs.price * drug.acceptedQuantity; // Use acceptedQuantity for cost calculations
          }

          // Check if some quantities were not accepted (remaining quantities are rejected)
          const remainingRejectedQuantity =
            drug.quantity - drug.acceptedQuantity;

          // If there are still quantities left to reject, calculate their cost
          if (remainingRejectedQuantity > 0) {
            rejectedCost +=
              existingDrug.drugs.price * remainingRejectedQuantity;
          }
        }

        // Handle rejected status: account for any quantities that were not accepted
        if (drug.status === "REJECTED") {
          const totalQuantity = drug.quantity; // Total quantity of the drug
          const acceptedQuantity = drug.acceptedQuantity || 0; // Quantity accepted so far

          // Calculate how many remain to be rejected (if any)
          const remainingQuantityToReject = totalQuantity - acceptedQuantity;

          if (remainingQuantityToReject > 0) {
            rejectedCost +=
              existingDrug.drugs.price * remainingQuantityToReject; // Use remaining quantity to calculate rejected cost
          }
        }
      }
    }

    // Update the claim request in the database
    await prisma.claimRequest.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        hospital: {
          connect: { id: hospitalId }, // Explicitly connect the hospital
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
        claimRequestTreatments: {
          deleteMany: {}, // Clear existing treatments before adding new ones
          create: claimRequestTreatments.map((t) => ({
            treatmentId: t.treatmentId, // Add new treatments
            status: t.status, // Store status for treatments
          })),
        },
        claimRequestDrugs: {
          deleteMany: {}, // Clear existing drugs before adding new ones
          create: claimRequestDrugs.map((drug) => ({
            drugId: drug.drugId,
            quantity: drug.quantity,
            status: drug.status,
            acceptedQuantity: parseFloat(drug.acceptedQuantity),
          })),
        },
        acceptedCost: findClaimRequest.acceptedCost + acceptedCost, // Update acceptedCost
        rejectedCost: findClaimRequest.rejectedCost + rejectedCost, // Update rejectedCost
      },
    });

    // Fetch the updated claim with all related data to return it in the response
    const updatedClaimRequest = await prisma.claimRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        diagnosis: true,
        claimRequestTreatments: {
          include: {
            treatment: true, // Include treatment details
          },
        },
        claimRequestDrugs: {
          include: {
            drugs: true, // Include drug details
          },
        },
        hmo: true,
        hospital: true, // Include hospital details
      },
    });

    // Check if the claim request has been accepted and notify if necessary
    if (data.status === "ACCEPTED" && findClaimRequest.status === "PENDING") {
      // Create notification message
      const notificationMessage = `Claim request has been Accepted by HMO for policy number ${data.policyNo}.`;

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

    return NextResponse.json(updatedClaimRequest);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating claim request." },
      { status: 500 }
    );
  }
}

// Delete an authorization request
export async function DELETE(req) {
  const { id } = req.query;

  try {
    await prisma.claimRequest.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({
      message: "Claim request deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting claim request." },
      { status: 500 }
    );
  }
}
