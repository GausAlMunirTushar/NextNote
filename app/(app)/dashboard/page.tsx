// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDashboardStore } from "@/store/dashboard-store"
import { useNotesStore } from "@/store/notes-store"
import { useTasksStore } from "@/store/tasks-store"
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
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  const { stats, getDashboardStats, getProductivityStats } = useDashboardStore()
  const { getRecentNotes } = useNotesStore()
  const { getTodayTasks } = useTasksStore()

  useEffect(() => {
    // Load all stats
    getDashboardStats()
    setIsLoading(false)
  }, [getDashboardStats])

  const productivityStats = getProductivityStats()
  const recentNotes = getRecentNotes(5)
  const todayTasks = getTodayTasks()

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    color = "blue",
    onClick 
  }: {
    title: string
    value: number
    icon: any
    description: string
    color?: "blue" | "green" | "yellow" | "red" | "purple"
    onClick?: () => void
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
      green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
      yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300",
      red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300",
      purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300"
    }

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${onClick ? 'hover:scale-[1.02]' : ''}`}
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
    )
  }

  const ProductivityMetric = ({ 
    label, 
    value, 
    change 
  }: {
    label: string
    value: number
    change: number
  }) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}%</p>
      </div>
      <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`h-4 w-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your productivity overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
          <Button onClick={() => router.push("/tasks")}>
            <CheckSquare className="h-4 w-4 mr-2" />
            View Tasks
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Notes
            </CardTitle>
            <CardDescription>Your most recently updated notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notes yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => router.push("/new")}
                  >
                    Create your first note
                  </Button>
                </div>
              ) : (
                recentNotes.map(note => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/notes/${note.id}`)}
                  >
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{note.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {note.starred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Productivity Metrics */}
        <Card>
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

            {/* Writing Streak */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                  <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold">{stats.writingStreak} day streak! 🔥</p>
                  <p className="text-sm text-muted-foreground">Keep up the great work!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription>Tasks due today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/tasks/${task.id}`)}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'done' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Folder Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Folder Usage
            </CardTitle>
            <CardDescription>Most used folders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.mostUsedFolders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No folders yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => router.push("/folders")}
                  >
                    Create folders
                  </Button>
                </div>
              ) : (
                stats.mostUsedFolders.map((folder, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push("/folders")}
                  >
                    <Folder className="h-4 w-4" style={{ color: folder.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{folder.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(folder.count / stats.totalNotes) * 100}%`,
                              backgroundColor: folder.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {folder.count} notes
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
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
  )
}