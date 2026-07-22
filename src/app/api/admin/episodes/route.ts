import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { seriesId, episodeNumber, title, videoUrl, isFree, coinCost, duration } = await req.json();

    if (!seriesId || !episodeNumber || !videoUrl) {
      return NextResponse.json({ error: 'seriesId, episodeNumber, and videoUrl are required' }, { status: 400 });
    }

    const episode = await prisma.episode.create({
      data: {
        seriesId,
        episodeNumber: parseInt(episodeNumber, 10),
        title,
        videoUrl,
        isFree: Boolean(isFree),
        coinCost: coinCost ? parseInt(coinCost, 10) : 10,
        duration: duration ? parseInt(duration, 10) : 60,
      },
    });

    return NextResponse.json({ message: 'Episode created successfully', episode });
  } catch (error: any) {
    console.error('Create episode error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Episode number already exists for this series' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
  }
}
