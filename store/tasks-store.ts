import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
	id: string;
	title: string;
	description: string;
	status: "todo" | "in-progress" | "done";
	dueDate: string;
	labels: string[];
	createdAt: string;
	updatedAt: string;
	starred: boolean;
	priority: "low" | "medium" | "high";
}

export interface TaskLabel {
	id: string;
	name: string;
	color: string;
}

interface TasksStore {
	tasks: Task[];
	labels: TaskLabel[];
	// Task CRUD
	addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
	updateTask: (id: string, task: Partial<Task>) => void;
	deleteTask: (id: string) => void;
	// Labels
	addLabel: (label: Omit<TaskLabel, "id">) => void;
	deleteLabel: (id: string) => void;
	// Filters
	getTasksByStatus: (status: Task["status"]) => Task[];
	getTodayTasks: () => Task[];
	getTasksByDate: (date: string) => Task[];
	// Sharing
	shareTask: (id: string) => string;
	getShareableTask: (
		id: string
	) => { title: string; description: string } | null;
}

export const useTasksStore = create<TasksStore>()(
	persist(
		(set, get) => ({
			tasks: [],
			labels: [],

			addTask: (task) => {
				set((state) => ({
					tasks: [
						...state.tasks,
						{
							...task,
							id: crypto.randomUUID(),
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					],
				}));
			},

			updateTask: (id, task) => {
				set((state) => ({
					tasks: state.tasks.map((t) =>
						t.id === id
							? {
									...t,
									...task,
									updatedAt: new Date().toISOString(),
							  }
							: t
					),
				}));
			},

			deleteTask: (id) => {
				set((state) => ({
					tasks: state.tasks.filter((t) => t.id !== id),
				}));
			},

			addLabel: (label) => {
				set((state) => ({
					labels: [
						...state.labels,
						{ ...label, id: crypto.randomUUID() },
					],
				}));
			},

			deleteLabel: (id) => {
				set((state) => ({
					labels: state.labels.filter((l) => l.id !== id),
				}));
			},

			getTasksByStatus: (status) => {
				const state = get();
				return state.tasks.filter((task) => task.status === status);
			},

			getTodayTasks: () => {
				const state = get();
				const today = new Date().toISOString().split("T")[0];
				return state.tasks.filter((task) => task.dueDate === today);
			},

			getTasksByDate: (date) => {
				const state = get();
				return state.tasks.filter((task) => task.dueDate === date);
			},

			shareTask: (id: string) => {
				return `${window.location.origin}/tasks/${id}`;
			},

			getShareableTask: (id: string) => {
				const task = get().tasks.find((t) => t.id === id);
				if (!task) return null;
				return {
					title: task.title,
					description: task.description,
				};
			},
		}),
		{
			name: "nextnote-tasks-storage",
		}
	)
);
