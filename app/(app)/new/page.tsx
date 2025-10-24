"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useNotesStore } from "@/store/notes-store"
import { useToast } from "@/hooks/use-toast"
import { Save, X, Share2, Copy, Download, Mail } from "lucide-react"
import NoteEditor from "@/components/note-editor"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function NewNotePage() {
	const router = useRouter()
	const { toast } = useToast()
	const addNote = useNotesStore((state) => state.addNote)
	const shareNote = useNotesStore((state) => state.shareNote)
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [savedNoteId, setSavedNoteId] = useState<string | null>(null)
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
	const [shareUrl, setShareUrl] = useState("")

	// const handleSave = () => {
	// 	if (!title.trim() && !content.trim()) {
	// 		toast({
	// 			title: "Empty note",
	// 			description: "Please add some content before saving.",
	// 			variant: "destructive",
	// 		})
	// 		return
	// 	}

	// 	addNote({
	// 		title: title || "Untitled Document",
	// 		content,
	// 		labels: [],
	// 		starred: false,
	// 	})

	// 	toast({
	// 		title: "Note saved!",
	// 		description: "Your note has been saved successfully.",
	// 	})

	// 	router.push("/notes")
	// }
	const handleSave = () => {
		if (!title.trim() && !content.trim()) {
			toast({
				title: "Empty note",
				description: "Please add some content before saving.",
				variant: "destructive",
			})
			return
		}

		// Create new note
		const newNote = {
			title: title || "Untitled Document",
			content,
			labels: [],
			starred: false,
		}

		addNote(newNote)

		// Get the latest note ID (this would need to be adjusted based on your store implementation)
		const notes = useNotesStore.getState().notes
		const latestNote = notes[notes.length - 1]
		setSavedNoteId(latestNote.id)

		toast({
			title: "Note saved!",
			description: "Your note has been saved successfully.",
		})

		// Don't redirect immediately if user might want to share
		// router.push("/notes")
	}

	const handleSaveAndShare = () => {
		handleSave()
		if (savedNoteId) {
			generateShareLink()
			setIsShareDialogOpen(true)
		}
	}

	const generateShareLink = () => {
		if (savedNoteId) {
			const url = shareNote(savedNoteId)
			setShareUrl(url)
		}
	}

	const copyShareLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			toast({
				title: "Link copied!",
				description: "Shareable link copied to clipboard.",
			})
		} catch (err) {
			toast({
				title: "Copy failed",
				description: "Failed to copy link to clipboard.",
				variant: "destructive",
			})
		}
	}

	const exportAsText = () => {
		const blob = new Blob([`# ${title}\n\n${content.replace(/<[^>]*>/g, '')}`], {
			type: 'text/plain'
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${title || 'untitled'}.txt`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)

		toast({
			title: "Exported!",
			description: "Note exported as text file.",
		})
	}

	const shareViaEmail = () => {
		const subject = encodeURIComponent(title || "Check out this note")
		const body = encodeURIComponent(`Title: ${title}\n\nContent: ${content.replace(/<[^>]*>/g, '')}`)
		window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
	}

	const isNoteSaved = !!savedNoteId
	const hasContent = title.trim() || content.trim()

	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
				<h2 className="text-xl sm:text-2xl font-bold">
					{title.trim() ? title : "Untitled Document"}
				</h2>
				<div className="flex gap-2 w-full sm:w-auto">
					<Button
						variant="outline"
						onClick={() => router.push("/notes")}
						className="flex-1 sm:flex-none"
						size="sm"
					>
						<X className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">Cancel</span>
					</Button>
					{/* Share Dropdown */}
					{hasContent && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="flex-1 sm:flex-none">
									<Share2 className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">Share</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleSaveAndShare}>
									<Copy className="h-4 w-4 mr-2" />
									Copy Shareable Link
								</DropdownMenuItem>
								<DropdownMenuItem onClick={exportAsText}>
									<Download className="h-4 w-4 mr-2" />
									Export as Text
								</DropdownMenuItem>
								<DropdownMenuItem onClick={shareViaEmail}>
									<Mail className="h-4 w-4 mr-2" />
									Share via Email
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Save Button */}
					<Button
						onClick={handleSave}
						className="flex-1 sm:flex-none"
						size="sm"
						disabled={!hasContent}
					>
						<Save className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">
							{isNoteSaved ? 'Update' : 'Save Note'}
						</span>
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-hidden bg-card rounded-lg">
				<NoteEditor title={title} content={content} onTitleChange={setTitle} onContentChange={setContent} />
			</div>
			{/* Share Dialog */}
			<Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Share Note</DialogTitle>
						<DialogDescription>
							Share this note with others using the link below.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="flex gap-2">
							<Input
								value={shareUrl}
								readOnly
								placeholder="Generating share link..."
							/>
							<Button onClick={copyShareLink} size="sm">
								<Copy className="h-4 w-4" />
							</Button>
						</div>

						<div className="flex gap-2 justify-end">
							<Button
								variant="outline"
								onClick={() => setIsShareDialogOpen(false)}
							>
								Close
							</Button>
							<Button onClick={() => router.push("/notes")}>
								View All Notes
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
