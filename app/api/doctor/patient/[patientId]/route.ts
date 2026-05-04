/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db/db-connection";
import { PatientFormSchema } from "@/lib/validations/schema";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> },
) {
  try {
    const { patientId:id } = await params;
    const { allergies, medications, notes } = await request.json();

    const validation = PatientFormSchema.safeParse({
      allergies,
      medications,
      notes,
    });

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "patient data not defined" },
        { status: 404 },
      );
    }

    const existing = await prisma.patient.findUnique({
      where: { id, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
    });

    
    if (!existing) {
      return NextResponse.json({ error: "visit not found" }, { status: 404 });
    }

    await prisma.patient.update({
      where: { id },
      data: {
        allergies: allergies || "",
        medications: medications || "",
        notes: notes || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "patient form created successfully",
    });
  } catch (error: any) {
    console.error("Error update patient form:", error);
    return NextResponse.json(
      { error: error.message || "Failed to udpate patient " },
      { status: 500 },
    );
  }
}
