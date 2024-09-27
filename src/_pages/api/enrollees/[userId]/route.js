import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Handling GET and PUT in one exported default function
export default async function handler(req, { params }) {
  const userId = parseInt(params.userId);

  if (req.method === "GET") {
    try {
      const enrollee = await prisma.enrollee.findUnique({
        where: { userId: userId },
        include: { dependents: true },
      });

      if (!enrollee) {
        return new Response(JSON.stringify({ error: "Enrollee not found" }), {
          status: 404,
        });
      }

      return new Response(JSON.stringify(enrollee), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch enrollee data" }),
        { status: 500 }
      );
    }
  }

  if (req.method === "PUT") {
    const data = await req.json();

    try {
      const updatedEnrollee = await prisma.enrollee.update({
        where: { userId: userId },
        data: {
          fullName: data.fullName,
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

      return new Response(JSON.stringify(updatedEnrollee), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Failed to update enrollee data" }),
        { status: 500 }
      );
    }
  }

  // If the method is not GET or PUT, return 405
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
  });
}
