// src/app/api/enrollees/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const enrollees = await prisma.enrollee.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.enrollee.count();

  return NextResponse.json({ enrollees, total });
}

// Create a single enrollee
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      policyNo,
      company,
      planType,
      phoneNumber,
      status,
      hospital,
      noOfDependents,
      dependents = [], // Default to an empty array if not provided
    } = body;

    // Validate required fields
    if (!fullName || !policyNo || !phoneNumber || !company || !planType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
      // Create new enrollee
      const enrollee = await prisma.enrollee.create({
        data: {
          fullName,
          company,
          policyNo,
          planType,
          phoneNumber,
          status,
          hospital,
          noOfDependents: parseInt(noOfDependents, 10) || 0, // Default to 0 if conversion fails
          dependents: {
            create: dependents.map((dep) => ({ name: dep })),
          },
          userId: user.id, // Associate enrollee with the user
        },
      });

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
