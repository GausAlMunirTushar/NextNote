"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NoteEditor from "@/components/note-editor"
import { useNotesStore } from "@/store/notes-store";
import { useToast } from "@/hooks/use-toast";
import { Save, X, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditNotePage() {
	const router = useRouter();
	const { toast } = useToast();
	const { noteId } = useParams();
	const { notes, updateNote } = useNotesStore();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	// Ensure noteId is a string
	const noteIdStr = Array.isArray(noteId) ? noteId[0] : noteId;

	// Fetch the note data by noteId
	useEffect(() => {
		if (noteIdStr) {
			if (noteIdStr === "new") {
				// This is a new note, initialize with empty values
				setTitle("");
				setContent("");
				setIsLoading(false);
			} else {
				// This is an existing note, find it
				const note = notes.find((n) => n.id === noteIdStr);
				if (note) {
					setTitle(note.title);
					setContent(note.content);
					setIsLoading(false);
				} else {
					toast({
						title: "Note not found",
						description: "The note you are trying to edit does not exist.",
						variant: "destructive",
					});
					router.push("/notes");
				}
			}
		}
	}, [noteIdStr, notes, router, toast]);

	const handleSave = () => {
		if (!title.trim()) {
			toast({
				title: "Missing title",
				description: "Please add a title before saving.",
				variant: "destructive",
			});
			return;
		}

		if (noteIdStr === "new") {
			// Create new note
			// You'll need to implement addNote functionality here
			toast({
				title: "Create new note",
				description: "New note creation would be implemented here.",
			});
		} else {
			// Update existing note
			updateNote(noteIdStr, {
				title: title.trim(),
				content: content.trim(),
				updatedAt: new Date().toISOString()
			});

			toast({
				title: "Note updated",
				description: "Your note has been updated successfully.",
			});

			router.push("/notes");
		}
	};

	if (isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-center">
					<p>Loading note...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.push("/notes")}
						className="h-8 w-8"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h2 className="text-xl sm:text-2xl font-bold">
						{noteIdStr === "new" ? "Create New Note" : "Edit Note"}
					</h2>
				</div>
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

					<Button onClick={handleSave} className="flex-1 sm:flex-none" size="sm">
						<Save className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">
							{noteIdStr === "new" ? "Create Note" : "Save Note"}
						</span>
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-hidden bg-card rounded-lg">
				<NoteEditor
					title={title}
					content={content}
					onTitleChange={setTitle}
					onContentChange={setContent}
				/>
			</div>
		</div>
	);
}