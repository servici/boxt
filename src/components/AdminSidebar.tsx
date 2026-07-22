'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, PlayCircle, ArrowLeft, Shield } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview Stats', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Series', href: '/admin/series', icon: Film },
    { label: 'Manage Episodes', href: '/admin/episodes', icon: PlayCircle },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#13131A] border-r border-[#242432] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2 px-3 py-3 border-b border-[#242432] mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-sm">Admin Control</h2>
            <p className="text-[10px] text-zinc-400">DramaBox Studio</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1C1C26]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#242432]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-[#1C1C26] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drama Platform</span>
        </Link>
      </div>
    </aside>
  );
}
