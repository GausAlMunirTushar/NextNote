"use client";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 py-20 px-6">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Terms of Service</h1>
        <p>
          By using NextNote you agree to use the service responsibly. Notes you
          create remain your property; we never sell or share your content.
        </p>
        <h2>Usage Guidelines</h2>
        <ul>
          <li>No spam or harmful content.</li>
          <li>Do not attempt to exploit the platform.</li>
        </ul>
        <h2>Liability</h2>
        <p>
          NextNote is provided “as is.” We strive for reliability but offer no
          warranty of uninterrupted service.
        </p>
      </div>
    </main>
  );
}
