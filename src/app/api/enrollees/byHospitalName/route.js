import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET Enrollees by hospitalName with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hospitalName = searchParams.get("hospitalName"); // Get hospitalName from query params
  const page = parseInt(searchParams.get("page")) || 1; // Default to page 1 if not provided
  const limit = parseInt(searchParams.get("limit")) || 10; // Default to limit of 10 if not provided

  // Validate that hospitalName is provided and is a string
  if (!hospitalName || typeof hospitalName !== "string") {
    return new Response(
      JSON.stringify({ error: "Invalid or missing hospital name" }),
      {
        status: 400,
      }
    );
  }

  try {
    // Calculate skip and take for pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Query for enrollees based on hospitalName with pagination
    const [enrollees, totalEnrollees] = await Promise.all([
      prisma.enrollee.findMany({
        where: { hospital: hospitalName },
        include: { dependents: true },
        skip,
        take,
      }),
      prisma.enrollee.count({
        where: { hospital: hospitalName },
      }),
    ]);

    // If no enrollees are found, return a message
    if (enrollees.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No enrollees found for the given hospital name",
        }),
        {
          status: 200,
        }
      );
    }

    // Return paginated response
    return new Response(
      JSON.stringify({
        enrollees,
        meta: {
          totalEnrollees,
          currentPage: page,
          totalPages: Math.ceil(totalEnrollees / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enrollees:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch enrollee data" }),
      { status: 500 }
    );
  }
}
