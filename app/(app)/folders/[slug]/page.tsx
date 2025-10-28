
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useFoldersStore } from "@/store/folders-store"
import { useNotesStore } from "@/store/notes-store"
import { ArrowLeft, Plus, Folder, FileText, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FolderPage() {
	const params = useParams()
	const router = useRouter()
	const { toast } = useToast()
	const { getFolderBySlug } = useFoldersStore()
	const { getNotesByFolder, addNote } = useNotesStore()

	const [folder, setFolder] = useState<any>(null)
	const [notes, setNotes] = useState<any[]>([])
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() => {
		const foundFolder = getFolderBySlug(params.slug as string)
		if (foundFolder) {
			setFolder(foundFolder)
			setNotes(getNotesByFolder(foundFolder.id))
		} else {
			toast({
				title: "Folder not found",
				description: "The requested folder could not be found.",
				variant: "destructive",
			})
			router.push("/notes")
		}
	}, [params.slug, getFolderBySlug, getNotesByFolder, router, toast])

	const filteredNotes = notes.filter(note =>
		note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		note.content.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const handleCreateNote = () => {
		if (!folder) return

		const newNote = {
			title: "",
			content: "",
			labels: [],
			folderId: folder.id,
			starred: false,
		}

		addNote(newNote)

		// Get the latest note (this would need adjustment in real implementation)
		const allNotes = useNotesStore.getState().notes
		const latestNote = allNotes[allNotes.length - 1]

		router.push(`/notes/${latestNote.id}`)
	}

	if (!folder) {
		return (
			<div className="flex items-center justify-center h-64">
				<p>Loading folder...</p>
			</div>
		)
	}

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="flex flex-col bg-background sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 px-4 h-14 border-b">
				<div className="flex items-center gap-4">
					{/* <Button variant="ghost" onClick={() => router.push("/notes")}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Notes
					</Button> */}
					<div>
						<h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
							<Folder className="h-4 w-4" style={{ color: folder.color }} />
							{folder.name}
						</h2>

					</div>
				</div>
				<div className="flex items-center gap-4">
					<Button size="sm" variant="ghost" onClick={() => router.push("/notes")}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Notes
					</Button>
					<Button size="sm" onClick={handleCreateNote}>
						<Plus className="h-4 w-4 mr-2" />
						New Note
					</Button>
				</div>


			</div>

			{/* Search */}
			<div className="mb-6 px-4">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search notes in this folder..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Notes Grid */}
			<div className="flex-1 px-4">
				{filteredNotes.length === 0 ? (
					<Card className="flex items-center justify-center h-64">
						<CardContent className="text-center p-6">
							<div className="text-4xl mb-4 opacity-50">📝</div>
							<h4 className="font-semibold mb-2">No notes in this folder</h4>
							<p className="text-muted-foreground mb-4">
								{searchTerm ? "No notes match your search." : "Create your first note in this folder."}
							</p>
							{!searchTerm && (
								<Button onClick={handleCreateNote}>
									<Plus className="h-4 w-4 mr-2" />
									Create First Note
								</Button>
							)}
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredNotes.map(note => (
							<Card
								key={note.id}
								className="cursor-pointer"
								onClick={() => router.push(`/notes/${note.id}`)}
							>
								<CardContent className="p-4">
									<div className="flex items-start gap-2 mb-2">
										<FileText className="h-4 w-4 mt-1 text-muted-foreground" />
										<h3 className="font-semibold line-clamp-2">{note.title}</h3>
									</div>
									<p className="text-sm text-muted-foreground line-clamp-3 mb-3">
										{note.content.replace(/<[^>]*>/g, '') || "No content"}
									</p>
									<div className="text-xs text-muted-foreground">
										Updated {new Date(note.updatedAt).toLocaleDateString()}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	)
}