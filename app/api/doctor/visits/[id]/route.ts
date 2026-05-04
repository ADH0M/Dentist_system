/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/db/db-connection';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {data} = await request.json();
    const existingVisit = await prisma.visit.findUnique({
      where: { id, OR:[{deletedAt: null},{deletedAt: {isSet:false}}] },
    });

    if (!existingVisit) {
      return NextResponse.json(
        { error: 'visit not found' },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.visit.update({
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