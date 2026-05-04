/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db/db-connection";
import { MedicalFormSchema } from "@/lib/validations/schema";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { diagnosis, proceduresDone, treatmentPlan, chiefComplaint } =
      await request.json();

    const validation = MedicalFormSchema.safeParse({
      diagnosis,
      proceduresDone,
      treatmentPlan,
      chiefComplaint,
    });

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "visit not defined" }, { status: 404 });
    }

    const existingVisit = await prisma.visit.findUnique({
      where: { id, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "visit not found" }, { status: 404 });
    }

    
    await prisma.visit.update({
      where: { id },
      data: {
        diagnosis :diagnosis|| '',
        proceduresDone:proceduresDone||'',
        treatmentPlan:treatmentPlan||'',
        chiefComplaint:chiefComplaint||'',
      },
    });

    return NextResponse.json({
      success: true,
      message: "visit form created successfully",
    });
  } catch (error: any) {
    console.error("Error update visit form:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update patient" },
      { status: 500 },
    );
  }
}
