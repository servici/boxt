'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Play, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check credentials.');
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#13131A] rounded-3xl p-8 border border-[#242432] shadow-[0_0_50px_rgba(255,42,85,0.15)] relative overflow-hidden">
      {/* Brand Top Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF2A55] to-amber-500 p-0.5 mx-auto mb-3 shadow-[0_0_20px_rgba(255,42,85,0.4)]">
          <div className="w-full h-full bg-[#0A0A0E] rounded-[14px] flex items-center justify-center">
            <Play className="w-7 h-7 text-[#FF2A55] fill-[#FF2A55] ml-1" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-white">Welcome Back</h1>
        <p className="text-xs text-zinc-400 mt-1">Log in to stream short drama series & access your coins</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@drama.com"
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
            <span>Logging in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Helper Box */}
      <div className="mt-6 pt-5 border-t border-[#242432] text-center">
        <p className="text-[11px] text-zinc-400 font-medium mb-2">⚡ Demo Quick Accounts:</p>
        <div className="flex flex-col gap-1.5 text-[11px]">
          <button
            onClick={() => {
              setEmail('user@drama.com');
              setPassword('user123');
            }}
            className="px-3 py-1.5 rounded-xl bg-[#1C1C26] hover:bg-[#242432] text-zinc-300 border border-[#242432] transition-colors flex items-center justify-between"
          >
            <span>User: <strong className="text-amber-400">user@drama.com</strong> (150 coins)</span>
            <span className="text-[10px] text-zinc-500">Fill</span>
          </button>
          <button
            onClick={() => {
              setEmail('admin@drama.com');
              setPassword('admin123');
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 transition-colors flex items-center justify-between"
          >
            <span>Admin: <strong className="text-purple-400">admin@drama.com</strong></span>
            <span className="text-[10px] text-zinc-500">Fill</span>
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-5">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#FF2A55] font-bold hover:underline">
            Create Account (+50 Free Coins)
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading Login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
