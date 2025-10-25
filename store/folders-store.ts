// store/folders-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Folder {
	id: string;
	name: string;
	slug: string;
	color: string;
	parentId: string | null;
	createdAt: string;
	updatedAt: string;
}

interface FoldersStore {
	folders: Folder[];

	// Folder CRUD
	addFolder: (
		folder: Omit<Folder, "id" | "createdAt" | "updatedAt" | "slug">
	) => void;
	updateFolder: (id: string, folder: Partial<Folder>) => void;
	deleteFolder: (id: string) => void;

	// Queries
	getFolderBySlug: (slug: string) => Folder | undefined;
	getSubfolders: (parentId: string | null) => Folder[];
	getFolderPath: (folderId: string) => Folder[];
	getAllFolders: () => Folder[];
	getFolderById: (id: string) => Folder | undefined;
}

const generateSlug = (name: string) => {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
};

export const useFoldersStore = create<FoldersStore>()(
	persist(
		(set, get) => ({
			folders: [],

			addFolder: (folder) => {
				set((state) => ({
					folders: [
						...state.folders,
						{
							...folder,
							id: crypto.randomUUID(),
							slug: generateSlug(folder.name),
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					],
				}));
			},

			updateFolder: (id, folder) => {
				set((state) => ({
					folders: state.folders.map((f) =>
						f.id === id
							? {
									...f,
									...folder,
									...(folder.name && {
										slug: generateSlug(folder.name),
									}),
									updatedAt: new Date().toISOString(),
							  }
							: f
					),
				}));
			},

			deleteFolder: (id) => {
				set((state) => ({
					folders: state.folders.filter((f) => f.id !== id),
				}));
			},

			getFolderBySlug: (slug: string) => {
				const state = get();
				return state.folders.find((f) => f.slug === slug);
			},

			getSubfolders: (parentId: string | null) => {
				const state = get();
				return state.folders.filter(
					(folder) => folder.parentId === parentId
				);
			},

			getFolderPath: (folderId: string) => {
				const state = get();
				const path: Folder[] = [];
				let currentFolder = state.folders.find(
					(f) => f.id === folderId
				);

				while (currentFolder) {
					path.unshift(currentFolder);
					currentFolder = currentFolder.parentId
						? state.folders.find(
								(f) => f.id === currentFolder.parentId!
						  )
						: undefined;
				}

				return path;
			},

			getAllFolders: () => {
				return get().folders;
			},

			getFolderById: (id: string) => {
				const state = get();
				return state.folders.find((f) => f.id === id);
			},
		}),
		{
			name: "nextnote-folders-storage",
		}
	)
);
