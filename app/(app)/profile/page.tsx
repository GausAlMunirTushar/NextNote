"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, CalendarDays, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
	const { user } = useAuthStore();
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
		image: user?.image || "",
	});

	const handleSave = () => {
		// TODO: Save to backend if required
		toast.success("Profile updated successfully");
		setEditing(false);
	};

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
				<Image src="/empty-state.svg" width={180} height={180} alt="Empty" />
				<h2 className="text-2xl font-semibold mt-4">No user data found</h2>
				<p className="text-muted-foreground mt-1">
					Please sign in to view your profile.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto py-10 px-4 md:px-0">
			<Card className=" border border-border/50 bg-card/60 backdrop-blur-md">
				<CardHeader className="flex flex-col items-center space-y-4 pb-6 border-b border-border/40">
					<div className="relative">
						<div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20">
							<Image
								src={form.image || user.image || "/avatar-placeholder.png"}
								alt={user.name}
								width={112}
								height={112}
								className="object-cover w-full h-full"
							/>
						</div>
						{editing && (
							<label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:scale-105 transition-transform">
								<Camera size={16} />
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											const reader = new FileReader();
											reader.onload = (r) =>
												setForm({ ...form, image: r.target?.result as string });
											reader.readAsDataURL(file);
										}
									}}
								/>
							</label>
						)}
					</div>

					<div className="text-center space-y-1">
						{editing ? (
							<Input
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								className="text-center font-semibold text-lg"
							/>
						) : (
							<h2 className="text-2xl font-semibold">{user.name}</h2>
						)}
						<p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
							<Mail className="h-4 w-4" /> {user.email}
						</p>

						<div className="mt-2 flex justify-center gap-2">
							<Badge
								variant="secondary"
								className="px-3 py-1 bg-primary/10 text-primary capitalize"
							>
								{user.plan} plan
							</Badge>
							<Badge
								variant="outline"
								className="flex items-center gap-1 border-border"
							>
								<ShieldCheck className="h-3.5 w-3.5 text-green-500" />
								Verified
							</Badge>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-6 space-y-8">
					{/* Account Details */}
					<div>
						<h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
							Account Information
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label>Name</Label>
								{editing ? (
									<Input
										value={form.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										className="max-w-[70%]"
									/>
								) : (
									<p className="text-right font-medium">{user.name}</p>
								)}
							</div>
							<div className="flex items-center justify-between">
								<Label>Email</Label>
								<p className="text-right font-medium">{user.email}</p>
							</div>
							<div className="flex items-center justify-between">
								<Label>Joined</Label>
								<div className="flex items-center gap-2 text-muted-foreground">
									<CalendarDays className="h-4 w-4" />
									<span>
										{new Date(user.createdAt || Date.now()).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Subscription Info */}
					<div>
						<h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
							Subscription
						</h3>
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="font-medium capitalize">{user.plan} Plan</p>
								<p className="text-sm text-muted-foreground">
									{user.plan === "free"
										? "Limited access to core features."
										: "Full access with premium features."}
								</p>
							</div>
							<Button variant="outline" size="sm">
								{user.plan === "free" ? "Upgrade" : "Manage"}
							</Button>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4 border-t border-border/40">
						{editing ? (
							<>
								<Button variant="outline" onClick={() => setEditing(false)}>
									Cancel
								</Button>
								<Button onClick={handleSave}>Save Changes</Button>
							</>
						) : (
							<Button onClick={() => setEditing(true)}>Edit Profile</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
