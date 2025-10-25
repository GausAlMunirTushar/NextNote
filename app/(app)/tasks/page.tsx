// app/tasks/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useTasksStore, type Task } from "@/store/tasks-store"
import {
	Plus,
	Calendar,
	Clock,
	MoreHorizontal,
	Share2,
	Eye,
	Edit,
	Trash2,
	Flag,
	CheckCircle2,
	PlayCircle,
	Circle,
	Archive
} from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TasksPage() {
	const router = useRouter()
	const { toast } = useToast()
	const { tasks, addTask, updateTask, deleteTask, getTodayTasks, getTasksByStatus } = useTasksStore()

	const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		dueDate: new Date().toISOString().split('T')[0],
		priority: "medium" as Task["priority"]
	})

	const todayTasks = getTodayTasks()
	const todoTasks = getTasksByStatus("todo")
	const inProgressTasks = getTasksByStatus("in-progress")
	const doneTasks = getTasksByStatus("done")

	const handleAddTask = () => {
		if (!newTask.title.trim()) {
			toast({
				title: "Title required",
				description: "Please enter a title for the task.",
				variant: "destructive",
			})
			return
		}

		addTask({
			title: newTask.title,
			description: newTask.description,
			dueDate: newTask.dueDate,
			status: "todo",
			labels: [],
			starred: false,
			priority: newTask.priority,
		})

		toast({
			title: "Task added!",
			description: "Your task has been created successfully.",
		})

		setNewTask({
			title: "",
			description: "",
			dueDate: new Date().toISOString().split('T')[0],
			priority: "medium"
		})
		setIsAddTaskOpen(false)
	}

	const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
		updateTask(taskId, { status: newStatus })
		toast({
			title: "Status updated!",
			description: `Task marked as ${newStatus.replace('-', ' ')}.`,
		})
	}

	const handleDeleteTask = (taskId: string) => {
		deleteTask(taskId)
		toast({
			title: "Task deleted!",
			description: "Task has been removed.",
		})
	}

	const handleEditTask = (taskId: string) => {
		router.push(`/tasks/${taskId}/edit`)
	}

	const getPriorityColor = (priority: Task["priority"]) => {
		switch (priority) {
			case "high": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300"
			case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
			case "low": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
			default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
		}
	}

	const getPriorityIcon = (priority: Task["priority"]) => {
		switch (priority) {
			case "high": return <Flag className="h-3 w-3 fill-red-500 text-red-500" />
			case "medium": return <Flag className="h-3 w-3 fill-yellow-500 text-yellow-500" />
			case "low": return <Flag className="h-3 w-3 fill-green-500 text-green-500" />
			default: return <Flag className="h-3 w-3" />
		}
	}

	const TaskCard = ({ task, showActions = true }: { task: Task; showActions?: boolean }) => (
		<Card className="mb-3 hover:shadow-md transition-all duration-200 border-l-4"
			style={{
				borderLeftColor:
					task.priority === 'high' ? '#ef4444' :
						task.priority === 'medium' ? '#eab308' : '#22c55e'
			}}>
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<h3 className="font-semibold text-sm">{task.title}</h3>
							<Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
								{getPriorityIcon(task.priority)}
								<span className="ml-1">{task.priority}</span>
							</Badge>
						</div>

						{task.description && (
							<p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
						)}

						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{new Date(task.dueDate).toLocaleDateString()}
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</div>
						</div>
					</div>

					{showActions && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
									<Eye className="h-4 w-4 mr-2" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEditTask(task.id)}>
									<Edit className="h-4 w-4 mr-2" />
									Edit Task
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}?share=true`)}>
									<Share2 className="h-4 w-4 mr-2" />
									Share
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => handleDeleteTask(task.id)}
									className="text-destructive"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardContent>
		</Card>
	)

	const StatusColumn = ({
		title,
		tasks,
		status,
		icon,
		color
	}: {
		title: string
		tasks: Task[]
		status: Task["status"]
		icon: React.ReactNode
		color: string
	}) => (
		<Card className="flex flex-col max-h-screen">
			<CardHeader className="pb-3 border-b">
				<CardTitle className="text-sm font-medium flex items-center gap-2">
					{icon}
					{title} ({tasks.length})
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 p-4 overflow-y-auto">
				<div className="space-y-3">
					{tasks.map((task) => (
						<div key={task.id} className="group relative">
							<TaskCard task={task} />
							<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="flex gap-1">
									{status === "todo" && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0 bg-blue-500 hover:bg-blue-600 text-white"
											onClick={() => handleStatusChange(task.id, "in-progress")}
											title="Start task"
										>
											<PlayCircle className="h-3 w-3" />
										</Button>
									)}
									{status === "in-progress" && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white"
											onClick={() => handleStatusChange(task.id, "done")}
											title="Complete task"
										>
											<CheckCircle2 className="h-3 w-3" />
										</Button>
									)}
									{status === "done" && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0 bg-gray-500 hover:bg-gray-600 text-white"
											onClick={() => handleDeleteTask(task.id)}
											title="Remove task"
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
					{tasks.length === 0 && (
						<div className="text-center text-muted-foreground py-8">
							<div className="text-3xl mb-2 opacity-50">📝</div>
							<p className="text-sm">No tasks here</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className="h-max-screen flex flex-col">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
				<div>
					<h2 className="text-2xl sm:text-3xl font-bold">Tasks</h2>
					<p className="text-muted-foreground">Manage your daily tasks and priorities</p>
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => router.push("/tasks/archive")}
					>
						<Archive className="h-4 w-4 mr-2" />
						Previous Tasks
					</Button>

					<Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Task
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Create New Task</DialogTitle>
								<DialogDescription>
									Add a new task to your todo list.
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium">Title *</label>
									<Input
										value={newTask.title}
										onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
										placeholder="Enter task title"
										className="mt-1"
									/>
								</div>

								<div>
									<label className="text-sm font-medium">Description</label>
									<Textarea
										value={newTask.description}
										onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
										placeholder="Enter task description"
										rows={3}
										className="mt-1 resize-none"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium">Due Date</label>
										<Input
											type="date"
											value={newTask.dueDate}
											onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
											className="mt-1"
										/>
									</div>

									<div>
										<label className="text-sm font-medium">Priority</label>
										<select
											value={newTask.priority}
											onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
											className="w-full px-3 py-2 border rounded-md mt-1 bg-background"
										>
											<option value="low">Low</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
										</select>
									</div>
								</div>

								<div className="flex gap-2 justify-end pt-2">
									<Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleAddTask}>
										Create Task
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Today's Tasks Board */}
			<section className="flex-1">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold">Today's Tasks Board</h3>
					<div className="text-sm text-muted-foreground">
						Total: {todayTasks.length} tasks
					</div>
				</div>

				{todayTasks.length === 0 ? (
					<Card className="flex items-center justify-center h-64">
						<CardContent className="text-center p-6">
							<div className="text-4xl mb-4 opacity-50">🎯</div>
							<h4 className="font-semibold mb-2">No tasks for today</h4>
							<p className="text-muted-foreground mb-4">Add a task to get started with your day!</p>
							<Button onClick={() => setIsAddTaskOpen(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Create Your First Task
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
						<StatusColumn
							title="To Do"
							tasks={todoTasks}
							status="todo"
							icon={<Circle className="h-4 w-4 text-blue-500" />}
							color="blue"
						/>

						<StatusColumn
							title="In Progress"
							tasks={inProgressTasks}
							status="in-progress"
							icon={<PlayCircle className="h-4 w-4 text-yellow-500" />}
							color="yellow"
						/>

						<StatusColumn
							title="Done"
							tasks={doneTasks}
							status="done"
							icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
							color="green"
						/>
					</div>
				)}
			</section>
		</div>
	)
}