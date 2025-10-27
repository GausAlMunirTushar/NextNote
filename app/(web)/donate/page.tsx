"use client";

import { Heart } from "lucide-react";

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black py-20 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Heart className="w-12 h-12 mx-auto text-cyan-600 dark:text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          Support NextNote
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          NextNote runs without ads or trackers. Your donation keeps the servers and AI features running 💜
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          <a
            href="https://buymeacoffee.com/yourid"
            target="_blank"
            className="rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-4 transition"
          >
            ☕ Buy Me a Coffee
          </a>
          <a
            href="https://ko-fi.com/yourid"
            target="_blank"
            className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 transition"
          >
            💜 Ko-fi Support
          </a>
          <a
            href="#crypto"
            className="rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 transition"
          >
            💎 Crypto Donation
          </a>
        </div>

        <div className="mt-10 p-6 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-left">
          <h2 className="text-lg font-semibold text-cyan-600 mb-2">
            Recent Supporters 💚
          </h2>
          <ul className="text-slate-600 dark:text-slate-400 space-y-1 text-sm">
            <li>• Ava — “Love the privacy focus!”</li>
            <li>• Noah — “Using it daily for research.”</li>
            <li>• Sofia — “Thank you for keeping it ad-free!”</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
