import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const seriesId = params.id;
    const body = await req.json();

    const series = await prisma.series.update({
      where: { id: seriesId },
      data: {
        title: body.title,
        description: body.description,
        coverImage: body.coverImage,
        category: body.category,
        status: body.status,
      },
    });

    return NextResponse.json({ message: 'Series updated successfully', series });
  } catch (error) {
    console.error('Update series error:', error);
    return NextResponse.json({ error: 'Failed to update series' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const seriesId = params.id;

    await prisma.series.delete({
      where: { id: seriesId },
    });

    return NextResponse.json({ message: 'Series deleted successfully' });
  } catch (error) {
    console.error('Delete series error:', error);
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 });
  }
}
