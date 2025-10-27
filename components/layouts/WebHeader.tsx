// components/enhanced-header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Star, Zap, Users, Database, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function WebHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const featuresItems = [
		{ icon: FileText, name: "Notes & Docs", description: "Create beautiful notes and documents" },
		{ icon: Zap, name: "Tasks & Projects", description: "Manage your projects efficiently" },
		{ icon: Database, name: "Database", description: "Organize information in databases" },
		{ icon: Star, name: "Templates", description: "Start fast with ready-made templates" },
		{ icon: Users, name: "Collaboration", description: "Work together in real-time" },
	];

	return (
		<header className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${isScrolled
			? "bg-background/95 backdrop-blur-md shadow-sm"
			: "bg-background/80 backdrop-blur"
			}`}>
			<div className="container mx-auto px-4 sm:px-6">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2 group">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
								<span className="font-bold text-primary-foreground">NN</span>
							</div>
							<span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								NextNote
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						{/* Features Dropdown */}
						<div
							className="relative"
							onMouseEnter={() => setActiveDropdown("features")}
							onMouseLeave={() => setActiveDropdown(null)}
						>
							<button className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group">
								<span>Features</span>
								<ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === "features" ? "rotate-180" : "group-hover:rotate-180"
									}`} />
							</button>

							{activeDropdown === "features" && (
								<div className="absolute top-full left-0 mt-2 w-80 rounded-xl border bg-popover/95 backdrop-blur p-3 shadow-xl animate-in fade-in-0 zoom-in-95">
									<div className="space-y-1">
										{featuresItems.map((item) => {
											const Icon = item.icon;
											return (
												<div
													key={item.name}
													className="flex items-start space-x-3 rounded-lg p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer group"
												>
													<div className="mt-0.5 rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
														<Icon className="h-4 w-4 text-primary" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="font-medium text-sm">{item.name}</div>
														<div className="text-xs text-muted-foreground truncate hover:text-gray-100">{item.description}</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>

						<Link
							href="/pricing"
							className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
						>
							Pricing
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
						</Link>

						<Link
							href="/enterprise"
							className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
						>
							Enterprise
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
						</Link>
					</nav>

					{/* Desktop Auth Buttons */}
					<div className="hidden md:flex items-center space-x-3">
						<ThemeToggle />
						<Link
							href="/login"
							className="text-sm text-foreground/80 font-medium  hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
						>
							Login
						</Link>
						<Link
							href="/signup"
							className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 "
						>
							Get NextNote Free
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden border-t animate-in slide-in-from-top duration-200">
						<div className="py-4 space-y-4">
							{/* Mobile Features Dropdown */}
							<div className="space-y-2">
								<button
									className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
									onClick={() => setActiveDropdown(activeDropdown === "features-mobile" ? null : "features-mobile")}
								>
									<span className="font-medium">Features</span>
									<ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === "features-mobile" ? "rotate-180" : ""
										}`} />
								</button>

								{activeDropdown === "features-mobile" && (
									<div className="ml-4 space-y-2 animate-in fade-in-0 duration-200">
										{featuresItems.map((item) => {
											const Icon = item.icon;
											return (
												<div
													key={item.name}
													className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
												>
													<div className="rounded-lg bg-primary/10 p-2">
														<Icon className="h-4 w-4 text-primary" />
													</div>
													<div>
														<div className="font-medium text-sm">{item.name}</div>
														<div className="text-xs text-muted-foreground">{item.description}</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>

							<Link
								href="/pricing"
								className="block p-3 rounded-lg hover:bg-accent transition-colors font-medium"
								onClick={() => setIsMenuOpen(false)}
							>
								Pricing
							</Link>

							<Link
								href="/enterprise"
								className="block p-3 rounded-lg hover:bg-accent transition-colors font-medium"
								onClick={() => setIsMenuOpen(false)}
							>
								Enterprise
							</Link>

							<div className="pt-4 space-y-3 border-t">
								
								<Link
									href="/login"
									className="block p-3 rounded-lg hover:bg-accent transition-colors font-medium text-center"
									onClick={() => setIsMenuOpen(false)}
								>
									Login
								</Link>
								<Link
									href="/signup"
									className="block bg-primary text-primary-foreground hover:bg-primary/90 p-3 rounded-lg font-medium text-center transition-all duration-200 hover:shadow-lg"
									onClick={() => setIsMenuOpen(false)}
								>
									Get NextNote Free
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}