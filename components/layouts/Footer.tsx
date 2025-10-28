
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
	Twitter,
	Github,
	Linkedin,
	MessageCircle,
	Mail,
	MapPin,
	Phone,
	ArrowUp,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const productLinks = [
		{ name: "Features", href: "/features" },
		{ name: "AI Assistant", href: "/ai" },
		{ name: "Templates", href: "/templates" },
		{ name: "Integrations", href: "/integrations" },
		{ name: "API", href: "/api" },
	];

	const solutionsLinks = [
		{ name: "For Teams", href: "/teams" },
		{ name: "For Education", href: "/education" },
		{ name: "For Developers", href: "/developers" },
		{ name: "For Startups", href: "/startups" },
		{ name: "Enterprise", href: "/enterprise" },
	];

	const resourcesLinks = [
		{ name: "Documentation", href: "/docs" },
		{ name: "Help Center", href: "/help" },
		{ name: "Community", href: "/community" },
		{ name: "Blog", href: "/blog" },
		{ name: "Webinars", href: "/webinars" },
	];

	const companyLinks = [
		{ name: "About", href: "/about" },
		{ name: "Careers", href: "/careers" },
		{ name: "Press", href: "/press" },
		{ name: "Contact", href: "/contact" },
		{ name: "Partners", href: "/partners" },
	];

	const socialLinks = [
		{
			name: "Twitter",
			href: "https://twitter.com/nextnote",
			icon: Twitter,
			color: "hover:bg-blue-500 hover:text-white",
		},
		{
			name: "GitHub",
			href: "https://github.com/nextnote",
			icon: Github,
			color: "hover:bg-gray-900 hover:text-white",
		},
		{
			name: "LinkedIn",
			href: "https://linkedin.com/company/nextnote",
			icon: Linkedin,
			color: "hover:bg-blue-600 hover:text-white",
		},
		{
			name: "Discord",
			href: "https://discord.gg/nextnote",
			icon: MessageCircle,
			color: "hover:bg-purple-500 hover:text-white",
		},
	];

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
			{/* Newsletter Section */}
			<motion.section
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				viewport={{ once: true }}
				className="border-b border-border"
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
							<Sparkles className="h-4 w-4" />
							<span>Stay Updated</span>
						</div>
						<h3 className="text-2xl sm:text-3xl font-bold mb-4">
							Join the Future of Note-Taking
						</h3>
						<p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
							Get the latest updates, new features, and productivity tips delivered to your inbox.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
							<Input
								type="email"
								placeholder="Enter your email"
								className="flex-1 bg-background border-border h-12"
							/>
							<Button className="h-12 px-8 whitespace-nowrap">
								<Mail className="h-4 w-4 mr-2" />
								Subscribe
							</Button>
						</div>
						<p className="text-xs text-muted-foreground mt-4">
							No spam, unsubscribe at any time.
						</p>
					</div>
				</div>
			</motion.section>

			{/* Main Footer Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-8 lg:gap-12">
					{/* Brand Column */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}
						className="xl:col-span-2 space-y-6"
					>
						<Link href="/" className="inline-flex items-center space-x-3 group">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary group-hover:bg-primary/90 transition-all duration-300">
								<span className="font-bold text-primary-foreground text-sm">NN</span>
							</div>
							<div>
								<span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									NextNote
								</span>
								<p className="text-xs text-muted-foreground mt-1">Intelligent Note-Taking</p>
							</div>
						</Link>

						<p className="text-muted-foreground leading-relaxed max-w-md">
							The modern, AI-powered note-taking app that helps teams and individuals
							write, organize, and collaborate more effectively.
						</p>

						{/* Contact Info */}
						<div className="space-y-3">
							<div className="flex items-center gap-3 text-muted-foreground">
								<MapPin className="h-4 w-4 text-primary flex-shrink-0" />
								<span className="text-sm">San Francisco, California</span>
							</div>
							<div className="flex items-center gap-3 text-muted-foreground">
								<Mail className="h-4 w-4 text-primary flex-shrink-0" />
								<span className="text-sm">hello@nextnote.com</span>
							</div>
						</div>

						{/* Social Links */}
						<div className="flex items-center gap-3 pt-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.name}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`p-3 rounded-xl bg-background border border-border text-muted-foreground transition-all duration-300 hover:shadow-lg ${social.color}`}
										whileHover={{ scale: 1.05, y: -2 }}
										whileTap={{ scale: 0.95 }}
									>
										<Icon className="h-5 w-5" />
										<span className="sr-only">{social.name}</span>
									</motion.a>
								);
							})}
						</div>
					</motion.div>

					{/* Links Grid */}
					<div className="xl:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
						{/* Product */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="space-y-4"
						>
							<h4 className="font-semibold text-foreground text-lg">Product</h4>
							<ul className="space-y-3">
								{productLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Solutions */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
							className="space-y-4"
						>
							<h4 className="font-semibold text-foreground text-lg">Solutions</h4>
							<ul className="space-y-3">
								{solutionsLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Resources */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
							className="space-y-4"
						>
							<h4 className="font-semibold text-foreground text-lg">Resources</h4>
							<ul className="space-y-3">
								{resourcesLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Company */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							viewport={{ once: true }}
							className="space-y-4"
						>
							<h4 className="font-semibold text-foreground text-lg">Company</h4>
							<ul className="space-y-3">
								{companyLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.6 }}
				viewport={{ once: true }}
				className="border-t border-border bg-background/50"
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
						{/* Copyright and Legal */}
						<div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
							<span>© {currentYear} NextNote. All rights reserved.</span>
							<div className="hidden sm:flex items-center gap-4">
								<span className="text-border">•</span>
								<Link
									href="/privacy"
									className="hover:text-foreground transition-colors"
								>
									Privacy
								</Link>
								<span className="text-border">•</span>
								<Link
									href="/terms"
									className="hover:text-foreground transition-colors"
								>
									Terms
								</Link>
								<span className="text-border">•</span>
								<Link
									href="/security"
									className="hover:text-foreground transition-colors"
								>
									Security
								</Link>
							</div>
						</div>

						{/* Back to Top */}
						<Button
							variant="ghost"
							size="sm"
							onClick={scrollToTop}
							className="gap-2 text-muted-foreground hover:text-foreground"
						>
							Back to top
							<ArrowUp className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</motion.div>
		</footer>
	);
}