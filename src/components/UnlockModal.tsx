'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Coins, Sparkles, X, AlertCircle } from 'lucide-react';
import { Episode } from '@/types';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode;
  userCoins: number;
  onSuccess: (newBalance: number) => void;
}

export default function UnlockModal({
  isOpen,
  onClose,
  episode,
  userCoins,
  onSuccess,
}: UnlockModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const canAfford = userCoins >= episode.coinCost;

  const handleUnlock = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: episode.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/watch/${episode.seriesId}?ep=${episode.episodeNumber}`);
          return;
        }
        setError(data.error || 'Failed to unlock episode');
        return;
      }

      onSuccess(data.newBalance);
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#13131A] rounded-3xl p-6 border border-[#242432] shadow-[0_0_50px_rgba(255,42,85,0.25)] text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1C1C26] text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon Header */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title & Info */}
        <h3 className="text-xl font-extrabold text-white">Unlock Episode {episode.episodeNumber}</h3>
        <p className="text-xs text-zinc-400 mt-1">
          {episode.title || `Episode ${episode.episodeNumber}`}
        </p>

        {/* Coin Requirement Box */}
        <div className="my-5 bg-[#0A0A0E] rounded-2xl p-4 border border-[#242432] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-zinc-300">Cost:</span>
          </div>
          <span className="text-lg font-black text-amber-400">{episode.coinCost} Coins</span>
        </div>

        {/* User Balance Status */}
        <div className="text-xs text-zinc-400 mb-6">
          Your current balance: <span className="font-bold text-white">{userCoins} Coins</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        {canAfford ? (
          <button
            onClick={handleUnlock}
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Unlocking...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Unlock for {episode.coinCost} Coins</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              onClose();
              router.push('/pricing');
            }}
            className="w-full py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#FF2A55] to-rose-600 hover:from-rose-600 hover:to-[#FF2A55] shadow-[0_0_20px_rgba(255,42,85,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5" />
            <span>Get Coins (Insufficient Balance)</span>
          </button>
        )}
      </div>
    </div>
  );
}
