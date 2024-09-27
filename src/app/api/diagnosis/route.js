import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all diagnoses with pagination and search
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  const skip = (page - 1) * limit;
  const diagnoses = await prisma.diagnosis.findMany({
    where: {
      description: {
        contains: search,
        // mode: "insensitive",
      },
    },
    skip: skip,
    take: limit,
    orderBy: { id: "asc" }, // Change order as needed
  });

  const totalCount = await prisma.diagnosis.count({
    where: {
      description: {
        contains: search,
        // mode: "insensitive",
      },
    },
  });

  if (diagnoses.length === 0) {
    return NextResponse.json({ error: "No results found." }, { status: 404 });
  }

  return NextResponse.json({ diagnoses, totalCount });
}

// Fetch a single diagnosis by ID
export async function GET_SINGLE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id },
  });

  if (!diagnosis) {
    return NextResponse.json({ error: "Diagnosis not found" }, { status: 404 });
  }

  return NextResponse.json(diagnosis);
}

// Create a new diagnosis
export async function POST(req) {
  const { code, name, description } = await req.json();

  try {
    const diagnosis = await prisma.diagnosis.create({
      data: {
        code,
        name,
        description,
      },
    });
    return NextResponse.json(diagnosis, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating diagnosis." },
      { status: 500 }
    );
  }
}

// Update an existing diagnosis
export async function PUT(req) {
  const { id, code, name, description } = await req.json();

  try {
    const updatedDiagnosis = await prisma.diagnosis.update({
      where: { id: parseInt(id) },
      data: { code, name, description },
    });
    return NextResponse.json(updatedDiagnosis);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating diagnosis." },
      { status: 500 }
    );
  }
}

// Delete a diagnosis
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  try {
    await prisma.diagnosis.delete({ where: { id } });
    return NextResponse.json({
      message: "Diagnosis deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting diagnosis." },
      { status: 500 }
    );
  }
}
