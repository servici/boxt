import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to unlock episodes.' }, { status: 401 });
    }

    const { episodeId } = await req.json();
    if (!episodeId) {
      return NextResponse.json({ error: 'Episode ID is required' }, { status: 400 });
    }

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    if (episode.isFree) {
      return NextResponse.json({ message: 'Episode is free to watch' });
    }

    // Check existing unlock
    const existingUnlock = await prisma.unlock.findUnique({
      where: {
        userId_episodeId: {
          userId: userPayload.userId,
          episodeId: episode.id,
        },
      },
    });

    if (existingUnlock) {
      return NextResponse.json({ message: 'Episode already unlocked' });
    }

    // Fetch latest user coin balance
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.coinsBalance < episode.coinCost) {
      return NextResponse.json(
        { error: `Insufficient coin balance (${user.coinsBalance} coins available, ${episode.coinCost} required)` },
        { status: 402 }
      );
    }

    // Perform transaction: deduct coins and add unlock record
    const [updatedUser, unlock] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { coinsBalance: { decrement: episode.coinCost } },
      }),
      prisma.unlock.create({
        data: {
          userId: user.id,
          episodeId: episode.id,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Episode unlocked successfully!',
      unlocked: true,
      newBalance: updatedUser.coinsBalance,
      videoUrl: episode.videoUrl,
    });
  } catch (error) {
    console.error('Error unlocking episode:', error);
    return NextResponse.json({ error: 'Failed to unlock episode' }, { status: 500 });
  }
}
