'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  List,
  Lock,
  ArrowLeft,
  Coins,
  Share2,
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { Episode, Series, User } from '@/types';
import UnlockModal from './UnlockModal';
import CoinBadge from './CoinBadge';

interface VideoPlayerProps {
  series: Series;
  episodes: Episode[];
  currentEpisode: Episode;
  user: User | null;
  onEpisodeChange: (epNumber: number) => void;
  onUserUpdate: () => void;
}

export default function VideoPlayer({
  series,
  episodes,
  currentEpisode,
  user,
  onEpisodeChange,
  onUserUpdate,
}: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [liked, setLiked] = useState(false);

  // Touch gesture tracking for vertical swipe
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const hasNext = currentEpisode.episodeNumber < episodes.length;
  const hasPrev = currentEpisode.episodeNumber > 1;

  // Determine if video URL is an iframe web embed vs direct video stream file (.mp4/.m3u8)
  const isIframeEmbed = Boolean(
    currentEpisode.videoUrl &&
      !currentEpisode.videoUrl.match(/\.(mp4|m3u8|webm|ogg)($|\?)/i)
  );

  // Initialize Video / HLS Stream if direct video file
  useEffect(() => {
    if (isIframeEmbed) return;

    const video = videoRef.current;
    if (!video || !currentEpisode.isUnlocked || !currentEpisode.videoUrl) return;

    setIsPlaying(false);
    setProgress(0);

    const videoUrl = currentEpisode.videoUrl;

    if (videoUrl.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      return () => {
        hls.destroy();
      };
    } else {
      video.src = videoUrl;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentEpisode, isIframeEmbed]);

  const togglePlay = () => {
    if (isIframeEmbed) return;
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isIframeEmbed || !videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration || currentEpisode.duration || 60);
    setProgress((video.currentTime / (video.duration || 1)) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (hasNext) {
      onEpisodeChange(currentEpisode.episodeNumber + 1);
    }
  };

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const distance = touchStartY.current - touchEndY.current;
    const isSwipeUp = distance > 60;
    const isSwipeDown = distance < -60;

    if (isSwipeUp && hasNext) {
      onEpisodeChange(currentEpisode.episodeNumber + 1);
    } else if (isSwipeDown && hasPrev) {
      onEpisodeChange(currentEpisode.episodeNumber - 1);
    }

    touchStartY.current = null;
    touchEndY.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && hasPrev) {
        onEpisodeChange(currentEpisode.episodeNumber - 1);
      } else if (e.key === 'ArrowDown' && hasNext) {
        onEpisodeChange(currentEpisode.episodeNumber + 1);
      } else if (e.key === ' ' && !isIframeEmbed) {
        e.preventDefault();
        togglePlay();
      }
    },
    [currentEpisode, hasNext, hasPrev, isIframeEmbed, onEpisodeChange]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden select-none">
      
      {/* Container aspect 9:16 frame */}
      <div
        className="relative w-full max-w-[440px] h-full sm:h-[95dvh] sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
          <Link
            href={`/series/${series.id}`}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="text-center px-2">
            <h2 className="text-xs font-semibold text-zinc-300 line-clamp-1">{series.title}</h2>
            <p className="text-[11px] text-amber-400 font-bold">Ep {currentEpisode.episodeNumber} / {episodes.length}</p>
          </div>

          <div className="flex items-center gap-2">
            {user && <CoinBadge balance={user.coinsBalance} showAddButton={false} />}
            {!isIframeEmbed && (
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Video / Lock Area */}
        <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center" onClick={togglePlay}>
          {currentEpisode.isUnlocked ? (
            isIframeEmbed ? (
              /* External Web Page / Embed Iframe Player */
              <iframe
                src={currentEpisode.videoUrl}
                title={`Episode ${currentEpisode.episodeNumber}`}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            ) : (
              /* Standard HTML5 / HLS Video Player */
              <>
                <video
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  playsInline
                  loop={false}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-[#FF2A55]/90 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,42,85,0.8)] animate-pulse">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            /* Locked Episode Backdrop Overlay */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950">
              <img
                src={series.coverImage}
                alt={series.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-125"
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
                  <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">Episode {currentEpisode.episodeNumber} Locked</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-[260px]">
                  Unlock this episode to continue watching {series.title}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      router.push(`/login?redirect=/watch/${series.id}?ep=${currentEpisode.episodeNumber}`);
                    } else {
                      setShowUnlockModal(true);
                    }
                  }}
                  className="mt-6 px-8 py-3.5 rounded-full font-extrabold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Unlock for {currentEpisode.coinCost} Coins</span>
                </button>
              </div>
            </div>
          )}

          {/* Right Floating Actions (TikTok / Reels Style) */}
          <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-3 rounded-full backdrop-blur-md border transition-all ${liked ? 'bg-[#FF2A55] border-[#FF2A55] text-white' : 'bg-black/40 border-white/10 text-white hover:bg-black/60'}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[10px] text-zinc-300 font-bold">{liked ? '1.2K' : '1.1K'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDrawer(true);
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all">
                <List className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-zinc-300 font-bold">Episodes</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: series.title, url: window.location.href });
                }
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-zinc-300 font-bold">Share</span>
            </button>
          </div>

          {/* Up & Down Episode Navigation Floating Controls */}
          <div className="absolute left-3 bottom-24 z-30 flex flex-col gap-2 pointer-events-auto">
            {hasPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEpisodeChange(currentEpisode.episodeNumber - 1);
                }}
                className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:bg-black/60 transition-all"
                title="Previous Episode"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEpisodeChange(currentEpisode.episodeNumber + 1);
                }}
                className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:bg-black/60 transition-all"
                title="Next Episode"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Scrubber & Progress Bar (For direct HTML5 videos) */}
        {!isIframeEmbed && currentEpisode.isUnlocked && (
          <div className="absolute bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto">
            <div className="flex items-center gap-3 mb-1 text-[11px] text-zinc-400 font-medium">
              <span>{Math.floor(currentTime)}s</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FF2A55]"
              />
              <span>{Math.floor(duration)}s</span>
            </div>
          </div>
        )}

        {/* Episode Selector Sheet / Drawer */}
        {showDrawer && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-[#13131A] rounded-t-3xl border-t border-[#242432] max-h-[75%] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#242432]">
                <h3 className="font-extrabold text-white text-base">Select Episode ({episodes.length})</h3>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="text-xs font-bold text-zinc-400 hover:text-white px-2 py-1 bg-[#1C1C26] rounded-md"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 overflow-y-auto pr-1">
                {episodes.map((ep) => {
                  const isCurrent = ep.episodeNumber === currentEpisode.episodeNumber;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => {
                        onEpisodeChange(ep.episodeNumber);
                        setShowDrawer(false);
                      }}
                      className={`relative p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#FF2A55] border-[#FF2A55] text-white font-bold shadow-[0_0_15px_rgba(255,42,85,0.4)]'
                          : ep.isUnlocked
                          ? 'bg-[#1C1C26] border-[#242432] text-zinc-200 hover:border-zinc-500'
                          : 'bg-[#0A0A0E] border-[#242432] text-zinc-500'
                      }`}
                    >
                      <span className="text-sm font-black">EP {ep.episodeNumber}</span>
                      {ep.isFree ? (
                        <span className="text-[9px] font-semibold text-emerald-400 uppercase mt-0.5">Free</span>
                      ) : !ep.isUnlocked ? (
                        <Lock className="w-3 h-3 text-amber-400 mt-1" />
                      ) : (
                        <span className="text-[9px] font-semibold text-zinc-400 mt-0.5">Unlocked</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Unlock Confirmation Modal */}
        <UnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          episode={currentEpisode}
          userCoins={user?.coinsBalance || 0}
          onSuccess={(newBalance) => {
            onUserUpdate();
            setShowUnlockModal(false);
          }}
        />
      </div>
    </div>
  );
}
