// types/auth.ts
export interface User {
	id: string;
	email: string;
	name: string;
	image?: string;
	plan: UserPlan;
	stripeCustomerId?: string;
	stripeSubscriptionId?: string;
	subscriptionStatus: "active" | "canceled" | "past_due" | "unpaid";
	trialEndsAt?: string;
	createdAt: string;
	updatedAt: string;
}

export type UserPlan = "free" | "pro" | "team" | "enterprise";

export interface PlanFeatures {
	maxNotes: number;
	maxTasks: number;
	maxStorage: number; // in MB
	collaboration: boolean;
	templates: boolean;
	aiFeatures: boolean;
	customDomains: boolean;
	prioritySupport: boolean;
	apiAccess: boolean;
}

export const PLANS: Record<UserPlan, PlanFeatures> = {
	free: {
		maxNotes: 100,
		maxTasks: 50,
		maxStorage: 100, // 100MB
		collaboration: false,
		templates: true,
		aiFeatures: false,
		customDomains: false,
		prioritySupport: false,
		apiAccess: false,
	},
	pro: {
		maxNotes: 1000,
		maxTasks: 500,
		maxStorage: 1024, // 1GB
		collaboration: true,
		templates: true,
		aiFeatures: true,
		customDomains: false,
		prioritySupport: false,
		apiAccess: false,
	},
	team: {
		maxNotes: 10000,
		maxTasks: 5000,
		maxStorage: 5120, // 5GB
		collaboration: true,
		templates: true,
		aiFeatures: true,
		customDomains: true,
		prioritySupport: true,
		apiAccess: false,
	},
	enterprise: {
		maxNotes: 100000,
		maxTasks: 50000,
		maxStorage: 10240, // 10GB
		collaboration: true,
		templates: true,
		aiFeatures: true,
		customDomains: true,
		prioritySupport: true,
		apiAccess: true,
	},
};

export const PLAN_PRICES = {
	free: 0,
	pro: 9, // $9/month
	team: 29, // $29/month
	enterprise: 99, // $99/month
};
