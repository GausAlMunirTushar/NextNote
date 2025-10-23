"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	FileText,
	Sparkles,
	Lock,
	Palette,
	Search,
	Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20 text-foreground">
			{/* Header */}
			<motion.header
				initial={{ y: -80, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6 }}
				className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50"
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="flex items-center gap-2"
						>
							<Image
								src="/logo.svg"
								width={40}
								height={40}
								alt="Logo"
								className="h-8 w-8"
							/>
							<span className="text-xl font-bold">NextNote</span>
						</motion.div>

						<div className="flex items-center gap-3">
							<Button variant="ghost" asChild className="hidden sm:inline-flex">
								<Link href="/login">Sign in</Link>
							</Button>
							<Button asChild>
								<Link href="/new">Start Writing</Link>
							</Button>
						</div>
					</div>
				</div>
			</motion.header>

			{/* Hero Section */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
				<motion.div
					initial={{ opacity: 0, y: 60 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="max-w-4xl mx-auto text-center"
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
					>
						<Sparkles className="h-4 w-4" />
						<span>Free & Open Source</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
					>
						Your thoughts, beautifully organized
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.8 }}
						className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
					>
						A modern, fast, and intuitive note-taking app. Write, organize, and
						find your notes effortlessly — no signup required to start.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.6, duration: 0.7 }}
						className="flex flex-col sm:flex-row gap-4 justify-center"
					>
						<Button size="lg" asChild className="text-base">
							<Link href="/new">Start Writing Free</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							asChild
							className="text-base bg-transparent"
						>
							<Link href="/demo">View Demo</Link>
						</Button>
					</motion.div>
				</motion.div>
			</section>

			{/* Feature Section */}
			<motion.section
				initial={{ opacity: 0, y: 100 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7 }}
				viewport={{ once: true }}
				className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
			>
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
						Everything you need to stay organized
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
						<FeatureCard
							icon={<Zap className="h-6 w-6" />}
							title="Lightning Fast"
							description="Start writing instantly. No loading screens, no delays. Your notes are always ready."
						/>
						<FeatureCard
							icon={<Search className="h-6 w-6" />}
							title="Powerful Search"
							description="Find any note in seconds with our intelligent search that looks through titles and content."
						/>
						<FeatureCard
							icon={<Palette className="h-6 w-6" />}
							title="Customizable"
							description="Dark mode, light mode, or system theme. Organize with custom colored labels."
						/>
						<FeatureCard
							icon={<Lock className="h-6 w-6" />}
							title="Privacy First"
							description="Your notes are stored locally. Sign up only when you want to sync across devices."
						/>
						<FeatureCard
							icon={<FileText className="h-6 w-6" />}
							title="Rich Text Editor"
							description="Format your notes with bold, italic, lists, and more. Write the way you want."
						/>
						<FeatureCard
							icon={<Sparkles className="h-6 w-6" />}
							title="AI-Assisted"
							description="Use AI to summarize, rewrite, and enhance your writing effortlessly."
						/>
					</div>
				</div>
			</motion.section>

			{/* CTA Section */}
			<motion.section
				initial={{ opacity: 0, scale: 0.9 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
				viewport={{ once: true }}
				className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
			>
				<div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-8 sm:p-12 border border-primary/10">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">
						Ready to get started?
					</h2>
					<p className="text-lg text-muted-foreground mb-8">
						No credit card required. No signup needed. Just start writing.
					</p>
					<Button size="lg" asChild className="text-base">
						<Link href="/new">Create Your First Note</Link>
					</Button>
				</div>
			</motion.section>

			{/* Footer */}
			<footer className="border-t border-border bg-muted/30">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<Image
								src="/logo.svg"
								width={100}
								height={100}
								alt="Logo"
								className="h-6 w-6"
							/>
							<span className="font-semibold">NextNote</span>
						</div>
						<p className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} NextNote. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<motion.div
			whileHover={{ scale: 1.04 }}
			transition={{ duration: 0.2 }}
			className="p-6 rounded-xl bg-card hover:border border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
		>
			<div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="font-semibold text-lg mb-2">{title}</h3>
			<p className="text-sm text-muted-foreground text-pretty">{description}</p>
		</motion.div>
	);
}
