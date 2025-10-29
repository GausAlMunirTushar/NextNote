"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboard-store";
import { useNotesStore } from "@/store/notes-store";
import { useTasksStore } from "@/store/tasks-store";
import {
	FileText,
	CheckSquare,
	Star,
	TrendingUp,
	Calendar,
	Plus,
	Clock,
	Folder,
	Activity,
	Target,
	Zap,
	BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NoteCard from "@/views/app/notes/note-card";

export default function DashboardPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	const { stats, getDashboardStats, getProductivityStats } = useDashboardStore();
	const { getRecentNotes } = useNotesStore();
	const { getTodayTasks } = useTasksStore();

	useEffect(() => {
		getDashboardStats();
		setIsLoading(false);
	}, [getDashboardStats]);

	const productivityStats = getProductivityStats();
	const recentNotes = getRecentNotes(5);
	const todayTasks = getTodayTasks();

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	if (isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto px-4 pb-16">
			{/* Header */}
			<div className="text-center my-10">
				<h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
					{getGreeting()}
				</h1>
				<p className="text-muted-foreground mt-1">
					Here's a quick overview of your workspace today.
				</p>
			</div>

			{/* Recently Visited */}
			<section className="mb-12">
				<div className="flex items-center gap-2 mb-4">
					<Clock className="h-4 w-4 text-muted-foreground" />
					<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Recently Visited
					</h2>
				</div>
				{recentNotes.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/20">
						<FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
						<p>No recent notes yet</p>
						<Button
							variant="outline"
							size="sm"
							className="mt-3"
							onClick={() => router.push("/new")}
						>
							Create New Note
						</Button>
					</div>
				) : (
					<div className="overflow-x-auto scrollbar-hide">
						<div className="flex gap-5 pb-3">
							{recentNotes.map((note) => (
								<NoteCard
									key={note.id}
									id={note.id}
									title={note.title || "Untitled Note"}
									updatedAt={new Date(note.updatedAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
									author="You"
									starred={note.starred}
									coverColor={note.color || "#f3f4f6"}
								/>
							))}
						</div>
					</div>
				)}
			</section>

			{/* Stats Grid */}
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				<StatCard
					title="Total Notes"
					value={stats.totalNotes}
					icon={FileText}
					description="All your notes"
					color="blue"
					onClick={() => router.push("/notes")}
				/>
				<StatCard
					title="Active Tasks"
					value={stats.totalTasks}
					icon={CheckSquare}
					description="Tasks to complete"
					color="green"
					onClick={() => router.push("/tasks")}
				/>
				<StatCard
					title="Writing Streak"
					value={stats.writingStreak}
					icon={Zap}
					description="Days in a row"
					color="yellow"
				/>
				<StatCard
					title="Starred Notes"
					value={stats.starredNotes}
					icon={Star}
					description="Important notes"
					color="purple"
					onClick={() => router.push("/favorites")}
				/>
			</section>

			{/* Productivity Metrics */}
			<section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Productivity
						</CardTitle>
						<CardDescription>Your performance metrics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{productivityStats.map((stat, index) => (
								<ProductivityMetric
									key={index}
									label={stat.label}
									value={stat.value}
									change={stat.change}
								/>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Today's Tasks
						</CardTitle>
						<CardDescription>Tasks due today</CardDescription>
					</CardHeader>
					<CardContent>
						{todayTasks.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No tasks for today</p>
								<Button
									variant="outline"
									className="mt-2"
									onClick={() => router.push("/tasks")}
								>
									View all tasks
								</Button>
							</div>
						) : (
							todayTasks.map((task) => (
								<div
									key={task.id}
									className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
									onClick={() => router.push(`/tasks/${task.id}`)}
								>
									<div
										className={`w-3 h-3 rounded-full ${task.status === "done"
											? "bg-green-500"
											: task.status === "in-progress"
												? "bg-yellow-500"
												: "bg-blue-500"
											}`}
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm truncate">{task.title}</p>
										<div className="flex items-center gap-2 mt-1">
											<Badge
												variant="outline"
												className={`text-xs ${task.priority === "high"
													? "bg-red-100 text-red-800"
													: task.priority === "medium"
														? "bg-yellow-100 text-yellow-800"
														: "bg-green-100 text-green-800"
													}`}
											>
												{task.priority}
											</Badge>
											<span className="text-xs text-muted-foreground">
												{task.status.replace("-", " ")}
											</span>
										</div>
									</div>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</section>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5" />
						Quick Actions
					</CardTitle>
					<CardDescription>Get things done faster</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Button
							variant="outline"
							className="h-16 flex-col gap-1"
							onClick={() => router.push("/new")}
						>
							<Plus className="h-5 w-5" />
							<span className="text-xs">New Note</span>
						</Button>
						<Button
							variant="outline"
							className="h-16 flex-col gap-1"
							onClick={() => router.push("/tasks")}
						>
							<CheckSquare className="h-5 w-5" />
							<span className="text-xs">Add Task</span>
						</Button>
						<Button
							variant="outline"
							className="h-16 flex-col gap-1"
							onClick={() => router.push("/templates")}
						>
							<FileText className="h-5 w-5" />
							<span className="text-xs">Templates</span>
						</Button>
						<Button
							variant="outline"
							className="h-16 flex-col gap-1"
							onClick={() => router.push("/search")}
						>
							<BarChart3 className="h-5 w-5" />
							<span className="text-xs">Search</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

/* Helper Components */
function StatCard({ title, value, icon: Icon, description, color, onClick }: any) {
	const colorClasses = {
		blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
		green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
		yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300",
		purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300",
	};

	return (
		<Card
			className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]`}
			onClick={onClick}
		>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-muted-foreground">{title}</p>
						<p className="text-2xl font-bold mt-1">{value}</p>
						<p className="text-xs text-muted-foreground mt-1">{description}</p>
					</div>
					<div className={`p-3 rounded-full ${colorClasses[color]}`}>
						<Icon className="h-6 w-6" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function ProductivityMetric({ label, value, change }: any) {
	return (
		<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
			<div>
				<p className="text-sm font-medium">{label}</p>
				<p className="text-2xl font-bold">{value}%</p>
			</div>
			<div className={`flex items-center ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
				<TrendingUp className={`h-4 w-4 mr-1 ${change < 0 ? "rotate-180" : ""}`} />
				<span className="text-sm font-medium">{Math.abs(change)}%</span>
			</div>
		</div>
	);
}
