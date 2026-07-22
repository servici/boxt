'use client';

import React from 'react';
import Link from 'next/link';
import { Coins, Plus } from 'lucide-react';

interface CoinBadgeProps {
  balance: number;
  showAddButton?: boolean;
}

export default function CoinBadge({ balance, showAddButton = true }: CoinBadgeProps) {
  return (
    <Link
      href="/pricing"
      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-500/40 rounded-full px-3 py-1 text-sm font-semibold text-amber-400 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] cursor-pointer group"
    >
      <Coins className="w-4 h-4 text-yellow-400 animate-pulse-slow group-hover:rotate-12 transition-transform" />
      <span>{balance.toLocaleString()}</span>
      <span className="text-xs text-yellow-500 font-normal">Coins</span>
      {showAddButton && (
        <span className="ml-0.5 bg-amber-500 text-black rounded-full p-0.5 group-hover:scale-110 transition-transform">
          <Plus className="w-3 h-3 stroke-[3]" />
        </span>
      )}
    </Link>
  );
}
