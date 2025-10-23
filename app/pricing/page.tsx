"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import plans from "@/data/plans";

export default function PricingPage() {
	const [isYearly, setIsYearly] = useState(false);

	return (
		<main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black py-20 px-6 transition-colors duration-300">
			<div className="max-w-6xl mx-auto text-center">
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
					Simple, Transparent Pricing
				</h1>
				<p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Choose the plan that fits your workflow. No ads, no trackers — only
					pure productivity.
				</p>

				{/* Toggle Switch */}
				<div className="flex items-center justify-center gap-3 mt-10">
					<span
						className={`text-sm font-medium ${!isYearly
								? "text-cyan-600 dark:text-cyan-400"
								: "text-slate-500 dark:text-slate-400"
							}`}
					>
						Monthly
					</span>

					<button
						onClick={() => setIsYearly(!isYearly)}
						className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? "bg-cyan-600" : "bg-slate-300 dark:bg-slate-700"
							}`}
					>
						<span
							className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transform transition-transform duration-300 ${isYearly ? "translate-x-7" : ""
								}`}
						/>
					</button>

					<span
						className={`text-sm font-medium ${isYearly
								? "text-cyan-600 dark:text-cyan-400"
								: "text-slate-500 dark:text-slate-400"
							}`}
					>
						Yearly{" "}
						<span className="text-xs font-semibold text-green-500">(Save ~17%)</span>
					</span>
				</div>
			</div>

			{/* Pricing Cards */}
			<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
				{plans.map((plan) => {
					const price = isYearly ? plan.yearly : plan.monthly;
					return (
						<div
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg transition-all duration-300 ${plan.highlighted
									? "border-cyan-500 ring-2 ring-cyan-500"
									: "border-slate-200 dark:border-slate-700"
								}`}
						>
							{plan.highlighted && (
								<span className="absolute top-3 right-3 rounded-full bg-cyan-600 text-white text-xs font-semibold px-3 py-1">
									Most Popular
								</span>
							)}

							<div className="p-8 flex flex-col flex-1">
								<h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
									{plan.name}
								</h2>
								<p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
									{plan.description}
								</p>

								<div className="mt-6 flex items-baseline justify-center sm:justify-start">
									<span className="text-5xl font-bold text-slate-900 dark:text-white transition-all duration-300">
										${price}
									</span>
									<span className="ml-1 text-slate-500 dark:text-slate-400">
										/{isYearly ? "year" : "month"}
									</span>
								</div>

								<ul className="mt-6 space-y-3 flex-1">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-center gap-2 text-slate-700 dark:text-slate-300"
										>
											<Check className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
											{feature}
										</li>
									))}
								</ul>

								<button
									className={`mt-8 w-full rounded-xl cursor-pointer px-5 py-3 text-sm font-semibold transition-all ${plan.highlighted
											? "bg-cyan-600 text-white hover:bg-cyan-700"
											: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
										}`}
								>
									{plan.buttonText}
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mt-20 text-center text-slate-500 dark:text-slate-400 text-sm">
				<p>
					💜 Need custom features or enterprise support?{" "}
					<Link
						href="/contact"
						className="text-cyan-600 dark:text-cyan-400 hover:underline"
					>
						Contact us
					</Link>
				</p>
			</div>
		</main>
	);
}
