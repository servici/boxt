'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Mail, Lock, User, ArrowRight, AlertCircle, Gift } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#13131A] rounded-3xl p-8 border border-[#242432] shadow-[0_0_50px_rgba(255,42,85,0.15)] relative overflow-hidden">
        
        {/* Bonus Badge Header */}
        <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-2">
          <Gift className="w-5 h-5 text-yellow-400 shrink-0 animate-bounce" />
          <span>New Account Bonus: Get 50 Starter Coins Free!</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-xs text-zinc-400 mt-1">Start watching vertical drama series in seconds</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-[#0A0A0E] text-sm text-white placeholder-zinc-600 rounded-2xl pl-10 pr-4 py-3 border border-[#242432] focus:outline-none focus:border-[#FF2A55] transition-all"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-[#0A0A0E] text-sm text-white placeholder-zinc-600 rounded-2xl pl-10 pr-4 py-3 border border-[#242432] focus:outline-none focus:border-[#FF2A55] transition-all"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0E] text-sm text-white placeholder-zinc-600 rounded-2xl pl-10 pr-4 py-3 border border-[#242432] focus:outline-none focus:border-[#FF2A55] transition-all"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl font-extrabold text-white bg-gradient-to-r from-[#FF2A55] to-rose-600 hover:from-rose-600 hover:to-[#FF2A55] shadow-[0_0_20px_rgba(255,42,85,0.4)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register & Claim 50 Coins</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#242432] text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF2A55] font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
