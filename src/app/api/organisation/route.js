import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// GET method to fetch organisations with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const organisations = await prisma.organisation.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.organisation.count();

  return NextResponse.json({ organisations: organisations, total });
}

// POST method to add a new organisation
export async function POST(req) {
  try {
    const {
      companyName,
      companyID,
      phoneNumber,
      email,
      clientServiceOfficer,
      userId,
    } = await req.json();

    const role = "ORGANISATION";
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
      // Create new Organisation
      const newOrganisation = await prisma.organisation.create({
        data: {
          companyName,
          companyID,
          phoneNumber: phoneNumber.toString(), // Ensure phone number is a string
          email,
          clientServiceOfficer,
          userId: user.id,
        },
      });

      return NextResponse.json(newOrganisation);
    }
  } catch (error) {
    console.error("Error creating organisation:", error);
    return NextResponse.json(
      { error: "Failed to create organisation" },
      { status: 500 }
    );
  }
}

// PUT method to update an existing organisation
export async function PUT(req) {
  try {
    const {
      id,
      companyName,
      companyID,
      phoneNumber,
      email,
      clientServiceOfficer,
      userId,
    } = await req.json();

    const updatedOrganisation = await prisma.organisation.update({
      where: { id },
      data: {
        companyName,
        companyID,
        phoneNumber: phoneNumber.toString(), // Ensure phone number is a string
        email,
        clientServiceOfficer,
        userId: userId || null, // Set userId to null if not provided
      },
    });

    return NextResponse.json(updatedOrganisation);
  } catch (error) {
    console.error("Error updating organisation:", error);
    return NextResponse.json(
      { error: "Failed to update organisation" },
      { status: 500 }
    );
  }
}

// DELETE method to remove a organisation
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // Retrieve the hospital to get the associated userId
    const organisation = await prisma.organisation.findUnique({
      where: { id },
      select: { userId: true }, // Only select userId
    });

    if (!organisation) {
      return NextResponse.json(
        { error: "Hospital not found." },
        { status: 404 }
      );
    }

    // Delete any treatment request records (if applicable)
    // await prisma.treatmentRequest.deleteMany({
    //   where: { hospitalId: id }, // Assuming Dependent has an hospitalId field
    // });

    await prisma.organisation.delete({
      where: { id },
    });

    // Delete the associated user
    if (organisation.userId) {
      await prisma.user.delete({
        where: { id: organisation.userId },
      });
    }

    return NextResponse.json({ message: "Organisation deleted successfully" });
  } catch (error) {
    console.error("Error deleting organisation:", error);
    return NextResponse.json(
      { error: "Failed to delete organisation" },
      { status: 500 }
    );
  }
}
