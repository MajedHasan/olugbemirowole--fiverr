import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all treatments with pagination and search
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  const skip = (page - 1) * limit;
  const treatments = await prisma.treatment.findMany({
    where: {
      serviceName: {
        contains: search,
        // mode: "insensitive",
      },
    },
    skip: skip,
    take: limit,
    orderBy: { id: "asc" }, // Change order as needed
  });

  const totalCount = await prisma.treatment.count({
    where: {
      serviceName: {
        contains: search,
        // mode: "insensitive",
      },
    },
  });

  if (treatments.length === 0) {
    return NextResponse.json({ error: "No results found." }, { status: 404 });
  }

  return NextResponse.json({ treatments, totalCount });
}

// Fetch a single treatment by ID
export async function GET_SINGLE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  const treatment = await prisma.treatment.findUnique({
    where: { id },
  });

  if (!treatment) {
    return NextResponse.json({ error: "Treatment not found" }, { status: 404 });
  }

  return NextResponse.json(treatment);
}

// Create a new treatment
export async function POST(req) {
  const { serviceName, description, price } = await req.json();

  try {
    const treatment = await prisma.treatment.create({
      data: {
        serviceName,
        description,
        price,
      },
    });
    return NextResponse.json(treatment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating treatment." },
      { status: 500 }
    );
  }
}

// Update an existing treatment
export async function PUT(req) {
  const { id, serviceName, description, price } = await req.json();

  try {
    const updatedTreatment = await prisma.treatment.update({
      where: { id: parseInt(id) },
      data: { serviceName, description, price },
    });
    return NextResponse.json(updatedTreatment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating treatment." },
      { status: 500 }
    );
  }
}

// Delete a treatment
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  try {
    await prisma.treatment.delete({ where: { id } });
    return NextResponse.json({
      message: "Treatment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting treatment." },
      { status: 500 }
    );
  }
}
