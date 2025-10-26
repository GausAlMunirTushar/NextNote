// data/plans.ts
export type Plan = {
	name: string
	slug: string
	tagline: string
	monthly: number | "custom"
	yearly: number | "custom"
	target: string
	description: string
	features: string[]
	buttonText: string
	highlighted: boolean
}

const plans: Plan[] = [
	{
		name: "Free",
		slug: "free",
		tagline: "Perfect for getting started",
		monthly: 0,
		yearly: 0,
		target: "Personal users who want basic note-taking",
		description: "Quick, simple and private note-taking for individuals.",
		features: [
			"Up to 20 notes",
			"5 tasks and 2 folders",
			"Share note via link (read-only)",
			"Password protection for 1 note",
			"Basic text editor",
			"Local device storage only",
		],
		buttonText: "Start Free",
		highlighted: false,
	},
	{
		name: "Pro",
		slug: "pro",
		tagline: "For power users & freelancers",
		monthly: 5,
		yearly: 48,
		target: "For professionals who want sync, AI, and export",
		description: "Unlock AI writing, PDF export, and sync across devices.",
		features: [
			"Unlimited notes, folders & tasks",
			"AI Summarize & Rewrite tools",
			"Export as PDF / Markdown / Text",
			"Cloud Sync across devices",
			"Dark & Light themes",
			"Password-protected notes",
			"Priority support",
		],
		buttonText: "Go Pro",
		highlighted: true,
	},
	{
		name: "Team",
		slug: "team",
		tagline: "For small teams and startups",
		monthly: 9,
		yearly: 96,
		target: "Collaborate and organize team notes together",
		description: "Real-time collaboration with team permissions and activity logs.",
		features: [
			"Everything in Pro",
			"Real-time collaboration",
			"Team Workspaces & roles",
			"Custom subdomain (team.nextnote.app)",
			"Shared cloud storage (10GB/member)",
			"AI summaries for shared notes",
		],
		buttonText: "Get Started",
		highlighted: false,
	},
	{
		name: "Enterprise",
		slug: "enterprise",
		tagline: "For organizations & universities",
		monthly: "custom",
		yearly: "custom",
		target: "Large companies needing custom security & analytics",
		description: "Custom integrations, SSO, and unlimited storage.",
		features: [
			"Everything in Team",
			"SSO / SAML login",
			"Admin Dashboard & Analytics",
			"Custom integrations (Slack, Drive, Notion)",
			"Custom branding (logo, theme, domain)",
			"Unlimited storage",
			"24/7 Dedicated Support",
		],
		buttonText: "Contact Sales",
		highlighted: false,
	},
]

export default plans
