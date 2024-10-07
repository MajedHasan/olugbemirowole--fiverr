import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET method to fetch hospitals with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  const organisation = await prisma.organisation.findUnique({
    where: {
      userId: id,
    },
  });

  return NextResponse.json(organisation);
}
