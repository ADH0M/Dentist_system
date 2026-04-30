/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/db/db-connection';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if image exists
    const existingImage = await prisma.radiologyImage.findUnique({
      where: { id, OR:[{deletedAt: null},{deletedAt: {isSet:false}}] },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.radiologyImage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// Optional: GET single image
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const image = await prisma.radiologyImage.findUnique({
      where: { id, deletedAt: null },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error: any) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}