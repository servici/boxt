import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await prisma.watchHistory.findMany({
      where: { userId: userPayload.userId },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        episode: {
          include: {
            series: true,
          },
        },
      },
    });

    const unlocks = await prisma.unlock.findMany({
      where: { userId: userPayload.userId },
      orderBy: { unlockedAt: 'desc' },
      include: {
        episode: {
          include: {
            series: true,
          },
        },
      },
    });

    return NextResponse.json({ history, unlocks });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
