import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const episodeId = params.id;
    const userPayload = getUserFromRequest(req);

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        series: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
    });

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    let isUnlocked = episode.isFree;

    if (!isUnlocked && userPayload) {
      const unlock = await prisma.unlock.findUnique({
        where: {
          userId_episodeId: {
            userId: userPayload.userId,
            episodeId: episode.id,
          },
        },
      });
      if (unlock) {
        isUnlocked = true;
      }
    }

    if (userPayload) {
      await prisma.watchHistory.upsert({
        where: {
          userId_episodeId: {
            userId: userPayload.userId,
            episodeId: episode.id,
          },
        },
        update: { updatedAt: new Date() },
        create: {
          userId: userPayload.userId,
          episodeId: episode.id,
        },
      });
    }

    return NextResponse.json({
      episode: {
        ...episode,
        isUnlocked,
        videoUrl: isUnlocked ? episode.videoUrl : null,
      },
    });
  } catch (error) {
    console.error('Error fetching episode:', error);
    return NextResponse.json({ error: 'Failed to fetch episode' }, { status: 500 });
  }
}
