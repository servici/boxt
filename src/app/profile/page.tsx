'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Coins, History, Lock, Play, Clock, Sparkles } from 'lucide-react';
import { User } from '@/types';
import CoinBadge from '@/components/CoinBadge';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'unlocks'>('history');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userRes = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        const historyRes = await fetch('/api/user/history', { cache: 'no-store' });
        if (historyRes.ok) {
          const histData = await historyRes.json();
          setHistory(histData.history || []);
          setUnlocks(histData.unlocks || []);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-zinc-400 text-sm">
        Loading Profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Profile Header Box */}
      <div className="bg-[#13131A] rounded-3xl p-6 sm:p-8 border border-[#242432] mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FF2A55] to-amber-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#0A0A0E] rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user.name || 'Drama Fan'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Coins Wallet Card */}
        <div className="w-full sm:w-auto bg-[#0A0A0E] rounded-2xl p-4 border border-[#242432] flex items-center justify-between sm:justify-end gap-6">
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">Coin Balance</div>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span>{user.coinsBalance.toLocaleString()}</span>
            </div>
          </div>

          <Link
            href="/pricing"
            className="px-4 py-2.5 rounded-full font-extrabold text-xs text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 shadow-md transition-all hover:scale-105"
          >
            Buy Coins
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#242432] pb-3 mb-6">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 text-sm font-extrabold pb-2 border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-[#FF2A55] text-[#FF2A55]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Watch History ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('unlocks')}
          className={`flex items-center gap-2 text-sm font-extrabold pb-2 border-b-2 transition-all ${
            activeTab === 'unlocks'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Unlocked Episodes ({unlocks.length})</span>
        </button>
      </div>

      {/* Content List */}
      {activeTab === 'history' && (
        history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/watch/${item.episode.seriesId}?ep=${item.episode.episodeNumber}`}
                className="group bg-[#13131A] hover:bg-[#1C1C26] p-3.5 rounded-2xl border border-[#242432] hover:border-[#FF2A55]/50 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                  <img src={item.episode.series.coverImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white group-hover:text-[#FF2A55] truncate">
                    {item.episode.series.title}
                  </h4>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    Episode {item.episode.episodeNumber}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Watched {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <Play className="w-5 h-5 text-zinc-400 group-hover:text-[#FF2A55] group-hover:scale-110 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-xs">No watch history yet. Start exploring series!</div>
        )
      )}

      {activeTab === 'unlocks' && (
        unlocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocks.map((item) => (
              <Link
                key={item.id}
                href={`/watch/${item.episode.seriesId}?ep=${item.episode.episodeNumber}`}
                className="group bg-[#13131A] hover:bg-[#1C1C26] p-3.5 rounded-2xl border border-[#242432] hover:border-amber-500/50 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                  <img src={item.episode.series.coverImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-400 truncate">
                    {item.episode.series.title}
                  </h4>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    Episode {item.episode.episodeNumber}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
                <Play className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-xs">No unlocked premium episodes yet.</div>
        )
      )}
    </div>
  );
}
