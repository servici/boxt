import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Eye, Film, Lock, Unlock, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Series, Episode } from '@/types';
import { formatViews } from '@/lib/utils';
import { getUserFromCookies } from '@/lib/auth';

async function getSeriesDetail(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/series/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.series as Series & { episodes: Episode[] };
  } catch (err) {
    console.error('Error fetching series detail:', err);
    return null;
  }
}

export default async function SeriesDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const series = await getSeriesDetail(params.id);
  if (!series) {
    notFound();
  }

  const user = await getUserFromCookies();
  const episodes = series.episodes || [];
  const freeEpisodesCount = episodes.filter((e) => e.isFree).length;

  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero Banner Section */}
      <div className="relative w-full h-[380px] sm:h-[480px] overflow-hidden bg-zinc-950">
        <img
          src={series.coverImage}
          alt={series.title}
          className="w-full h-full object-cover object-center opacity-30 blur-md scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/80 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            
            {/* Cover Poster */}
            <div className="w-36 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#242432] shrink-0 bg-zinc-900">
              <img
                src={series.coverImage}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Metadata Info */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF2A55]/20 border border-[#FF2A55]/40 text-[#FF2A55] text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {series.category}
                </span>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  {series.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {series.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-zinc-300 font-medium my-1">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-zinc-400" />
                  <span>{formatViews(series.viewsCount)} Views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>{episodes.length} Episodes ({freeEpisodesCount} Free)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl line-clamp-3 leading-relaxed">
                {series.description}
              </p>

              <div className="flex items-center gap-3 pt-3">
                <Link
                  href={`/watch/${series.id}?ep=1`}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FF2A55] to-rose-600 hover:from-rose-600 hover:to-[#FF2A55] text-white font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,42,85,0.5)] transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Watch Episode 1</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6 border-b border-[#242432] pb-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-[#FF2A55]" />
            <span>Episodes ({episodes.length})</span>
          </h2>
          <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            First {freeEpisodesCount} Episodes FREE
          </span>
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {episodes.map((ep) => {
            return (
              <Link
                key={ep.id}
                href={`/watch/${series.id}?ep=${ep.episodeNumber}`}
                className="group relative bg-[#13131A] hover:bg-[#1C1C26] rounded-2xl p-4 border border-[#242432] hover:border-[#FF2A55]/50 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-white group-hover:text-[#FF2A55] transition-colors">
                      EP {ep.episodeNumber}
                    </span>
                    {ep.isFree ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                        Free
                      </span>
                    ) : ep.isUnlocked ? (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {ep.coinCost} Coins
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1 font-medium">
                    {ep.title || `Episode ${ep.episodeNumber}`}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#242432]/60 flex items-center justify-between text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ep.duration}s</span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FF2A55] group-hover:scale-125 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
