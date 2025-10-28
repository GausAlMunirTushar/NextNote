"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotesStore } from "@/store/notes-store";
import { Loader2 } from "lucide-react";

export default function NewNotePage() {
	const router = useRouter();
	const addNote = useNotesStore((state) => state.addNote);
	const [loadingText, setLoadingText] = useState("Creating your note...");

	useEffect(() => {
		try {
			setLoadingText("Setting up your new note...");

			// Instantly create and redirect
			const newNote = addNote({
				title: "",
				content: "",
				labels: [],
				folderId: null,
				starred: false,
			});

			setLoadingText("Redirecting...");
			router.replace(`/notes/${newNote.id}`);
		} catch (err) {
			setLoadingText("Something went wrong. Please retry.");
		}
	}, [addNote, router]);

	return (
		<div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="h-10 w-10 text-primary animate-spin drop-shadow-md" />
				<p className="text-muted-foreground text-lg transition-all duration-500">
					{loadingText}
				</p>
			</div>
		</div>
	);
}
