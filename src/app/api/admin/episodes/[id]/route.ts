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

    const episodeId = params.id;
    const body = await req.json();

    const episode = await prisma.episode.update({
      where: { id: episodeId },
      data: {
        episodeNumber: body.episodeNumber ? parseInt(body.episodeNumber, 10) : undefined,
        title: body.title,
        videoUrl: body.videoUrl,
        isFree: body.isFree !== undefined ? Boolean(body.isFree) : undefined,
        coinCost: body.coinCost ? parseInt(body.coinCost, 10) : undefined,
        duration: body.duration ? parseInt(body.duration, 10) : undefined,
      },
    });

    return NextResponse.json({ message: 'Episode updated successfully', episode });
  } catch (error) {
    console.error('Update episode error:', error);
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
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

    const episodeId = params.id;

    await prisma.episode.delete({
      where: { id: episodeId },
    });

    return NextResponse.json({ message: 'Episode deleted successfully' });
  } catch (error) {
    console.error('Delete episode error:', error);
    return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
  }
}
