import { NextRequest, NextResponse } from 'next/server';
import { fetchSeriesList } from '@/lib/series-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const seriesList = await fetchSeriesList(search, category);
    return NextResponse.json({ series: seriesList });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ series: [] });
  }
}
