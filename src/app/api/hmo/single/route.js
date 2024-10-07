import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET method to fetch HMO with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  const hmo = await prisma.hMO.findUnique({
    where: {
      userId: parseInt(id),
    },
  });

  return NextResponse.json(hmo);
}
