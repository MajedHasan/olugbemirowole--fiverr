import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { loginIdentifier, password } = body;

  // return new Response(JSON.stringify({ body }));

  if (!loginIdentifier || !password) {
    return new Response(
      JSON.stringify({ message: "Login identifier and password are required" }),
      { status: 400 }
    );
  }

  try {
    // Attempt to find user by email
    let user = await prisma.user.findUnique({
      where: { email: loginIdentifier },
    });

    // If not found, check enrollee by policyNo
    if (!user) {
      const enrollee = await prisma.enrollee.findFirst({
        where: { policyNo: loginIdentifier },
        include: { user: true }, // To get the associated user
      });

      if (enrollee && enrollee.user) {
        user = enrollee.user; // Set user to the associated user
      }
    }

    // If not found, check enrollee by phone number
    if (!user) {
      const enrollee = await prisma.enrollee.findFirst({
        where: { phoneNumber: loginIdentifier },
        include: { user: true }, // To get the associated user
      });

      if (enrollee && enrollee.user) {
        user = enrollee.user; // Set user to the associated user
      }
    }

    // If still not found, check hospital, organisation, or hmo
    if (!user) {
      const hospital = await prisma.hospital.findFirst({
        where: { phoneNumber: loginIdentifier },
        include: { user: true },
      });
      if (hospital && hospital.user) {
        user = hospital.user;
      }

      if (!user) {
        const organisation = await prisma.organisation.findFirst({
          where: { phoneNumber: loginIdentifier },
          include: { user: true },
        });
        if (organisation && organisation.user) {
          user = organisation.user;
        }
      }

      if (!user) {
        const hmo = await prisma.hMO.findFirst({
          where: { phoneNumber: loginIdentifier },
          include: { user: true },
        });
        if (hmo && hmo.user) {
          user = hmo.user;
        }
      }
    }

    // If user is found, verify the password
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return new Response(
          JSON.stringify({ message: "Login successful", data: user }),
          { status: 200 }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "Invalid login credentials" }),
      { status: 401 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
