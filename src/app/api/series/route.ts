import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    const whereClause: any = {};

    if (category && category !== 'All') {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'trending') {
      orderBy = { viewsCount: 'desc' };
    }

    const seriesList = await prisma.series.findMany({
      where: whereClause,
      orderBy,
      include: {
        _count: {
          select: { episodes: true },
        },
      },
    });

    return NextResponse.json({ series: seriesList });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}
