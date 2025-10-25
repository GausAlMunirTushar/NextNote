import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Label {
	id: string;
	name: string;
	color: string;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	labels: string[];
	folderId: string | null; // NEW: Add folder reference
	createdAt: string;
	updatedAt: string;
	starred: boolean;
}

interface NotesStore {
	notes: Note[];
	labels: Label[];
	
	// Note CRUD (KEEP EXISTING)
	addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
	updateNote: (id: string, note: Partial<Note>) => void;
	deleteNote: (id: string) => void;
	
	// Labels (KEEP EXISTING)
	addLabel: (label: Omit<Label, "id">) => void;
	deleteLabel: (id: string) => void;
	
	// Filters (KEEP EXISTING)
	filterNotesByLabel: (labelId: string) => Note[];
	sortNotesByDate: (order: "asc" | "desc") => Note[];
	
	// Sharing (KEEP EXISTING)
	shareNote: (id: string) => string;
	getShareableNote: (id: string) => { title: string; content: string } | null;
	
	// NEW: Folder-related functions
	getNotesByFolder: (folderId: string | null) => Note[];
	getStarredNotes: () => Note[];
	getRecentNotes: (limit?: number) => Note[];
	searchNotes: (query: string) => Note[];
	moveNoteToFolder: (noteId: string, folderId: string | null) => void;
}

export const useNotesStore = create<NotesStore>()(
	persist(
		(set, get) => ({
			notes: [],
			labels: [],
			
			// KEEP EXISTING: Note CRUD
			addNote: (note) => {
				set((state) => ({
					notes: [
						...state.notes,
						{
							...note,
							id: crypto.randomUUID(),
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					],
				}));
			},
			updateNote: (id, note) => {
				set((state) => ({
					notes: state.notes.map((n) =>
						n.id === id
							? {
									...n,
									...note,
									updatedAt: new Date().toISOString(),
							  }
							: n
					),
				}));
			},
			deleteNote: (id) => {
				set((state) => ({
					notes: state.notes.filter((n) => n.id !== id),
				}));
			},
			
			// KEEP EXISTING: Labels
			addLabel: (label) => {
				set((state) => ({
					labels: [
						...state.labels,
						{ ...label, id: crypto.randomUUID() },
					],
				}));
			},
			deleteLabel: (id) => {
				set((state) => ({
					labels: state.labels.filter((l) => l.id !== id),
				}));
			},
			
			// KEEP EXISTING: Filters
			filterNotesByLabel: (labelId: string): Note[] => {
				const state = get();
				return state.notes.filter((note) =>
					note.labels.includes(labelId)
				);
			},
			sortNotesByDate: (order: "asc" | "desc"): Note[] => {
				const state = get();
				return [...state.notes].sort((a, b) =>
					order === "asc"
						? new Date(a.updatedAt).getTime() -
						  new Date(b.updatedAt).getTime()
						: new Date(b.updatedAt).getTime() -
						  new Date(a.updatedAt).getTime()
				);
			},
			
			// KEEP EXISTING: Sharing
			shareNote: (id: string) => {
				return `${window.location.origin}/notes/${id}`;
			},
			getShareableNote: (id: string) => {
				const note = get().notes.find((n) => n.id === id);
				if (!note) return null;
				return {
					title: note.title,
					content: note.content,
				};
			},
			
			// NEW: Folder-related functions
			getNotesByFolder: (folderId: string | null): Note[] => {
				const state = get();
				return state.notes.filter(note => note.folderId === folderId);
			},
			
			getStarredNotes: (): Note[] => {
				const state = get();
				return state.notes.filter(note => note.starred);
			},
			
			getRecentNotes: (limit: number = 10): Note[] => {
				const state = get();
				return [...state.notes]
					.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
					.slice(0, limit);
			},
			
			searchNotes: (query: string): Note[] => {
				const state = get();
				const lowercaseQuery = query.toLowerCase();
				return state.notes.filter(note =>
					note.title.toLowerCase().includes(lowercaseQuery) ||
					note.content.toLowerCase().includes(lowercaseQuery)
				);
			},
			
			moveNoteToFolder: (noteId: string, folderId: string | null) => {
				set((state) => ({
					notes: state.notes.map((n) =>
						n.id === noteId
							? {
									...n,
									folderId,
									updatedAt: new Date().toISOString(),
							  }
							: n
					),
				}));
			},
		}),
		{
			name: "nextnote-storage",
		}
	)
);