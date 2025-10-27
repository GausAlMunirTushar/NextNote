"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black py-20 px-6">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          About NextNote
        </h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          NextNote is a privacy-first, AI-powered note-taking platform built for
          thinkers, creators, and teams who value simplicity and security.
        </p>
        <div className="grid sm:grid-cols-2 gap-8 mt-10 text-left">
          <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/70 shadow border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-cyan-600 mb-2">
              Our Mission
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Empower everyone to write freely, securely, and intelligently —
              without distractions or invasive tracking.
            </p>
          </div>
          
        </div>
      </section>
    </main>
  );
}
