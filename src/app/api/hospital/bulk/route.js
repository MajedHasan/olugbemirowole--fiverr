import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

const prisma = new PrismaClient();

// This helper function converts a File into a Buffer
const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export async function POST(req) {
  try {
    // Parse the form data from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Convert the file stream into a buffer
    const buffer = await streamToBuffer(file.stream());

    // Parse the Excel file using xlsx
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map the data from the sheet to your hospital format
    const hospitalsData = sheetData.map((row) => ({
      hospitalName: row["Hospital Name"],
      hospitalAddress: row["Hospital Address"],
      phoneNumber: row["Phone Number"],
      email: row["Email"],
    }));

    const hospitals = hospitalsData.map((hospital) => ({
      ...hospital,
      phoneNumber: hospital.phoneNumber.toString(), // Convert phone number to string
    }));

    // Insert hospitals data into the database
    await prisma.hospital.createMany({
      data: hospitals,
    });

    return NextResponse.json({ message: "Bulk upload successful" });
  } catch (error) {
    console.error("Error processing the bulk upload:", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    );
  }
}
