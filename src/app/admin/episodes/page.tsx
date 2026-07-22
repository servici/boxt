'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, PlayCircle, X, Lock, Check } from 'lucide-react';
import { Series, Episode } from '@/types';

export default function AdminEpisodesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEp, setEditingEp] = useState<Episode | null>(null);

  // Form State
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [coinCost, setCoinCost] = useState(10);
  const [duration, setDuration] = useState(60);

  const fetchSeries = async () => {
    try {
      const res = await fetch('/api/series', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const list = data.series || [];
        setSeriesList(list);
        if (list.length > 0 && !selectedSeriesId) {
          setSelectedSeriesId(list[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch series:', err);
    }
  };

  const fetchEpisodes = async (seriesId: string) => {
    if (!seriesId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/series/${seriesId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEpisodes(data.series?.episodes || []);
      }
    } catch (err) {
      console.error('Failed to fetch episodes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    if (selectedSeriesId) {
      fetchEpisodes(selectedSeriesId);
    }
  }, [selectedSeriesId]);

  const openCreateModal = () => {
    setEditingEp(null);
    setEpisodeNumber(episodes.length + 1);
    setTitle(`Episode ${episodes.length + 1}`);
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setIsFree(episodes.length + 1 <= 3);
    setCoinCost(10);
    setDuration(60);
    setShowModal(true);
  };

  const openEditModal = (ep: Episode) => {
    setEditingEp(ep);
    setEpisodeNumber(ep.episodeNumber);
    setTitle(ep.title || '');
    setVideoUrl(ep.videoUrl || '');
    setIsFree(ep.isFree);
    setCoinCost(ep.coinCost);
    setDuration(ep.duration);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingEp ? `/api/admin/episodes/${editingEp.id}` : '/api/admin/episodes';
    const method = editingEp ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesId: selectedSeriesId,
          episodeNumber,
          title,
          videoUrl,
          isFree,
          coinCost,
          duration,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchEpisodes(selectedSeriesId);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save episode');
      }
    } catch (err) {
      alert('Error saving episode');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;
    try {
      const res = await fetch(`/api/admin/episodes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEpisodes(selectedSeriesId);
      }
    } catch (err) {
      alert('Failed to delete episode');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0E]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Episode Management</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage video URLs, free/paid toggles, and episode ordering</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Series Filter Selector */}
            <select
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
              className="bg-[#13131A] text-white text-xs font-bold px-4 py-2.5 rounded-full border border-[#242432] focus:border-purple-500"
            >
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s._count?.episodes || 0} EPs)
                </option>
              ))}
            </select>

            <button
              onClick={openCreateModal}
              disabled={!selectedSeriesId}
              className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Episode</span>
            </button>
          </div>
        </div>

        {/* Episodes Table */}
        <div className="bg-[#13131A] rounded-3xl p-6 border border-[#242432]">
          {loading ? (
            <div className="text-xs text-zinc-400">Loading episodes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#242432] text-zinc-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">EP #</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Video Source URL</th>
                    <th className="py-3 px-4">Access Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242432]/60">
                  {episodes.map((ep) => (
                    <tr key={ep.id} className="hover:bg-[#1C1C26]/50">
                      <td className="py-3.5 px-4 font-black text-amber-400">
                        EP {ep.episodeNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                        {ep.title || `Episode ${ep.episodeNumber}`}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-mono text-[11px]">
                        {ep.videoUrl}
                      </td>
                      <td className="py-3.5 px-4">
                        {ep.isFree ? (
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            FREE
                          </span>
                        ) : (
                          <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                            <Lock className="w-3 h-3" />
                            {ep.coinCost} Coins
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-medium">{ep.duration}s</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(ep)}
                            className="p-2 rounded-lg bg-[#1C1C26] hover:bg-purple-500/20 text-zinc-300 hover:text-purple-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ep.id)}
                            className="p-2 rounded-lg bg-[#1C1C26] hover:bg-red-500/20 text-zinc-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Episode Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#13131A] rounded-3xl p-6 border border-[#242432] w-full max-w-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#1C1C26] text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-extrabold text-white mb-4">
                {editingEp ? 'Edit Episode' : 'Add New Episode'}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Episode Number</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={episodeNumber}
                      onChange={(e) => setEpisodeNumber(parseInt(e.target.value, 10))}
                      className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Duration (seconds)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                      className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Episode Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Episode Title / Chapter Name"
                    className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Video Stream URL (.mp4 or .m3u8)</label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://my-server.com/watch/series_1?ep=1"
                    className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div className="bg-[#0A0A0E] rounded-2xl p-4 border border-[#242432] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Is Free Episode?</div>
                    <div className="text-[11px] text-zinc-500">Allow users to watch without coins</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                {!isFree && (
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Coin Cost to Unlock</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={coinCost}
                      onChange={(e) => setCoinCost(parseInt(e.target.value, 10))}
                      className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all mt-2"
                >
                  {editingEp ? 'Save Episode' : 'Create Episode'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
