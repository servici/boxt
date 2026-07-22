'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, Film, X, Check } from 'lucide-react';
import { Series } from '@/types';

export default function AdminSeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('CEO Romance');
  const [status, setStatus] = useState('ONGOING');

  const fetchSeries = async () => {
    try {
      const res = await fetch('/api/series', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSeriesList(data.series || []);
      }
    } catch (err) {
      console.error('Failed to fetch series:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const openCreateModal = () => {
    setEditingSeries(null);
    setTitle('');
    setDescription('');
    setCoverImage('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80');
    setCategory('CEO Romance');
    setStatus('ONGOING');
    setShowModal(true);
  };

  const openEditModal = (s: Series) => {
    setEditingSeries(s);
    setTitle(s.title);
    setDescription(s.description);
    setCoverImage(s.coverImage);
    setCategory(s.category);
    setStatus(s.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingSeries ? `/api/admin/series/${editingSeries.id}` : '/api/admin/series';
    const method = editingSeries ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, coverImage, category, status }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchSeries();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save series');
      }
    } catch (err) {
      alert('Error saving series');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this series and all its episodes?')) return;
    try {
      const res = await fetch(`/api/admin/series/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSeries();
      }
    } catch (err) {
      alert('Failed to delete series');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0E]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Series Management</h1>
            <p className="text-xs text-zinc-400 mt-1">Create, edit, and organize drama series catalog</p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Series</span>
          </button>
        </div>

        {/* Series Table */}
        <div className="bg-[#13131A] rounded-3xl p-6 border border-[#242432]">
          {loading ? (
            <div className="text-xs text-zinc-400">Loading series list...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#242432] text-zinc-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Poster & Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Episodes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242432]/60">
                  {seriesList.map((s) => (
                    <tr key={s.id} className="hover:bg-[#1C1C26]/50">
                      <td className="py-3.5 px-4 flex items-center gap-3 font-bold text-white max-w-xs">
                        <img src={s.coverImage} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                        <div className="truncate">
                          <div className="truncate text-sm">{s.title}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{s.description}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-medium">{s.category}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-medium">
                        {s._count?.episodes || 0} EPS
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 rounded-lg bg-[#1C1C26] hover:bg-purple-500/20 text-zinc-300 hover:text-purple-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
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

        {/* Modal for Create/Edit Series */}
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
                {editingSeries ? 'Edit Series' : 'Add New Drama Series'}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                    >
                      <option value="CEO Romance">CEO Romance</option>
                      <option value="Revenge & Martial Arts">Revenge & Martial Arts</option>
                      <option value="Urban Thriller">Urban Thriller</option>
                      <option value="Fantasy">Fantasy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#0A0A0E] text-white p-3 rounded-xl border border-[#242432] focus:border-purple-500"
                    >
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all mt-2"
                >
                  {editingSeries ? 'Save Changes' : 'Create Series'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
