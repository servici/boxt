'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import { Series, Episode, User } from '@/types';
import { Loader2 } from 'lucide-react';

function WatchContent({ seriesId }: { seriesId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const epNumberParam = searchParams.get('ep') || '1';
  const currentEpNum = parseInt(epNumberParam, 10);

  const [series, setSeries] = useState<(Series & { episodes: Episode[] }) | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const userRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      const seriesRes = await fetch(`/api/series/${seriesId}`, { cache: 'no-store' });
      if (seriesRes.ok) {
        const seriesData = await seriesRes.json();
        setSeries(seriesData.series);
      }
    } catch (err) {
      console.error('Error loading watch page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [seriesId]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-10 h-10 text-[#FF2A55] animate-spin" />
        <span className="text-xs text-zinc-400 font-medium tracking-wider">Loading Drama Player...</span>
      </div>
    );
  }

  if (!series || !series.episodes || series.episodes.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white gap-4 p-4 text-center">
        <h2 className="text-xl font-bold">Series or Episodes Not Found</h2>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-full bg-[#FF2A55] font-bold text-sm"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const currentEpisode =
    series.episodes.find((e) => e.episodeNumber === currentEpNum) || series.episodes[0];

  const handleEpisodeChange = (newEpNum: number) => {
    router.replace(`/watch/${seriesId}?ep=${newEpNum}`);
  };

  return (
    <VideoPlayer
      series={series}
      episodes={series.episodes}
      currentEpisode={currentEpisode}
      user={user}
      onEpisodeChange={handleEpisodeChange}
      onUserUpdate={loadData}
    />
  );
}

export default function WatchPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white text-xs">Loading Player...</div>}>
      <WatchContent seriesId={params.id} />
    </Suspense>
  );
}
