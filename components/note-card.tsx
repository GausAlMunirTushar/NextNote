"use client"

import Link from "next/link";
import { Trash2, Edit, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExportNoteDialog } from "@/components/export-note-dialog"
import type { Note } from "@/store/notes-store"
import { cn } from "@/lib/utils"

interface NoteCardProps {
	note: Note
	onEdit: (note: Note) => void
	onDelete: (id: string) => void
	onToggleStar: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete, onToggleStar }: NoteCardProps) {
	const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})

	const contentPreview = note.content.replace(/<[^>]*>/g, "").trim() || "No content"

	return (
		<Card className="group hover:shadow-md transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<h3 className="font-semibold text-base sm:text-lg line-clamp-1">{note.title}</h3>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
						onClick={() => onToggleStar(note.id)}
					>
						<Star className={cn("h-4 w-4", note.starred && "fill-yellow-400 text-yellow-400")} />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="pb-3">
				<p className="text-sm text-muted-foreground line-clamp-3">{contentPreview}</p>
			</CardContent>
			<CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
				<span className="text-xs text-muted-foreground">Updated: {formattedDate}</span>
				<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<ExportNoteDialog note={note} />
					<Link href={`/notes/${note.id}`} passHref>
						<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(note)}>
							<Edit className="h-4 w-4" />
						</Button>
					</Link>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-destructive hover:text-destructive"
						onClick={() => onDelete(note.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}
