"use client";

import { useState } from "react";
import { Mail, User, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            // 👉 Replace this with your backend/email API integration (e.g., Resend, EmailJS, etc.)
            await new Promise((res) => setTimeout(res, 1200)); // Simulate delay
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black py-20 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                    Contact Us
                </h1>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                    Have questions, feedback, or partnership ideas?
                    We’d love to hear from you 💬
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-12 max-w-2xl mx-auto bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl dark:border-slate-800 p-8 space-y-6 transition-all"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium mb-2"
                    >
                        <User className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        Your Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium mb-2"
                    >
                        <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium mb-2"
                    >
                        <MessageSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        Your Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Write your message here..."
                        rows={5}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 text-white font-semibold py-3 hover:bg-cyan-700 transition-all disabled:opacity-60"
                >
                    {status === "loading" ? (
                        <span className="animate-pulse">Sending...</span>
                    ) : (
                        <>
                            <Send className="h-5 w-5" /> Send Message
                        </>
                    )}
                </button>

                {status === "success" && (
                    <p className="text-green-600 dark:text-green-400 text-center font-medium">
                        ✅ Message sent successfully! We’ll get back to you soon.
                    </p>
                )}
                {status === "error" && (
                    <p className="text-red-600 dark:text-red-400 text-center font-medium">
                        ❌ Something went wrong. Please try again later.
                    </p>
                )}
            </form>
        </main>
    );
}
