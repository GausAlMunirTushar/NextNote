export type Plan = {
	name: string;
	monthly: number;
	yearly: number;
	description: string;
	features: string[];
	buttonText: string;
	highlighted: boolean;
};

const plans: Plan[] = [
	{
		name: "Free",
		monthly: 0,
		yearly: 0,
		description: "Perfect for personal and quick note sharing.",
		features: [
			"Unlimited notes",
			"Password protection",
			"Share via link",
			"Basic editor",
		],
		buttonText: "Start Free",
		highlighted: false,
	},
	{
		name: "Pro",
		monthly: 5,
		yearly: 50, // save ~17%
		description: "For power users and professionals.",
		features: [
			"All Free features",
			"AI Summarize & Rewrite",
			"Export as PDF / Markdown",
			"Folders & Tags",
			"Priority Support",
		],
		buttonText: "Go Pro",
		highlighted: true,
	},
	{
		name: "Team",
		monthly: 9,
		yearly: 90,
		description: "Best for teams and organizations.",
		features: [
			"All Pro features",
			"Realtime Collaboration",
			"Custom Domain Workspace",
			"Team Permissions",
			"Admin Dashboard",
		],
		buttonText: "Get Started",
		highlighted: false,
	},
];

export default plans;
