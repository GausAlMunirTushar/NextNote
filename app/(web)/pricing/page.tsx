"use client"

import { useState } from "react"
import plans from "@/data/plans"
import { Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PricingPage() {
	const [isYearly, setIsYearly] = useState(true)

	return (
		<main className="min-h-screen bg-white dark:bg-slate-950 py-20 px-6">
			{/* Header */}
			<div className="max-w-6xl mx-auto text-center">
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
					Simple & Transparent Pricing
				</h1>
				<p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					No ads. No hidden fees. Just productivity that grows with you.
				</p>

				{/* Billing toggle */}
				<div className="flex items-center justify-center gap-3 mt-10">
					<span
						className={!isYearly ? "text-cyan-600 font-medium" : "text-slate-500"}
					>
						Monthly
					</span>
					<button
						onClick={() => setIsYearly(!isYearly)}
						className={cn(
							"relative w-14 h-7 rounded-full transition-colors duration-300",
							isYearly ? "bg-cyan-600" : "bg-slate-300 dark:bg-slate-700"
						)}
					>
						<span
							className={cn(
								"absolute top-1 left-1 w-5 h-5 rounded-full bg-white transform transition-transform duration-300",
								isYearly && "translate-x-7"
							)}
						/>
					</button>
					<span
						className={isYearly ? "text-cyan-600 font-medium" : "text-slate-500"}
					>
						Yearly{" "}
						<span className="text-xs text-green-500 font-semibold">(Save 20%)</span>
					</span>
				</div>
			</div>

			{/* Pricing Cards */}
			<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
				{plans.map((plan) => {
					const price =
						plan[isYearly ? "yearly" : "monthly"] === "custom"
							? "Custom"
							: `$${plan[isYearly ? "yearly" : "monthly"]}`

					return (
						<div
							key={plan.name}
							className={cn(
								"relative flex flex-col rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300",
								plan.highlighted
									? "border-cyan-500 ring-2 ring-cyan-500"
									: "border-slate-200 dark:border-slate-800"
							)}
						>
							{plan.highlighted && (
								<span className="absolute top-3 right-3 rounded-full bg-cyan-600 text-white text-xs font-semibold px-3 py-1">
									Most Popular
								</span>
							)}

							<div className="p-8 flex flex-col flex-1">
								<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
									{plan.name}
								</h2>
								<p className="text-sm text-slate-500 mt-1">{plan.tagline}</p>
								<p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
									{plan.description}
								</p>

								<div className="mt-6 flex items-baseline justify-start">
									<span className="text-4xl font-bold text-slate-900 dark:text-white">
										{price}
									</span>
									{typeof plan.monthly === "number" && (
										<span className="ml-1 text-slate-500 text-sm">
											/{isYearly ? "year" : "month"}
										</span>
									)}
								</div>

								<ul className="mt-6 space-y-3 flex-1">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-center gap-2 text-slate-700 dark:text-slate-300"
										>
											<Check className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
											{feature}
										</li>
									))}
								</ul>

								<Link
									href={plan.slug === "enterprise" ? "/contact" : "/signup"}
									className={cn(
										"mt-8 block w-full rounded-lg text-center px-5 py-3 text-sm font-semibold transition-all",
										plan.highlighted
											? "bg-cyan-600 text-white hover:bg-cyan-700"
											: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
									)}
								>
									{plan.buttonText}
								</Link>
							</div>
						</div>
					)
				})}
			</div>

			{/* Comparison Table */}
			<section className="mt-24 max-w-6xl mx-auto">
				<h3 className="text-2xl font-bold text-center mb-6 dark:text-white">
					⚙️ Explore All Features
				</h3>

				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-slate-100 dark:bg-slate-800 text-left">
								<th className="p-3">Feature</th>
								{plans.map((plan) => (
									<th key={plan.name} className="p-3 text-center font-semibold">
										{plan.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-slate-700">
							{[
								["Notes limit", "20", "Unlimited", "Unlimited", "Unlimited"],
								["Tasks", "5", "Unlimited", "Unlimited", "Unlimited"],
								["Folders", "2", "Unlimited", "Unlimited", "Unlimited"],
								["Cloud Sync", "❌", "✅", "✅", "✅"],
								["Share / Link", "✅ (read only)", "✅ (edit + password)", "✅ (collab)", "✅"],
								["AI Writing", "❌", "✅", "✅", "✅"],
								["Collaboration", "❌", "❌", "✅", "✅"],
								["Subdomain Workspace", "❌", "❌", "✅", "✅"],
								["Admin Controls", "❌", "❌", "✅", "✅"],
								["API Access", "❌", "❌", "✅", "✅"],
								["Custom Branding", "❌", "❌", "❌", "✅"],
								["Support", "Basic", "Priority", "Priority", "24/7 Dedicated"],
							].map((row, idx) => (
								<tr key={idx}>
									<td className="p-3 font-medium text-slate-700 dark:text-slate-300">
										{row[0]}
									</td>
									{row.slice(1).map((val, i) => (
										<td
											key={i}
											className="p-3 text-center text-slate-800 dark:text-slate-200"
										>
											{val}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Footer */}
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
	)
}
