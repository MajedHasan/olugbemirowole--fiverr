import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET Enrollee by userId
export async function GET(req, { params }) {
  const userId = parseInt(params.userId);

  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), {
      status: 400,
    });
  }

  try {
    const enrollee = await prisma.enrollee.findUnique({
      where: { userId: userId },
      include: { dependents: true },
    });

    // If no enrollee is found, return a message
    if (!enrollee) {
      return new Response(
        JSON.stringify({ message: "No enrollee data found" }),
        {
          status: 200,
        }
      );
    }

    return new Response(JSON.stringify(enrollee), { status: 200 });
  } catch (error) {
    console.error("Error fetching enrollee:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch enrollee data" }),
      { status: 500 }
    );
  }
}

// PUT to update or create enrollee information and dependents by userId
export async function PUT(req, { params }) {
  const userId = parseInt(params.userId);

  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), {
      status: 400,
    });
  }

  const data = await req.json();

  try {
    // Check if the enrollee already exists
    const existingEnrollee = await prisma.enrollee.findUnique({
      where: { userId: userId },
    });

    let updatedEnrollee;
    if (existingEnrollee) {
      // Update existing enrollee
      updatedEnrollee = await prisma.enrollee.update({
        where: { userId: userId },
        data: {
          fullName: data.fullName,
          policyNo: data.policyNo,
          company: data.company,
          planType: data.planType,
          phoneNumber: data.phoneNumber,
          status: data.status,
          hospital: data.hospital,
          noOfDependents: parseInt(data.noOfDependents),
        },
      });

      // Update dependents (delete old ones and create new ones)
      await prisma.dependent.deleteMany({
        where: { enrolleeId: updatedEnrollee.id },
      });

      if (Array.isArray(data.dependents)) {
        await prisma.dependent.createMany({
          data: data.dependents.map((dep) => ({
            name: dep,
            enrolleeId: updatedEnrollee.id,
          })),
        });
      }
    } else {
      // Create new enrollee if it doesn't exist
      updatedEnrollee = await prisma.enrollee.create({
        data: {
          userId: userId,
          fullName: data.fullName,
          policyNo: data.policyNo,
          company: data.company,
          planType: data.planType,
          phoneNumber: data.phoneNumber,
          status: data.status,
          hospital: data.hospital,
          noOfDependents: parseInt(data.noOfDependents),
          dependents: {
            create: data.dependents.map((dep) => ({ name: dep })),
          },
        },
      });
    }

    return new Response(JSON.stringify(updatedEnrollee), { status: 200 });
  } catch (error) {
    console.error("Error updating enrollee:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update enrollee data" }),
      { status: 500 }
    );
  }
}
