// /pages/api/auth/signup.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, role } = req.body;

  // Basic validation
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Ensure role is valid
  const validRoles = ["ENROLLEES", "HOSPITAL", "ORGANISATION", "HMO"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
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

    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Sign-up error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
