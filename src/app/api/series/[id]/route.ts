import { NextRequest, NextResponse } from 'next/server';
import { fetchSeriesById } from '@/lib/series-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seriesId = params.id;
    const series = await fetchSeriesById(seriesId);

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    const episodesWithUnlock = (series.episodes || []).map((ep: any) => ({
      ...ep,
      isUnlocked: ep.isFree ?? true,
    }));

    return NextResponse.json({
      series: {
        ...series,
        episodes: episodesWithUnlock,
      },
    });
  } catch (error) {
    console.error('Error fetching series detail:', error);
    const series = await fetchSeriesById(params.id);
    return NextResponse.json({ series });
  }
}
