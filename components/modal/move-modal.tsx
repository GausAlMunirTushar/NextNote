
"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFoldersStore, Folder } from "@/store/folders-store";
import { useNotesStore } from "@/store/notes-store";
import { useToast } from "@/hooks/use-toast";
import { Search, Folder as FolderIcon, FolderOpen, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoveModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	noteId?: string;
	currentFolderId?: string | null;
}

export default function MoveModal({
	open,
	onOpenChange,
	noteId,
	currentFolderId = null,
}: MoveModalProps) {
	const { toast } = useToast();
	const { moveNoteToFolder } = useNotesStore();
	const { folders, getSubfolders, addFolder } = useFoldersStore();

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
	const [isCreatingFolder, setIsCreatingFolder] = useState(false);
	const [newFolderName, setNewFolderName] = useState("");

	// Filter folders based on search
	const filteredFolders = folders.filter(folder =>
		folder.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const rootFolders = getSubfolders(null);
	const selectedFolder = folders.find(f => f.id === selectedFolderId);

	const handleMove = () => {
		if (!noteId) return;

		moveNoteToFolder(noteId, selectedFolderId);

		toast({
			title: "Note moved",
			description: selectedFolder
				? `Moved to "${selectedFolder.name}"`
				: "Moved to All Notes",
		});

		onOpenChange(false);
		resetState();
	};

	const handleCreateFolder = () => {
		if (!newFolderName.trim()) return;

		addFolder({
			name: newFolderName.trim(),
			color: "#6b7280", // Default gray color
			parentId: null,
		});

		setNewFolderName("");
		setIsCreatingFolder(false);

		toast({
			title: "Folder created",
			description: `"${newFolderName}" folder has been created`,
		});
	};

	const resetState = () => {
		setSearchQuery("");
		setSelectedFolderId(currentFolderId);
		setIsCreatingFolder(false);
		setNewFolderName("");
	};

	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (!newOpen) {
			resetState();
		}
	};

	const renderFolderItem = (folder: Folder, level = 0) => {
		const subfolders = getSubfolders(folder.id);
		const isSelected = selectedFolderId === folder.id;

		return (
			<div key={folder.id}>
				<div
					className={cn(
						"flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
						isSelected && "bg-accent"
					)}
					onClick={() => setSelectedFolderId(folder.id)}
				>
					<div className="flex items-center gap-3 flex-1 min-w-0">
						<div
							className="flex items-center gap-2 flex-1 min-w-0"
							style={{ paddingLeft: `${level * 20}px` }}
						>
							{subfolders.length > 0 ? (
								<FolderOpen className="h-4 w-4" style={{ color: folder.color }} />
							) : (
								<FolderIcon className="h-4 w-4" style={{ color: folder.color }} />
							)}
							<span className="truncate">{folder.name}</span>
						</div>
						{isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
					</div>
				</div>

				{/* Recursively render subfolders */}
				{subfolders.map(subfolder => renderFolderItem(subfolder, level + 1))}
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Move to Folder</DialogTitle>
					<DialogDescription>
						Choose a destination folder for this note.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search folders..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>

					{/* Create Folder Button */}
					{!isCreatingFolder && (
						<Button
							variant="outline"
							className="w-full justify-start gap-2"
							onClick={() => setIsCreatingFolder(true)}
						>
							<Plus className="h-4 w-4" />
							Create new folder
						</Button>
					)}

					{/* Create Folder Input */}
					{isCreatingFolder && (
						<div className="flex gap-2">
							<Input
								placeholder="Folder name"
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.target.value)}
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") handleCreateFolder();
									if (e.key === "Escape") setIsCreatingFolder(false);
								}}
							/>
							<Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
								Create
							</Button>
						</div>
					)}

					{/* Folders List */}
					<ScrollArea className="h-64 rounded-md border">
						<div className="p-1">
							{/* All Notes Option */}
							<div
								className={cn(
									"flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
									selectedFolderId === null && "bg-accent"
								)}
								onClick={() => setSelectedFolderId(null)}
							>
								<div className="flex items-center gap-2 flex-1">
									<FolderIcon className="h-4 w-4 text-muted-foreground" />
									<span>All Notes</span>
								</div>
								{selectedFolderId === null && <Check className="h-4 w-4 text-primary" />}
							</div>

							{/* Folders Tree */}
							{filteredFolders.length > 0 ? (
								rootFolders.map(folder => renderFolderItem(folder))
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<FolderIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p>No folders found</p>
									<p className="text-sm">Create a new folder to get started</p>
								</div>
							)}
						</div>
					</ScrollArea>

					{/* Selected Folder Display */}
					{selectedFolder && (
						<div className="p-3 bg-muted rounded-lg">
							<p className="text-sm text-muted-foreground">Moving to:</p>
							<p className="font-medium flex items-center gap-2">
								<FolderIcon className="h-4 w-4" style={{ color: selectedFolder.color }} />
								{selectedFolder.name}
							</p>
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-2 justify-end">
						<Button
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleMove}
							disabled={selectedFolderId === currentFolderId}
						>
							Move Note
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}