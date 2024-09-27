import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET method to fetch payouts
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const payouts = await prisma.payout.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.payout.count();

  return NextResponse.json({ payouts, total });
}

// Add other methods like POST, PUT, DELETE for payouts if necessary
