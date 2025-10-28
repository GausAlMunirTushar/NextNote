"use client";

import { useState } from "react";
import { useFoldersStore } from "@/store/folders-store";
import { Folder } from "@/store/folders-store";
import { FolderOpen, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FolderCard } from "@/views/app/folders/folder-card";
import { FolderEditor } from "@/views/app/folders/folder-editor";
import { FolderStats } from "@/views/app/folders/folder-stats";
import { FolderForm } from "@/views/app/folders/folder-form";

type FolderAction = {
	type: "create" | "edit" | "delete";
	folder?: Folder;
};

export default function FoldersPage() {
	const {
		folders,
		addFolder,
		updateFolder,
		deleteFolder,
		getSubfolders,
		getFolderPath,
	} = useFoldersStore();

	const [action, setAction] = useState<FolderAction | null>(null);
	const [editingFolder, setEditingFolder] = useState<string | null>(null);
	const [editName, setEditName] = useState("");
	const [editColor, setEditColor] = useState("#3b82f6");

	const rootFolders = getSubfolders(null);
	const nestedFolders = folders.length - rootFolders.length;

	const handleCreateFolder = (data: { name: string; parentId: string | null; color: string }) => {
		addFolder(data);
		setAction(null);
	};

	const handleUpdateFolder = (folderId: string, data: { name: string; color: string }) => {
		updateFolder(folderId, data);
		setEditingFolder(null);
		setEditName("");
		setEditColor("#3b82f6");
	};

	const handleDeleteFolder = (folder: Folder) => {
		deleteFolder(folder.id);
		setAction(null);
	};

	const startEdit = (folder: Folder) => {
		setEditingFolder(folder.id);
		setEditName(folder.name);
		setEditColor(folder.color);
	};

	const cancelEdit = () => {
		setEditingFolder(null);
		setEditName("");
		setEditColor("#3b82f6");
	};

	const saveEdit = () => {
		if (editingFolder && editName.trim()) {
			handleUpdateFolder(editingFolder, {
				name: editName.trim(),
				color: editColor,
			});
		}
	};

	const getFolderBreadcrumb = (folderId: string) => {
		const path = getFolderPath(folderId);
		return path.slice(0, -1).map(folder => folder.name).join(" / ");
	};

	const FolderTree = ({ parentId = null, level = 0 }: { parentId?: string | null; level?: number }) => {
		const subfolders = getSubfolders(parentId);

		return (
			<div className="space-y-3">
				{subfolders.map((folder) => {
					const subfolderCount = getSubfolders(folder.id).length;
					const breadcrumb = getFolderBreadcrumb(folder.id);
					const isEditing = editingFolder === folder.id;

					return (
						<div key={folder.id} className="space-y-3">
							<FolderCard
								folder={folder}
								breadcrumb={breadcrumb}
								subfolderCount={subfolderCount}
								onEdit={(folder) => startEdit(folder)}
								onDelete={(folder) => setAction({ type: "delete", folder })}
								level={level}
								isEditing={isEditing}
								editingContent={
									<FolderEditor
										folder={folder}
										name={editName}
										color={editColor}
										onNameChange={setEditName}
										onColorChange={setEditColor}
										onSave={saveEdit}
										onCancel={cancelEdit}
									/>
								}
							/>

							{/* Recursively render subfolders */}
							{subfolderCount > 0 && (
								<FolderTree parentId={folder.id} level={level + 1} />
							)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className="container mx-auto px-4 py-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<FolderOpen className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Folders</h1>
							<p className="text-muted-foreground text-sm lg:text-base">
								Organize your notes with folders and subfolders
							</p>
						</div>
					</div>
				</div>

				<Button
					onClick={() => setAction({ type: "create" })}
					className="gap-2 shrink-0"
				>
					<FolderPlus className="h-4 w-4" />
					New Folder
				</Button>
			</div>

			{/* Statistics */}
			{folders.length > 0 && (
				<FolderStats
					totalFolders={folders.length}
					rootFolders={rootFolders.length}
					nestedFolders={nestedFolders}
				/>
			)}

			{/* Folders List */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle>Your Folders</CardTitle>
					<CardDescription>
						{folders.length === 0
							? "Create your first folder to start organizing"
							: `Manage ${folders.length} folder${folders.length !== 1 ? 's' : ''}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{rootFolders.length === 0 ? (
						<div className="text-center py-12 space-y-4">
							<FolderOpen className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
							<div className="space-y-2">
								<h3 className="text-lg font-medium text-foreground">
									No folders yet
								</h3>
								<p className="text-muted-foreground max-w-sm mx-auto text-sm">
									Create your first folder to start organizing your notes and documents.
								</p>
							</div>
							<Button
								onClick={() => setAction({ type: "create" })}
								className="gap-2"
							>
								<FolderPlus className="h-4 w-4" />
								Create Your First Folder
							</Button>
						</div>
					) : (
						<FolderTree />
					)}
				</CardContent>
			</Card>

			{/* Create/Edit Folder Dialog */}
			<Dialog
				open={action?.type === "create" || action?.type === "edit"}
				onOpenChange={(open) => !open && setAction(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{action?.type === "create" ? "Create New Folder" : "Edit Folder"}
						</DialogTitle>
						<DialogDescription>
							{action?.type === "create"
								? "Add a new folder to organize your notes."
								: "Make changes to your folder."}
						</DialogDescription>
					</DialogHeader>

					<FolderForm
						folder={action?.type === "edit" ? action.folder : undefined}
						folders={folders}
						onSubmit={(data) => {
							if (action?.type === "create") {
								handleCreateFolder(data);
							} else if (action?.type === "edit" && action.folder) {
								handleUpdateFolder(action.folder.id, data);
								setAction(null);
							}
						}}
						onCancel={() => setAction(null)}
						mode={action?.type === "create" ? "create" : "edit"}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={action?.type === "delete"}
				onOpenChange={(open) => !open && setAction(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete Folder</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the folder "{action?.folder?.name}"?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>

					<div className="flex gap-3 justify-end">
						<Button
							variant="outline"
							onClick={() => setAction(null)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => action?.folder && handleDeleteFolder(action.folder)}
						>
							Delete Folder
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}