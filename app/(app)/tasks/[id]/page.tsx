// app/tasks/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useTasksStore } from "@/store/tasks-store"
import { ArrowLeft, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditTaskPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { tasks, updateTask } = useTasksStore()
  
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "todo" as "todo" | "in-progress" | "done"
  })

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === params.id)
    if (foundTask) {
      setTask({
        title: foundTask.title,
        description: foundTask.description,
        dueDate: foundTask.dueDate,
        priority: foundTask.priority,
        status: foundTask.status
      })
    } else {
      toast({
        title: "Task not found",
        description: "The requested task could not be found.",
        variant: "destructive",
      })
      router.push("/tasks")
    }
  }, [params.id, tasks, router, toast])

  const handleSave = () => {
    if (!task.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the task.",
        variant: "destructive",
      })
      return
    }

    updateTask(params.id as string, task)
    toast({
      title: "Task updated!",
      description: "Your task has been updated successfully.",
    })
    router.push(`/tasks/${params.id}`)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(`/tasks/${params.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Task
          </Button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Edit Task</h2>
            <p className="text-muted-foreground">Update your task details</p>
          </div>
        </div>
        
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Enter task title"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                placeholder="Enter task description"
                rows={6}
                className="mt-1 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value as "low" | "medium" | "high" })}
                className="w-full px-3 py-2 border rounded-md mt-1 bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value as "todo" | "in-progress" | "done" })}
                className="w-full px-3 py-2 border rounded-md mt-1 bg-background"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}