import React from 'react';
import Link from 'next/link';
import { Play, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0E] border-t border-[#242432] py-8 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF2A55] flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
          <span className="font-extrabold text-white">DRAMABOX</span>
          <span className="text-zinc-500">© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Get Coins</Link>
          <Link href="/profile" className="hover:text-white transition-colors">My Profile</Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF2A55] fill-[#FF2A55]" />
          <span>for vertical short drama lovers</span>
        </div>
      </div>
    </footer>
  );
}
