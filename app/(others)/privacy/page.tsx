"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 py-20 px-6">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>
          We value your privacy. NextNote does not track, sell, or advertise on
          your data. Notes are encrypted and stored securely.
        </p>
        <h2>Data Storage</h2>
        <p>
          Anonymous notes store minimal metadata. Authenticated users may delete
          their data anytime.
        </p>
        <h2>Cookies & Analytics</h2>
        <p>We use essential cookies only for app functionality.</p>
      </div>
    </main>
  );
}
