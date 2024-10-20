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

    // Map the data from the sheet to your claim request format
    const claimRequestData = sheetData.map((row) => {
      // Collect treatments dynamically
      const treatments = [];
      let treatmentIndex = 1;
      while (row[`Treatment ${treatmentIndex}`]) {
        treatments.push(parseInt(row[`Treatment ${treatmentIndex}`], 10)); // Ensure treatment ID is an integer
        treatmentIndex++;
      }

      // Collect drugs dynamically
      const drugs = [];
      let drugIndex = 1;
      while (row[`Drug ${drugIndex} ID`]) {
        drugs.push({
          drugId: parseInt(row[`Drug ${drugIndex} ID`], 10), // Ensure drug ID is an integer
          quantity: parseFloat(row[`Drug ${drugIndex} Quantity`]),
        });
        drugIndex++;
      }

      // Collect diagnoses dynamically
      const diagnoses = [];
      let diagnosisIndex = 1;
      while (row[`Diagnosis ${diagnosisIndex}`]) {
        diagnoses.push(parseInt(row[`Diagnosis ${diagnosisIndex}`], 10)); // Ensure diagnosis ID is an integer
        diagnosisIndex++;
      }

      return {
        policyNo: row["Policy No."],
        healthPlan: row["Health Plan"],
        treatmentCost: parseFloat(row["Treatment Cost"]),
        receipt: row["Receipt"] || null,
        hospitalEmail: row["Hospital Email"],
        hospitalPhone: row["Hospital Phone"] || null,
        hospitalId: parseInt(row["Hospital ID"], 10), // Ensure hospital ID is an integer
        hospitalName: row["Hospital Name"],
        enrollee: row["Enrollee Name"],
        submiterId: parseInt(row["Submitter ID"], 10), // Ensure submitter ID is an integer
        submitedBy: row["Submitted By"],
        status: row["Status"] || "ACCEPTED",
        dob: row["Date of Birth"] ? row["Date of Birth"].toString() : null, // Ensure correct date format
        gender: row["Gender"] || null,
        company: row["Company"] || null,
        acceptedCost: parseFloat(row["Accepted Cost"] || 0),
        rejectedCost: parseFloat(row["Rejected Cost"] || 0),
        comment: row["Comment"] || null,
        treatments: treatments,
        drugs: drugs,
        diagnoses: diagnoses,
      };
    });

    // Bulk insert claim request data into the database
    for (const claimRequest of claimRequestData) {
      await prisma.claimRequest.create({
        data: {
          policyNo: claimRequest.policyNo,
          healthPlan: claimRequest.healthPlan,
          treatmentCost: claimRequest.treatmentCost,
          receipt: claimRequest.receipt,
          hospitalEmail: claimRequest.hospitalEmail,
          hospitalPhone: claimRequest.hospitalPhone,
          hospitalId: claimRequest.hospitalId,
          hospitalName: claimRequest.hospitalName,
          enrollee: claimRequest.enrollee,
          submiterId: claimRequest.submiterId,
          submitedBy: claimRequest.submitedBy,
          status: claimRequest.status.toUpperCase(),
          dob: claimRequest.dob,
          gender: claimRequest.gender,
          company: claimRequest.company,
          acceptedCost: claimRequest.acceptedCost,
          rejectedCost: claimRequest.rejectedCost,
          comment: claimRequest.comment,
          // Connect existing diagnoses (assumed to exist in DB)
          diagnosis: {
            connect:
              claimRequest.diagnoses.length > 0
                ? claimRequest.diagnoses.map((diagnosisId) => ({
                    id: diagnosisId, // Connecting diagnoses by ID
                  }))
                : undefined,
          },
          // Create related treatments if they exist
          claimRequestTreatments: {
            create:
              claimRequest.treatments.length > 0
                ? claimRequest.treatments.map((treatmentId) => ({
                    treatmentId: treatmentId, // Ensure treatmentId is an integer
                  }))
                : undefined,
          },
          // Create related drugs if they exist
          claimRequestDrugs: {
            create:
              claimRequest.drugs.length > 0
                ? claimRequest.drugs.map((drug) => ({
                    drugId: drug.drugId,
                    quantity: drug.quantity,
                  }))
                : undefined,
          },
        },
      });
    }

    return NextResponse.json({
      message: "Bulk claim requests uploaded successfully",
    });
  } catch (error) {
    console.error("Error processing the bulk upload:", error);
    return NextResponse.json(
      { error: "Failed to process claim requests bulk upload" },
      { status: 500 }
    );
  }
}
