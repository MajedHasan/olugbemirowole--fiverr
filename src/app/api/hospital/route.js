import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET method to fetch hospitals with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const hospitals = await prisma.hospital.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.hospital.count();

  return NextResponse.json({ hospitals, total });
}

// POST method to add a new hospital
export async function POST(req) {
  try {
    const { hospitalName, hospitalAddress, phoneNumber, email, userId } =
      await req.json();

    const newHospital = await prisma.hospital.create({
      data: {
        hospitalName,
        hospitalAddress,
        phoneNumber: phoneNumber.toString(), // Ensure phone number is a string
        email,
        userId: userId || null, // Set userId to null if not provided
      },
    });

    return NextResponse.json(newHospital, { status: 201 });
  } catch (error) {
    console.error("Error creating hospital:", error);
    return NextResponse.json(
      { error: "Failed to create hospital" },
      { status: 500 }
    );
  }
}

// PUT method to update an existing hospital
export async function PUT(req) {
  try {
    const { id, hospitalName, hospitalAddress, phoneNumber, email, userId } =
      await req.json();

    const updatedHospital = await prisma.hospital.update({
      where: { id },
      data: {
        hospitalName,
        hospitalAddress,
        phoneNumber: phoneNumber.toString(), // Ensure phone number is a string
        email,
        userId: userId || null, // Set userId to null if not provided
      },
    });

    return NextResponse.json(updatedHospital);
  } catch (error) {
    console.error("Error updating hospital:", error);
    return NextResponse.json(
      { error: "Failed to update hospital" },
      { status: 500 }
    );
  }
}

// DELETE method to remove a hospital
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.hospital.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Hospital deleted successfully" });
  } catch (error) {
    console.error("Error deleting hospital:", error);
    return NextResponse.json(
      { error: "Failed to delete hospital" },
      { status: 500 }
    );
  }
}
