import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalSeries = await prisma.series.count();
    const totalEpisodes = await prisma.episode.count();
    
    const purchases = await prisma.purchase.aggregate({
      _sum: { amount: true },
      _count: true,
    });

    const totalViews = await prisma.series.aggregate({
      _sum: { viewsCount: true },
    });

    const topSeries = await prisma.series.findMany({
      orderBy: { viewsCount: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        viewsCount: true,
        coverImage: true,
        _count: { select: { episodes: true } },
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSeries,
        totalEpisodes,
        totalRevenue: purchases._sum.amount || 0,
        totalPurchasesCount: purchases._count || 0,
        totalViews: totalViews._sum.viewsCount || 0,
      },
      topSeries,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
