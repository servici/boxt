import { prisma } from './db';
import { Series, Episode } from '@/types';

export const FALLBACK_SERIES: (Series & { episodes: Episode[] })[] = [
  {
    id: '42000019792-1',
    title: "The Billionaire's Secret Heir",
    description:
      'Separated at birth, young Alex returns to claim his rightful empire after discovering his true lineage. Secrets, romance, and fierce corporate vengeance unfold in fast-paced 60-second episodes.',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    category: 'CEO Romance',
    status: 'ONGOING',
    viewsCount: 142500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    episodes: Array.from({ length: 10 }, (_, i) => ({
      id: `ep-1-${i + 1}`,
      seriesId: '42000019792-1',
      episodeNumber: i + 1,
      title: `Episode ${i + 1}: ${i < 3 ? 'The Encounter' : 'Unveiling the Truth'}`,
      videoUrl: `https://drama.sansekai.my.id/watch/dramabox/42000019792?ep=${i + 1}`,
      isFree: i < 3,
      coinCost: 10,
      duration: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  },
  {
    id: '42000019792-2',
    title: 'Reborn as the Martial Monarch',
    description:
      'Betrayed by his trusted general, master fighter Chen awakens 10 years in the future inside the body of a weak high school student. Watch his meteoric rise to supreme ruler.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    category: 'Revenge & Martial Arts',
    status: 'ONGOING',
    viewsCount: 98400,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    episodes: Array.from({ length: 10 }, (_, i) => ({
      id: `ep-2-${i + 1}`,
      seriesId: '42000019792-2',
      episodeNumber: i + 1,
      title: `Episode ${i + 1}: ${i < 3 ? 'The Rebirth' : 'Showdown at the Tower'}`,
      videoUrl: `https://drama.sansekai.my.id/watch/dramabox/42000019792?ep=${i + 1}`,
      isFree: i < 3,
      coinCost: 10,
      duration: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  },
  {
    id: '42000019792-3',
    title: 'Double Life of the Masked Heiress',
    description:
      'By day she is an understated assistant, by night she commands a secret global intelligence syndicate. But her handsome boss is closing in on her secret identity.',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    category: 'Urban Thriller',
    status: 'COMPLETED',
    viewsCount: 231000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    episodes: Array.from({ length: 10 }, (_, i) => ({
      id: `ep-3-${i + 1}`,
      seriesId: '42000019792-3',
      episodeNumber: i + 1,
      title: `Episode ${i + 1}: ${i < 3 ? 'Undercover Agent' : 'Mask Off'}`,
      videoUrl: `https://drama.sansekai.my.id/watch/dramabox/42000019792?ep=${i + 1}`,
      isFree: i < 3,
      coinCost: 10,
      duration: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  },
];

export async function fetchSeriesList(search?: string, category?: string): Promise<any[]> {
  try {
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

    const seriesList = await prisma.series.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { episodes: true },
        },
      },
    });

    if (seriesList && seriesList.length > 0) {
      return seriesList;
    }
  } catch (err) {
    console.warn('Prisma DB query failed or unavailable, using fallback data:', err);
  }

  // Filter fallback series
  let filtered = [...FALLBACK_SERIES];
  if (category && category !== 'All') {
    filtered = filtered.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const sLow = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(sLow) ||
        s.description.toLowerCase().includes(sLow) ||
        s.category.toLowerCase().includes(sLow)
    );
  }

  return filtered;
}

export async function fetchSeriesById(id: string): Promise<any | null> {
  try {
    const series = await prisma.series.findUnique({
      where: { id },
      include: {
        episodes: {
          orderBy: { episodeNumber: 'asc' },
        },
      },
    });

    if (series) return series;
  } catch (err) {
    console.warn('Prisma DB query failed or unavailable for id:', id, err);
  }

  const fallback = FALLBACK_SERIES.find((s) => s.id === id);
  if (fallback) return fallback;

  // If id is numeric or unknown, return the first fallback series with matching episodes
  return FALLBACK_SERIES[0];
}
