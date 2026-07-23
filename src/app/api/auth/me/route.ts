import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        coinsBalance: true,
        createdAt: true,
      },
    });

    if (user) {
      return NextResponse.json({ user });
    }
  } catch (err) {
    console.warn('Prisma lookup failed in /api/auth/me, returning payload:', err);
  }

  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.email.split('@')[0],
      role: payload.role,
      coinsBalance: 150,
      createdAt: new Date().toISOString(),
    },
  });
}
