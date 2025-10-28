
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotesStore } from "@/store/notes-store";
import { useToast } from "@/hooks/use-toast";
import NoteEditor from "@/components/note-editor";
import { NoteHeader } from "@/views/app/notes/note-header";

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
			/>

			<div className="flex-1 overflow-hidden">
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