'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Eye, Film } from 'lucide-react';
import { Series } from '@/types';
import { formatViews } from '@/lib/utils';

interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const episodeCount = series._count?.episodes ?? series.episodes?.length ?? 0;

  return (
    <Link href={`/series/${series.id}`} className="group block relative">
      <div className="bg-[#13131A] rounded-2xl overflow-hidden border border-[#242432] hover:border-[#FF2A55]/50 transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(255,42,85,0.2)] hover:-translate-y-1">
        
        {/* Cover Aspect Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
          <img
            src={series.coverImage}
            alt={series.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-black/30 opacity-90" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {series.category}
            </span>
            <span className="bg-[#FF2A55] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md">
              {series.status}
            </span>
          </div>

          {/* Hover Play Button Glow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-[#FF2A55] flex items-center justify-center shadow-[0_0_25px_rgba(255,42,85,0.8)] scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Bottom Overlay Meta */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>{formatViews(series.viewsCount)}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>{episodeCount} EPS</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3.5">
          <h3 className="font-bold text-base text-zinc-100 group-hover:text-[#FF2A55] transition-colors line-clamp-1">
            {series.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {series.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
