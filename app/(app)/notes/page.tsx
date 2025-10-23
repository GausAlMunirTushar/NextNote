"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, SortAsc, Plus, Filter, Grid3X3, List, Star, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NoteCard } from "@/components/note-card"
import { useNotesStore, type Note } from "@/store/notes-store"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AllNotesPage() {
	const router = useRouter()
	const { toast } = useToast()
	const { notes, deleteNote, updateNote } = useNotesStore()
	const [searchQuery, setSearchQuery] = useState("")
	const [sortBy, setSortBy] = useState("date-desc")
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
	const [filterStarred, setFilterStarred] = useState<"all" | "starred">("all")

	// Memoized filtered and sorted notes for better performance
	const filteredNotes = useMemo(() => {
		let filtered = notes.filter(
			(note) =>
				note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.content.toLowerCase().includes(searchQuery.toLowerCase())
		)

		// Filter by starred status
		if (filterStarred === "starred") {
			filtered = filtered.filter(note => note.starred)
		}

		// Sort notes
		return filtered.sort((a, b) => {
			switch (sortBy) {
				case "date-desc":
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				case "date-asc":
					return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
				case "title-asc":
					return a.title.localeCompare(b.title)
				case "title-desc":
					return b.title.localeCompare(a.title)
				default:
					return 0
			}
		})
	}, [notes, searchQuery, sortBy, filterStarred])

	const stats = useMemo(() => {
		const total = notes.length
		const starred = notes.filter(note => note.starred).length
		const recent = notes.filter(note => {
			const noteDate = new Date(note.updatedAt)
			const weekAgo = new Date()
			weekAgo.setDate(weekAgo.getDate() - 7)
			return noteDate > weekAgo
		}).length

		return { total, starred, recent }
	}, [notes])

	const handleEdit = (note: Note) => {
		router.push(`/notes/${note.id}`)
	}

	const handleDelete = (id: string) => {
		deleteNote(id)
		toast({
			title: "Note deleted",
			description: "Your note has been deleted successfully.",
		})
	}

	const handleToggleStar = (id: string) => {
		const note = notes.find((n) => n.id === id)
		if (note) {
			updateNote(id, { starred: !note.starred })
			toast({
				title: !note.starred ? "Note starred" : "Note unstarred",
				description: !note.starred ? "Note added to favorites" : "Note removed from favorites",
			})
		}
	}

	const handleQuickAction = (action: string) => {
		switch (action) {
			case "starred":
				setFilterStarred(filterStarred === "starred" ? "all" : "starred")
				break
			case "recent":
				setSortBy("date-desc")
				break
			default:
				break
		}
	}

	return (
		<div className="min-h-screen bg-background rounded-lg">
			{/* Header Section */}
			<div className="border-b bg-card/50 backdrop-blur-sm top-0 z-10 rounded-lg">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">All Notes</h1>
							<p className="text-muted-foreground mt-1">
								{filteredNotes.length} of {notes.length} notes
							</p>
						</div>

						<Button
							onClick={() => router.push("/new")}
							size="lg"
							className=" transition-all duration-200"
						>
							<Plus className="h-5 w-5 mr-2" />
							Create New Note
						</Button>
					</div>
				</div>
			</div>

			{/* Stats & Quick Actions */}
			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card
						className="cursor-pointer  border-2 data-[active=true]:border-primary"
						data-active={filterStarred === "starred"}
						onClick={() => handleQuickAction("starred")}
					>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Starred</p>
									<p className="text-2xl font-bold">{stats.starred}</p>
								</div>
								<Star className={`h-8 w-8 ${filterStarred === "starred" ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
							</div>
						</CardContent>
					</Card>

					<Card
						className="cursor-pointer "
						onClick={() => handleQuickAction("recent")}
					>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Recent</p>
									<p className="text-2xl font-bold">{stats.recent}</p>
								</div>
								<Calendar className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>

					<Card className="">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total</p>
									<p className="text-2xl font-bold">{stats.total}</p>
								</div>
								<div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
									<span className="text-primary-foreground text-sm font-bold">{stats.total}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Controls Section */}
				<div className="flex flex-col lg:flex-row gap-4 mb-8">
					{/* Search */}
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search in titles and content..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 h-11 text-base"
							/>
						</div>
					</div>

					{/* Filters and View Controls */}
					<div className="flex gap-2">
						{/* View Mode Toggle */}
						<Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
							<TabsList className="grid w-20 grid-cols-2">
								<TabsTrigger value="grid" >
									<Grid3X3 className="h-4 w-4" />
								</TabsTrigger>
								<TabsTrigger value="list" >
									<List className="h-4 w-4" />
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Starred Filter */}
						<Button
							variant={filterStarred === "starred" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterStarred(filterStarred === "starred" ? "all" : "starred")}
						>
							<Star className={`h-4 w-4 mr-2 ${filterStarred === "starred" ? "fill-background" : ""}`} />
							Starred
						</Button>

						{/* Sort Dropdown */}
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-40">
								<SortAsc className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="date-desc">Newest first</SelectItem>
								<SelectItem value="date-asc">Oldest first</SelectItem>
								<SelectItem value="title-asc">Title (A-Z)</SelectItem>
								<SelectItem value="title-desc">Title (Z-A)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Active Filters Display */}
				{(searchQuery || filterStarred !== "all") && (
					<div className="flex items-center gap-2 mb-6">
						<span className="text-sm text-muted-foreground">Active filters:</span>
						{searchQuery && (
							<Badge variant="secondary" className="flex items-center gap-1">
								Search: "{searchQuery}"
								<button
									onClick={() => setSearchQuery("")}
									className="ml-1 hover:text-destructive"
								>
									×
								</button>
							</Badge>
						)}
						{filterStarred === "starred" && (
							<Badge variant="secondary" className="flex items-center gap-1">
								Starred only
								<button
									onClick={() => setFilterStarred("all")}
									className="ml-1 hover:text-destructive"
								>
									×
								</button>
							</Badge>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearchQuery("")
								setFilterStarred("all")
								setSortBy("date-desc")
							}}
						>
							Clear all
						</Button>
					</div>
				)}

				{/* Notes Grid/List */}
				{filteredNotes.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
							<Search className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="text-xl font-semibold mb-2">
							{searchQuery || filterStarred !== "all" ? "No notes found" : "No notes yet"}
						</h3>
						<p className="text-muted-foreground mb-6 max-w-md">
							{searchQuery
								? "Try adjusting your search or filters to find what you're looking for."
								: "Get started by creating your first note to organize your thoughts and ideas."
							}
						</p>
						{!searchQuery && (
							<Button onClick={() => router.push("/new")} size="lg">
								<Plus className="h-5 w-5 mr-2" />
								Create Your First Note
							</Button>
						)}
					</div>
				) : (
					<div className={`
            ${viewMode === "grid"
							? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
							: "space-y-4 max-w-4xl"
						}
          `}>
						{filteredNotes.map((note) => (
							<NoteCard
								key={note.id}
								note={note}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onToggleStar={handleToggleStar}
								variant={viewMode}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}