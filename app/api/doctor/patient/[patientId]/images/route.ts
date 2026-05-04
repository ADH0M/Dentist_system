/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db/db-connection";
import { NextResponse } from "next/server";

// GET - Fetch all images for a patient
export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> },
) {
  try {
    const { patientId } = await params;

    const images = await prisma.radiologyImage.findMany({
      where: {
        patientId,
        OR:[{deletedAt: null,} , {deletedAt:{isSet:false}}],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

// POST - Create new image
export async function POST(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> },
) {
  try {
    const { patientId } = await params;
    const body = await request.json();
    const { url, type, description, toothNumber, uploadedById } = body;


    // Validate required fields
    if (!url || !patientId || !uploadedById) {
      return NextResponse.json(
        { error: "Missing required fields: url, patientId, uploadedById" },
        { status: 400 },
      );
    }

    const image = await prisma.radiologyImage.create({
      data: {
        url,
        type: type || "X-Ray",
        description: description || null,
        toothNumber: toothNumber || null,
        patientId,
        uploadedById,
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error: any) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create image" },
      { status: 500 },
    );
  }
}
