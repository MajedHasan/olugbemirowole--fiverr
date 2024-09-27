import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json(); // Parse the request body
  const { email, password, role } = body;

  // Basic validation
  if (!email || !password || !role) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  // Ensure role is valid
  const validRoles = ["ENROLLEES", "HOSPITAL", "ORGANISATION", "HMO"];
  if (!validRoles.includes(role)) {
    return new Response(JSON.stringify({ message: "Invalid role" }), {
      status: 400,
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role, // Store the role from the request
      },
    });

    return new Response(JSON.stringify({ message: "User created", user }), {
      status: 201,
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
