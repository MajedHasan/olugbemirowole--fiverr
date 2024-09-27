// src/app/api/enrollees/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
  const body = await req.json();
  // const {
  //   fullName,
  //   policyNo,
  //   company,
  //   planType,
  //   phoneNumber,
  //   status,
  //   hospital,
  //   noOfDependents,
  // } = body;

  const enrollee = await prisma.enrollee.create({
    data: {
      fullName: body.fullName,
      company: body.company,
      policyNo: body.policyNo,
      planType: body.planType,
      phoneNumber: body.phoneNumber,
      status: body.status,
      hospital: body.hospital,
      noOfDependents: parseInt(body.noOfDependents),
      dependents: {
        create: body.dependents.map((dep) => ({ name: dep })),
      },
    },
  });

  return NextResponse.json(enrollee);
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
export async function DELETE(req) {
  const { id } = await req.json();

  await prisma.enrollee.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Enrollee deleted successfully." });
}
