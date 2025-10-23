"use client"

import Link from "next/link";
import { Trash2, Edit, Star, Calendar, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExportNoteDialog } from "@/components/export-note-dialog"
import type { Note } from "@/store/notes-store"
import { cn } from "@/lib/utils"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface NoteCardProps {
	note: Note
	onEdit: (note: Note) => void
	onDelete: (id: string) => void
	onToggleStar: (id: string) => void
	variant?: "grid" | "list"
}

export function NoteCard({ note, onEdit, onDelete, onToggleStar, variant = "grid" }: NoteCardProps) {
	const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})

	const relativeTime = getRelativeTime(new Date(note.updatedAt))

	const contentPreview = note.content.replace(/<[^>]*>/g, "").trim() || "No content"

	// List View Layout
	if (variant === "list") {
		return (
			<Card className="group  transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
				<div className="flex items-start p-4 gap-4">
					{/* Star Button - Always Visible in List */}
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 mt-1 flex-shrink-0"
						onClick={() => onToggleStar(note.id)}
					>
						<Star className={cn(
							"h-4 w-4 transition-all",
							note.starred
								? "fill-yellow-400 text-yellow-400 scale-110"
								: "text-muted-foreground hover:text-yellow-400"
						)} />
					</Button>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between mb-2 gap-2">
							<div className="min-w-0 flex-1">
								<h3 className="font-semibold text-lg truncate pr-2">{note.title}</h3>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs text-muted-foreground flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										{relativeTime}
									</span>
									{note.starred && (
										<Badge variant="secondary" className="text-xs px-1.5 py-0">
											Starred
										</Badge>
									)}
								</div>
							</div>
						</div>

						<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
							{contentPreview}
						</p>

						{/* Actions - Always Visible in List */}
						<div className="flex items-center gap-2">
							<Link href={`/notes/${note.id}`} passHref>
								<Button variant="outline" size="sm" className="h-8">
									<Edit className="h-3.5 w-3.5 mr-1.5" />
									View
								</Button>
							</Link>

							<ExportNoteDialog note={note} />

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreVertical className="h-3.5 w-3.5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => onToggleStar(note.id)}>
										<Star className={cn("h-4 w-4 mr-2", note.starred && "fill-yellow-400 text-yellow-400")} />
										{note.starred ? "Unstar" : "Star"}
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href={`/notes/${note.id}`}>
											<Edit className="h-4 w-4 mr-2" />
											View & Edit
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => onDelete(note.id)}
										className="text-destructive focus:text-destructive"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</Card>
		)
	}

	// Grid View Layout (Enhanced)
	return (
		<Card className="group transition-all duration-300 border-2 border-transparent hover:border-primary/20 h-full flex flex-col">
			<CardHeader className="pb-3 relative">
				{/* Star Button - Top Right */}
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-7 w-7 absolute top-3 right-3 transition-all",
						note.starred
							? "opacity-100 scale-110"
							: "opacity-0 group-hover:opacity-100"
					)}
					onClick={() => onToggleStar(note.id)}
				>
					<Star className={cn(
						"h-3.5 w-3.5 transition-all",
						note.starred && "fill-yellow-400 text-yellow-400"
					)} />
				</Button>

				{/* Title with gradient background when starred */}
				<div className={cn(
					"pr-8 transition-all",
					note.starred && "bg-gradient-to-r from-yellow-50 to-transparent rounded-lg -mx-2 px-2 py-1"
				)}>
					<h3 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">
						{note.title}
					</h3>
				</div>

				{/* Metadata */}
				<div className="flex items-center gap-2 mt-2">
					<span className="text-xs text-muted-foreground flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						{relativeTime}
					</span>
					{note.starred && (
						<Badge variant="secondary" className="text-xs px-1.5 py-0">
							Starred
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="pb-3 flex-1">
				<p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
					{contentPreview}
				</p>
			</CardContent>

			<CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
				<span className="text-xs text-muted-foreground">Updated: {formattedDate}</span>

				<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<ExportNoteDialog note={note} />

					<Link href={`/notes/${note.id}`} passHref>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							title="View note"
						>
							<Edit className="h-4 w-4" />
						</Button>
					</Link>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onToggleStar(note.id)}>
								<Star className={cn("h-4 w-4 mr-2", note.starred && "fill-yellow-400 text-yellow-400")} />
								{note.starred ? "Unstar" : "Star"}
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/notes/${note.id}`}>
									<Edit className="h-4 w-4 mr-2" />
									View & Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onDelete(note.id)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardFooter>
		</Card>
	)
}

// Helper function for relative time
function getRelativeTime(date: Date): string {
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diffInSeconds < 60) return 'Just now'
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
	if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}