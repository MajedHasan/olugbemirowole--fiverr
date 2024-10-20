// src/app/api/enrollees/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  // Fetching parameters from the URL
  const pageParam = parseInt(searchParams.get("page"), 10);
  const limitParam = parseInt(searchParams.get("limit"), 10);

  // Validate parameters
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam; // Default to 1 if not a positive integer
  const limit = isNaN(limitParam) || limitParam < 1 ? 10 : limitParam; // Default to 10 if not a positive integer

  // Calculate skip safely
  const skip = (page - 1) * limit;

  const enrollees = await prisma.enrollee.findMany({
    skip,
    take: limit,
  });

  const total = await prisma.enrollee.count();

  return NextResponse.json({ enrollees, total });
}
// Function to generate a random policyNo
function generatePolicyNo() {
  return `SH/${Math.floor(100000 + Math.random() * 900000)}`;
}

// Function to ensure enrollee creation with a unique policyNo
async function createEnrolleeWithUniquePolicyNo(data) {
  let enrollee;

  while (!enrollee) {
    try {
      // Attempt to create the enrollee
      enrollee = await prisma.enrollee.create({
        data,
      });
    } catch (error) {
      // Check if the error is due to a unique constraint violation on policyNo
      if (error.code === "P2002" && error.meta?.target?.includes("policyNo")) {
        // Generate a new policyNo and retry
        data.policyNo = generatePolicyNo();
      } else {
        // If it's any other error, throw it
        throw error;
      }
    }
  }

  return enrollee;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      policyNo, // This could be undefined
      company,
      planType,
      phoneNumber,
      status,
      hospital,
      noOfDependents,
      dependents = [], // Default to an empty array if not provided
    } = body;

    // Validate required fields (omit policyNo in validation)
    if (!fullName || !phoneNumber || !company || !planType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a policyNo if it's not provided
    const finalPolicyNo = policyNo || generatePolicyNo();

    const role = "ENROLLEES";
    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        role, // Store the role
      },
    });

    if (user) {
      // Prepare enrollee data
      const enrolleeData = {
        fullName,
        company,
        policyNo: finalPolicyNo, // Use the generated policy number or the one provided
        planType,
        phoneNumber,
        status,
        hospital,
        noOfDependents: parseInt(noOfDependents, 10) || 0, // Default to 0 if conversion fails
        dependents: {
          create: dependents.map((dep) => ({ name: dep })),
        },
        userId: user.id, // Associate enrollee with the user
      };

      // Try to create the enrollee, continuously retrying if a unique constraint error occurs
      const enrollee = await createEnrolleeWithUniquePolicyNo(enrolleeData);

      return NextResponse.json(enrollee);
    }
  } catch (error) {
    console.error("Error creating enrollee:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update a single enrollee
export async function PUT(req) {
  const { id, ...data } = await req.json();

  const updatedEnrollee = await prisma.enrollee.update({
    where: { id: id },
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

  return NextResponse.json(updatedEnrollee);
}

// Delete a single enrollee
// export async function DELETE(req) {
//   const { id } = await req.json();

//   await prisma.enrollee.delete({
//     where: { id },
//   });

//   return NextResponse.json({ message: "Enrollee deleted successfully." });
// }

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // Retrieve the enrollee to get the associated userId
    const enrollee = await prisma.enrollee.findUnique({
      where: { id },
      select: { userId: true }, // Only select userId
    });

    if (!enrollee) {
      return NextResponse.json(
        { error: "Enrollee not found." },
        { status: 404 }
      );
    }

    // Delete any dependent records (if applicable)
    await prisma.dependent.deleteMany({
      where: { enrolleeId: id }, // Assuming Dependent has an enrolleeId field
    });

    // Delete the enrollee
    await prisma.enrollee.delete({
      where: { id },
    });

    // Delete the associated user
    if (enrollee.userId) {
      await prisma.user.delete({
        where: { id: enrollee.userId },
      });
    }

    return NextResponse.json({
      message: "Enrollee and associated user deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting enrollee:", error);
    return NextResponse.json(
      { error: "Failed to delete enrollee." },
      { status: 500 }
    );
  }
}
