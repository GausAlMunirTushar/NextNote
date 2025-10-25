// store/dashboard-store.ts
import { create } from "zustand";
import { useNotesStore } from "./notes-store";
import { useTasksStore } from "./tasks-store";

interface DashboardStats {
	totalNotes: number;
	totalTasks: number;
	completedTasks: number;
	starredNotes: number;
	recentActivity: any[];
	writingStreak: number;
	mostUsedFolders: { name: string; count: number; color: string }[];
	dailyStats: { date: string; notes: number; tasks: number }[];
}

interface DashboardStore {
	stats: DashboardStats;
	getDashboardStats: () => DashboardStats;
	getRecentActivity: () => any[];
	getWritingStreak: () => number;
	getProductivityStats: () => {
		label: string;
		value: number;
		change: number;
	}[];
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
	stats: {
		totalNotes: 0,
		totalTasks: 0,
		completedTasks: 0,
		starredNotes: 0,
		recentActivity: [],
		writingStreak: 0,
		mostUsedFolders: [],
		dailyStats: [],
	},

	getDashboardStats: () => {
		const notes = useNotesStore.getState().notes;
		const tasks = useTasksStore.getState().tasks;

		const completedTasks = tasks.filter(
			(task) => task.status === "done"
		).length;
		const starredNotes = notes.filter((note) => note.starred).length;

		// Calculate writing streak (simplified)
		const today = new Date();
		const streak = calculateWritingStreak(notes);

		// Recent activity (last 7 days)
		const recentActivity = getRecentActivity(notes, tasks);

		// Most used folders
		const mostUsedFolders = getMostUsedFolders(notes);

		// Daily stats for chart
		const dailyStats = getDailyStats(notes, tasks);

		const stats = {
			totalNotes: notes.length,
			totalTasks: tasks.length,
			completedTasks,
			starredNotes,
			recentActivity,
			writingStreak: streak,
			mostUsedFolders,
			dailyStats,
		};

		set({ stats });
		return stats;
	},

	getRecentActivity: () => {
		const notes = useNotesStore.getState().notes;
		const tasks = useTasksStore.getState().tasks;
		return getRecentActivity(notes, tasks);
	},

	getWritingStreak: () => {
		const notes = useNotesStore.getState().notes;
		return calculateWritingStreak(notes);
	},

	getProductivityStats: () => {
		const notes = useNotesStore.getState().notes;
		const tasks = useTasksStore.getState().tasks;

		const completedTasks = tasks.filter(
			(task) => task.status === "done"
		).length;
		const completionRate =
			tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

		return [
			{
				label: "Task Completion",
				value: Math.round(completionRate),
				change: 12, // Mock data - would calculate from previous period
			},
			{
				label: "Notes Created",
				value: notes.length,
				change: 8,
			},
			{
				label: "Writing Streak",
				value: calculateWritingStreak(notes),
				change: 5,
			},
			{
				label: "Productivity Score",
				value: Math.round(
					(completionRate +
						notes.length * 2 +
						calculateWritingStreak(notes) * 5) /
						3
				),
				change: 15,
			},
		];
	},
}));

// Helper functions
const calculateWritingStreak = (notes: any[]): number => {
	if (notes.length === 0) return 0;

	const today = new Date();
	const dates = notes.map((note) => new Date(note.updatedAt).toDateString());
	const uniqueDates = [...new Set(dates)];

	let streak = 0;
	let currentDate = new Date(today);

	while (true) {
		const dateStr = currentDate.toDateString();
		if (uniqueDates.includes(dateStr)) {
			streak++;
			currentDate.setDate(currentDate.getDate() - 1);
		} else {
			break;
		}
	}

	return streak;
};

const getRecentActivity = (notes: any[], tasks: any[]) => {
	const allActivities = [
		...notes.map((note) => ({
			type: "note",
			action: note.createdAt === note.updatedAt ? "created" : "updated",
			title: note.title,
			time: new Date(note.updatedAt),
			id: note.id,
		})),
		...tasks.map((task) => ({
			type: "task",
			action:
				task.status === "done"
					? "completed"
					: task.status === "in-progress"
					? "started"
					: "created",
			title: task.title,
			time: new Date(task.updatedAt),
			id: task.id,
		})),
	];

	return allActivities
		.sort((a, b) => b.time.getTime() - a.time.getTime())
		.slice(0, 10)
		.map((activity) => ({
			...activity,
			time: activity.time.toISOString(),
		}));
};

const getMostUsedFolders = (notes: any[]) => {
	const folderCounts: {
		[key: string]: { count: number; color: string; name: string };
	} = {};

	notes.forEach((note) => {
		const folderId = note.folderId || "uncategorized";
		if (!folderCounts[folderId]) {
			folderCounts[folderId] = {
				count: 0,
				color: folderId === "uncategorized" ? "#6b7280" : "#3b82f6",
				name:
					folderId === "uncategorized"
						? "No Folder"
						: `Folder ${folderId.slice(0, 4)}`,
			};
		}
		folderCounts[folderId].count++;
	});

	return Object.values(folderCounts)
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
};

const getDailyStats = (notes: any[], tasks: any[]) => {
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - i);
		return date.toISOString().split("T")[0];
	}).reverse();

	return last7Days.map((date) => {
		const dayNotes = notes.filter(
			(note) => note.updatedAt.split("T")[0] === date
		).length;

		const dayTasks = tasks.filter(
			(task) => task.updatedAt.split("T")[0] === date
		).length;

		return {
			date,
			notes: dayNotes,
			tasks: dayTasks,
		};
	});
};
