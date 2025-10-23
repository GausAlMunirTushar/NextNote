"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is NextNote free to use?",
    a: "Yes! The Free plan covers unlimited notes, password lock, and sharing. Pro adds AI and advanced tools.",
  },
  {
    q: "Do you store my notes on servers?",
    a: "Yes, securely and encrypted. Anonymous notes contain no personal data.",
  },
  {
    q: "Can I use NextNote offline?",
    a: "Offline mode is coming soon as a PWA update.",
  },
];

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:to-black py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-10">
          Support & FAQ
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white/80 dark:bg-slate-900/70 shadow-sm"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-medium text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                <span className="text-cyan-600 text-xl">
                  {open === i ? "–" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-slate-600 dark:text-slate-400">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-slate-500 dark:text-slate-400">
          Still need help?{" "}
          <a
            href="/contact"
            className="text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Contact us
          </a>
        </p>
      </div>
    </main>
  );
}
