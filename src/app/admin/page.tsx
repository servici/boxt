'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Users, DollarSign, Eye, Film, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [topSeries, setTopSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setTopSeries(data.topSeries || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0E]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">Overview of users, views, content inventory, and revenue stats</p>
          </div>
          <span className="bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Authenticated</span>
          </span>
        </div>

        {loading ? (
          <div className="text-xs text-zinc-400">Loading admin metrics...</div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <div className="bg-[#13131A] rounded-2xl p-5 border border-[#242432]">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-semibold">Total Registered Users</span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white">{stats?.totalUsers || 0}</div>
              </div>

              <div className="bg-[#13131A] rounded-2xl p-5 border border-[#242432]">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-semibold">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  ${(stats?.totalRevenue || 0).toFixed(2)}
                </div>
              </div>

              <div className="bg-[#13131A] rounded-2xl p-5 border border-[#242432]">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-semibold">Total Series Views</span>
                  <Eye className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {(stats?.totalViews || 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-[#13131A] rounded-2xl p-5 border border-[#242432]">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-semibold">Active Series / Episodes</span>
                  <Film className="w-5 h-5 text-[#FF2A55]" />
                </div>
                <div className="text-3xl font-black text-white">
                  {stats?.totalSeries || 0} <span className="text-sm font-semibold text-zinc-400">({stats?.totalEpisodes || 0} EPs)</span>
                </div>
              </div>
            </div>

            {/* Top Series Table */}
            <div className="bg-[#13131A] rounded-3xl p-6 border border-[#242432]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF2A55]" />
                  <span>Most Watched Short Series</span>
                </h3>
                <Link href="/admin/series" className="text-xs font-bold text-purple-400 hover:underline">
                  Manage All Series &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#242432] text-zinc-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Series Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Episodes</th>
                      <th className="py-3 px-4 text-right">Total Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242432]/60">
                    {topSeries.map((s) => (
                      <tr key={s.id} className="hover:bg-[#1C1C26]/50">
                        <td className="py-3 px-4 flex items-center gap-3 font-bold text-white">
                          <img src={s.coverImage} className="w-8 h-10 object-cover rounded-md" />
                          <span>{s.title}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">{s.category}</td>
                        <td className="py-3 px-4 text-zinc-300">{s._count?.episodes || 0}</td>
                        <td className="py-3 px-4 text-right font-black text-amber-400">
                          {s.viewsCount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
