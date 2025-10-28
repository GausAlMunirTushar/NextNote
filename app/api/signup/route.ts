import { connectDatabase } from "@/config/database";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const { name, email, password } = await req.json();

		const existing = await User.findOne({ email });
		if (existing) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 });
		}

		const hashed = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashed,
			plan: "free",
			subscriptionStatus: "active",
		});

		return NextResponse.json({
			message: "Account created successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("Signup error:", err);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
