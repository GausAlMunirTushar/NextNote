// app/notes/[noteId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNotesStore } from "@/store/notes-store";
import { useToast } from "@/hooks/use-toast";
import { NoteHeader } from "@/views/app/notes/note-header";
import NextEditor from "@/components/next-editor";

export default function NotePage() {
	const router = useRouter();
	const { toast } = useToast();
	const { noteId } = useParams();
	const { notes, updateNote, addNote } = useNotesStore();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSaved, setIsSaved] = useState(true);
	const [starred, setStarred] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const noteIdStr = Array.isArray(noteId) ? noteId[0] : noteId;

	useEffect(() => {
		if (noteIdStr === "new") {
			// Create new note and redirect to its ID
			const newNote = addNote({
				title: "",
				content: "",
				labels: [],
				starred: false,
				folderId: null,
			});

			// Redirect to the actual note ID
			router.replace(`/notes/${newNote.id}`);
		} else {
			// Load existing note
			const note = notes.find((n) => n.id === noteIdStr);
			if (note) {
				setTitle(note.title);
				setContent(note.content);
				setStarred(note.starred);
				setIsLoading(false);
			} else {
				toast({
					title: "Note not found",
					description: "The note you are looking for does not exist.",
					variant: "destructive",
				});
				router.push("/notes");
			}
		}
	}, [noteIdStr, notes, router, toast, addNote]);

	// Auto-save functionality
	useEffect(() => {
		if (!isLoading && noteIdStr && noteIdStr !== "new") {
			const timeoutId = setTimeout(() => {
				updateNote(noteIdStr, {
					title: title.trim() || "",
					content,
					starred,
				});
				setIsSaved(true);
			}, 1000);

			return () => clearTimeout(timeoutId);
		}
	}, [title, content, starred, noteIdStr, updateNote, isLoading]);

	const handleManualSave = () => {
		if (!noteIdStr || noteIdStr === "new") return;

		updateNote(noteIdStr, {
			title: title.trim() || "Untitled Document",
			content,
			starred,
		});

		setIsSaved(true);
		toast({
			title: "Note saved!",
			description: "Your note has been saved successfully.",
		});
	};

	const handleExport = () => {
		const blob = new Blob([`# ${title}\n\n${content.replace(/<[^>]*>/g, '')}`], {
			type: 'text/plain'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${title || 'untitled'}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast({
			title: "Exported!",
			description: "Note exported as text file.",
		});
	};

	const toggleStar = () => {
		setStarred(!starred);
		setIsSaved(false);
	};

	const handleAddLabel = () => {
		toast({
			title: "Add label",
			description: "Label functionality coming soon",
		});
	};

	const handleMoveTo = () => {
		toast({
			title: "Move to",
			description: "Move functionality coming soon",
		});
	};

	const handleCopyTo = () => {
		toast({
			title: "Copy to",
			description: "Copy functionality coming soon",
		});
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
			<NoteHeader
				title={title}
				content={content}
				isSaved={isSaved}
				onSave={handleManualSave}
				onTitleChange={(newTitle) => {
					setTitle(newTitle);
					setIsSaved(false);
				}}
				onExport={handleExport}
				starred={starred}
				onStarToggle={toggleStar}
				onAddLabel={handleAddLabel}
				onMoveTo={handleMoveTo}
				onCopyTo={handleCopyTo}
			/>

			<div className="flex-1 overflow-hidden">
				<NextEditor
					title={title}
					content={content}
					onTitleChange={(newTitle) => {
						setTitle(newTitle);
						setIsSaved(false);
					}}
					onContentChange={(newContent) => {
						setContent(newContent);
						setIsSaved(false);
					}}
					isCollaborative={true}
					documentId={noteIdStr}
				/>
			</div>
		</div>
	);
}