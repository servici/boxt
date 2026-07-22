import React from 'react';
import Link from 'next/link';
import { Play, Flame, Sparkles, Film, Search } from 'lucide-react';
import SeriesCard from '@/components/SeriesCard';
import { Series } from '@/types';

async function getSeries(search?: string, category?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'All') params.set('category', category);

  try {
    const res = await fetch(`${baseUrl}/api/series?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.series as Series[];
  } catch (err) {
    console.error('Failed to fetch series on homepage:', err);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const { search, category = 'All' } = searchParams;
  const seriesList = await getSeries(search, category);

  const featuredSeries = seriesList.length > 0 ? seriesList[0] : null;
  const categories = ['All', 'CEO Romance', 'Revenge & Martial Arts', 'Urban Thriller', 'Fantasy'];

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Banner Section (Only if no search active) */}
      {!search && featuredSeries && (
        <section className="relative w-full h-[450px] sm:h-[550px] overflow-hidden bg-zinc-950">
          <img
            src={featuredSeries.coverImage}
            alt={featuredSeries.title}
            className="w-full h-full object-cover object-center opacity-40 filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0E] via-[#0A0A0E]/80 to-transparent" />

          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl flex flex-col items-start gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2A55]/20 border border-[#FF2A55]/40 text-[#FF2A55] text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-[#FF2A55]" />
                <span>#1 Trending Series</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {featuredSeries.title}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed">
                {featuredSeries.description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={`/watch/${featuredSeries.id}?ep=1`}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FF2A55] to-rose-600 hover:from-rose-600 hover:to-[#FF2A55] text-white font-extrabold text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(255,42,85,0.5)] transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Episode 1</span>
                </Link>

                <Link
                  href={`/series/${featuredSeries.id}`}
                  className="px-6 py-3.5 rounded-full bg-[#13131A] hover:bg-[#1C1C26] border border-[#242432] text-zinc-200 font-bold text-sm transition-all"
                >
                  Series Info
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <Link
                key={cat}
                href={`/?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF2A55] text-white shadow-[0_0_15px_rgba(255,42,85,0.4)]'
                    : 'bg-[#13131A] text-zinc-400 hover:text-white hover:bg-[#1C1C26] border border-[#242432]'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mt-6 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF2A55]" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {search ? `Search Results for "${search}"` : category !== 'All' ? `${category} Series` : 'Popular Short Dramas'}
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            {seriesList.length} Series Available
          </span>
        </div>

        {/* Series Grid */}
        {seriesList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {seriesList.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#13131A] rounded-3xl border border-[#242432] p-8">
            <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-300">No drama series found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try searching for a different keyword or category.</p>
            <Link
              href="/"
              className="inline-block mt-4 text-xs font-bold text-[#FF2A55] hover:underline"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
