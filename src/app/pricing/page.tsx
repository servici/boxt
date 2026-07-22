'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Coins, Sparkles, Check, Flame, ShieldCheck, Zap } from 'lucide-react';

const PACKAGES = [
  { id: 'p1', name: 'Starter Pack', coins: 100, bonus: 0, price: 0.99, popular: false },
  { id: 'p2', name: 'Drama Lover Pack', coins: 500, bonus: 50, price: 4.99, popular: true },
  { id: 'p3', name: 'Binge Watcher Pack', coins: 1200, bonus: 200, price: 9.99, popular: false },
  { id: 'p4', name: 'Ultimate VIP Pack', coins: 3000, bonus: 600, price: 24.99, popular: false },
];

export default function PricingPage() {
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setSuccessMsg(null);

    const totalCoins = selectedPkg.coins + selectedPkg.bonus;

    try {
      const res = await fetch('/api/purchase-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPkg.price,
          coinsAdded: totalCoins,
          paymentMethod: 'Instant simulated gateway',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/pricing');
          return;
        }
        alert(data.error || 'Purchase failed');
        return;
      }

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccessMsg(`🎉 Success! Added ${totalCoins} coins to your wallet!`);
      router.refresh();
    } catch (err) {
      alert('An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Coins className="w-4 h-4 text-yellow-400 animate-bounce" />
          <span>Coin Recharge Store</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Unlock Unlimited Short Drama
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Top up your coin wallet to instantly unlock premium episodes across all drama series.
        </p>
      </div>

      {successMsg && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold text-center animate-in fade-in">
          {successMsg}
        </div>
      )}

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PACKAGES.map((pkg) => {
          const isSelected = selectedPkg.id === pkg.id;
          const totalCoins = pkg.coins + pkg.bonus;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg)}
              className={`relative bg-[#13131A] rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-[#1C1C26] shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.03]'
                  : 'border-[#242432] hover:border-zinc-500 hover:bg-[#1C1C26]/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-extrabold text-zinc-200 mt-1">{pkg.name}</h3>

                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-400">{pkg.coins}</span>
                  <span className="text-sm font-semibold text-amber-500">Coins</span>
                  {pkg.bonus > 0 && (
                    <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      +{pkg.bonus} Bonus!
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5 text-xs text-zinc-400 font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Unlocks up to {Math.floor(totalCoins / 10)} Premium Episodes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Never Expires</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Instant Digital Credit</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-2xl font-black text-white mb-3">${pkg.price.toFixed(2)}</div>
                <div
                  className={`w-full py-3 rounded-2xl font-extrabold text-sm text-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black shadow-md'
                      : 'bg-[#0A0A0E] text-zinc-300 border border-[#242432]'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Package'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Action Button */}
      <div className="max-w-md mx-auto mt-10 text-center">
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-4 rounded-full font-black text-base text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-yellow-400 hover:to-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse text-black">Processing Payment...</span>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-black" />
              <span>Buy {selectedPkg.coins + selectedPkg.bonus} Coins for ${selectedPkg.price.toFixed(2)}</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Simulated 256-bit Secure Checkout Demo</span>
        </div>
      </div>
    </div>
  );
}
