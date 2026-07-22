import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, description, coverImage, category, status } = await req.json();

    if (!title || !description || !coverImage || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const series = await prisma.series.create({
      data: {
        title,
        description,
        coverImage,
        category,
        status: status || 'ONGOING',
      },
    });

    return NextResponse.json({ message: 'Series created successfully', series });
  } catch (error) {
    console.error('Create series error:', error);
    return NextResponse.json({ error: 'Failed to create series' }, { status: 500 });
  }
}
