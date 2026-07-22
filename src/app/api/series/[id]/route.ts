import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seriesId = params.id;
    const userPayload = getUserFromRequest(req);

    const series = await prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        episodes: {
          orderBy: { episodeNumber: 'asc' },
        },
      },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    await prisma.series.update({
      where: { id: seriesId },
      data: { viewsCount: { increment: 1 } },
    });

    let unlockedEpisodeIds = new Set<string>();
    if (userPayload) {
      const unlocks = await prisma.unlock.findMany({
        where: { userId: userPayload.userId },
        select: { episodeId: true },
      });
      unlockedEpisodeIds = new Set(unlocks.map((u) => u.episodeId));
    }

    const episodesWithUnlock = series.episodes.map((ep) => ({
      ...ep,
      isUnlocked: ep.isFree || unlockedEpisodeIds.has(ep.id),
    }));

    return NextResponse.json({
      series: {
        ...series,
        episodes: episodesWithUnlock,
      },
    });
  } catch (error) {
    console.error('Error fetching series detail:', error);
    return NextResponse.json({ error: 'Failed to fetch series details' }, { status: 500 });
  }
}
