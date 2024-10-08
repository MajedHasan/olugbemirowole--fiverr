import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all drugs with pagination and search
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const isApprovalRequiredParam = searchParams.get("isApprovalRequired"); // Get the parameter as a string
  const isApprovalRequired = isApprovalRequiredParam
    ? isApprovalRequiredParam === "true"
    : undefined; // Convert to boolean or undefined
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  const skip = (page - 1) * limit;
  const drugs = await prisma.drugs.findMany({
    where: {
      name: {
        contains: search,
        // mode: "insensitive",
      },
      ...(isApprovalRequired !== undefined && { isApprovalRequired }), // Conditionally add this filter if isApprovalRequired is defined
    },
    skip: skip,
    take: limit,
    orderBy: { id: "asc" }, // Change order as needed
  });

  const totalCount = await prisma.drugs.count({
    where: {
      name: {
        contains: search,
        // mode: "insensitive",
      },
      ...(isApprovalRequired !== undefined && { isApprovalRequired }), // Conditionally add this filter if isApprovalRequired is defined
    },
  });

  if (drugs.length === 0) {
    return NextResponse.json({ error: "No results found." }, { status: 404 });
  }

  return NextResponse.json({ drugs: drugs, totalCount });
}

// Fetch a single drug by ID
export async function GET_SINGLE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  const drug = await prisma.drugs.findUnique({
    where: { id },
  });

  if (!drug) {
    return NextResponse.json({ error: "Drug not found" }, { status: 404 });
  }

  return NextResponse.json(drug);
}

// Create a new Drug
export async function POST(req) {
  const { name, description, price, isApprovalRequired, group } =
    await req.json();

  try {
    const drug = await prisma.drugs.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        isApprovalRequired,
        group,
      },
    });
    return NextResponse.json(drug, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating drug." },
      { status: 500 }
    );
  }
}

// Update an existing drug
export async function PUT(req) {
  const { id, name, description, price, isApprovalRequired, group } =
    await req.json();

  try {
    const updatedDrug = await prisma.drugs.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        isApprovalRequired,
        group,
      },
    });
    return NextResponse.json(updatedDrug);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating drug." },
      { status: 500 }
    );
  }
}

// Delete a drug
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  try {
    await prisma.drugs.delete({ where: { id } });
    return NextResponse.json({
      message: "Drug deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting drug." },
      { status: 500 }
    );
  }
}
