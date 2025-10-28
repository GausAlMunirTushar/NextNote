// app/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotesStore } from "@/store/notes-store";
import { useToast } from "@/hooks/use-toast";
import { NoteHeader } from "@/views/app/notes/note-header";
import NextEditor from "@/components/next-editor";

export default function NewNotePage() {
	const router = useRouter();
	const { toast } = useToast();
	const addNote = useNotesStore((state) => state.addNote);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSaved, setIsSaved] = useState(false);
	const [starred, setStarred] = useState(false);

	const handleSave = () => {
		if (!title.trim() && !content.trim()) {
			toast({
				title: "Empty note",
				description: "Please add some content before saving.",
				variant: "destructive",
			});
			return;
		}

		addNote({
			title: title || "Untitled Document",
			content,
			labels: [],
			starred,
			folderId: "default",
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

	return (
		<div className="h-full flex flex-col">
			<NoteHeader
				title={title}
				content={content}
				isSaved={isSaved}
				onSave={handleSave}
				onTitleChange={setTitle}
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
					onTitleChange={setTitle}
					onContentChange={setContent}
					isCollaborative={true} // Enable collaborative features
					documentId="new-note"
				/>
			</div>
		</div>
	);
}