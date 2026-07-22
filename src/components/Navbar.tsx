'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Play, Search, User as UserIcon, Shield, LogOut, Film, Sparkles } from 'lucide-react';
import CoinBadge from './CoinBadge';
import { User } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  // Hide Navbar on full-screen vertical watch page for immersive viewing
  if (pathname?.startsWith('/watch/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0E]/85 backdrop-blur-xl border-b border-[#242432]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2A55] to-amber-500 p-0.5 shadow-[0_0_15px_rgba(255,42,85,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0A0A0E] rounded-[10px] flex items-center justify-center">
              <Play className="w-5 h-5 text-[#FF2A55] fill-[#FF2A55] ml-0.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-[#FF2A55] bg-clip-text text-transparent">
              DRAMABOX<span className="text-[#FF2A55]">.</span>
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 font-medium tracking-wider">SHORT DRAMA</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search series, titles, themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13131A] text-sm text-zinc-100 placeholder-zinc-500 rounded-full pl-10 pr-4 py-2 border border-[#242432] focus:outline-none focus:border-[#FF2A55] focus:ring-1 focus:ring-[#FF2A55] transition-all"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Action Items */}
        <div className="flex items-center gap-3">
          
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-full bg-[#13131A]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Coins Counter */}
          {user && <CoinBadge balance={user.coinsBalance} />}

          {/* Admin Link if Admin */}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Account Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13131A] hover:bg-[#1C1C26] border border-[#242432] text-sm text-zinc-200 font-medium transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF2A55]/20 flex items-center justify-center text-[#FF2A55] text-xs font-bold">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name || 'Account'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-full bg-[#13131A] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors border border-[#242432]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-gradient-to-r from-[#FF2A55] to-rose-600 hover:from-rose-600 hover:to-[#FF2A55] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,42,85,0.4)] transition-all hover:scale-105"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Expandable */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#242432]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13131A] text-sm text-zinc-100 placeholder-zinc-500 rounded-full pl-10 pr-4 py-2 border border-[#242432] focus:outline-none focus:border-[#FF2A55]"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      )}
    </header>
  );
}
