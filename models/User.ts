import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		image: { type: String },
		plan: { type: String, enum: ["free", "pro", "team", "enterprise"], default: "free" },
		stripeCustomerId: String,
		stripeSubscriptionId: String,
		subscriptionStatus: {
			type: String,
			enum: ["active", "canceled", "past_due", "unpaid"],
			default: "active",
		},
		trialEndsAt: Date,
	},
	{ timestamps: true }
);

export const User = models.User || model("User", UserSchema);
