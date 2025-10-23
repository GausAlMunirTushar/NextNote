"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/theme-store"
import { useNotesStore } from "@/store/notes-store"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const presetColors = [
	{ name: "Orange", value: "#FF9500" },
	{ name: "Coral", value: "#FF6B6B" },
	{ name: "Brown", value: "#A0826D" },
	{ name: "Pink", value: "#FF3B9A" },
	{ name: "Green", value: "#4CD964" },
	{ name: "Purple", value: "#8B5CF6" },
	{ name: "Magenta", value: "#C026D3" },
]

export default function SettingsPage() {
	const { toast } = useToast()
	const { theme, setTheme } = useThemeStore()
	const { labels, addLabel, deleteLabel } = useNotesStore()
	const [labelName, setLabelName] = useState("")
	const [labelColor, setLabelColor] = useState("#5EBFFF")

	const handleCreateLabel = () => {
		if (!labelName.trim()) {
			toast({
				title: "Label name required",
				description: "Please enter a name for the label.",
				variant: "destructive",
			})
			return
		}

		addLabel({ name: labelName, color: labelColor })
		toast({
			title: "Label created!",
			description: `Label "${labelName}" has been created.`,
		})
		setLabelName("")
		setLabelColor("#5EBFFF")
	}

	const handleDeleteLabel = (id: string) => {
		deleteLabel(id)
		toast({
			title: "Label deleted",
			description: "The label has been removed.",
		})
	}

	return (
		<div className="max-w-4xl">
			<h2 className="text-xl sm:text-2xl font-bold mb-6">Settings</h2>

			<Tabs defaultValue="preferences" className="space-y-6">
				<TabsList className="">
					<TabsTrigger value="preferences" className="flex-1 sm:flex-none">
						Preferences
					</TabsTrigger>
					<TabsTrigger value="labels" className="flex-1 sm:flex-none">
						Labels
					</TabsTrigger>
				</TabsList>

				<TabsContent value="preferences" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Theme</CardTitle>
							<CardDescription>Choose how NextNote looks to you</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<button
									onClick={() => setTheme("light")}
									className={cn(
										"p-4 rounded-lg border-2 transition-all",
										theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
									)}
								>
									<div className="bg-white border border-gray-200 rounded p-3 mb-2">
										<div className="h-2 bg-gray-200 rounded mb-2" />
										<div className="h-2 bg-gray-100 rounded" />
									</div>
									<span className="text-sm font-medium">Light</span>
								</button>

								<button
									onClick={() => setTheme("dark")}
									className={cn(
										"p-4 rounded-lg border-2 transition-all",
										theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
									)}
								>
									<div className="bg-gray-900 border border-gray-700 rounded p-3 mb-2">
										<div className="h-2 bg-gray-700 rounded mb-2" />
										<div className="h-2 bg-gray-800 rounded" />
									</div>
									<span className="text-sm font-medium">Dark</span>
								</button>

								<button
									onClick={() => setTheme("system")}
									className={cn(
										"p-4 rounded-lg border-2 transition-all",
										theme === "system" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
									)}
								>
									<div className="flex gap-1 mb-2">
										<div className="flex-1 bg-white border border-gray-200 rounded p-2">
											<div className="h-1 bg-gray-200 rounded" />
										</div>
										<div className="flex-1 bg-gray-900 border border-gray-700 rounded p-2">
											<div className="h-1 bg-gray-700 rounded" />
										</div>
									</div>
									<span className="text-sm font-medium">System</span>
								</button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="labels" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Labels</CardTitle>
							<CardDescription>Create customized labels for your notes tagging</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{labels.length > 0 && (
								<div className="space-y-2">
									<Label>Active Labels ({labels.length})</Label>
									<div className="flex flex-wrap gap-2">
										{labels.map((label) => (
											<div
												key={label.id}
												className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
												style={{ borderColor: label.color }}
											>
												<div className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
												<span className="text-sm">{label.name}</span>
												<button
													onClick={() => handleDeleteLabel(label.id)}
													className="text-muted-foreground hover:text-destructive"
												>
													×
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							<div className="space-y-4 pt-4 border-t">
								<h3 className="font-semibold">Create New Label</h3>

								<div className="space-y-2">
									<Label htmlFor="labelName">Label Name</Label>
									<Input
										id="labelName"
										placeholder="Enter label name"
										value={labelName}
										onChange={(e) => setLabelName(e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label>Pick Label Colour</Label>
									<div className="flex flex-wrap gap-2">
										{presetColors.map((color) => (
											<button
												key={color.value}
												onClick={() => setLabelColor(color.value)}
												className={cn(
													"h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
													labelColor === color.value
														? "border-foreground ring-2 ring-offset-2 ring-foreground"
														: "border-transparent",
												)}
												style={{ backgroundColor: color.value }}
												title={color.name}
											/>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="customColor">Custom Color</Label>
									<div className="flex gap-2">
										<Input
											id="customColor"
											type="text"
											placeholder="#5EBFFF"
											value={labelColor}
											onChange={(e) => setLabelColor(e.target.value)}
											className="flex-1"
										/>
										<div
											className="h-10 w-10 rounded-full border-2 flex-shrink-0"
											style={{ backgroundColor: labelColor }}
										/>
									</div>
								</div>

								<Button onClick={handleCreateLabel} className="w-full">
									Create Label
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
