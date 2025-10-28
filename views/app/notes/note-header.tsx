"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
	Save,
	Share2,
	MoreVertical,
	Users,
	Clock,
	Star,
	Download,
	Printer,
	Link2,
	Tag,
	Folder,
	Copy,
	FileText,
} from "lucide-react";
import ShareNote from "./share-note";

interface NoteHeaderProps {
	title: string;
	content: string;
	isSaved?: boolean;
	onSave: () => void;
	onTitleChange: (title: string) => void;
	onExport?: () => void;
	shared?: boolean;
	starred?: boolean;
	onStarToggle?: () => void;
	onAddLabel?: () => void;
	onMoveTo?: () => void;
	onCopyTo?: () => void;
}

export function NoteHeader({
	title,
	content,
	isSaved = false,
	onSave,
	onTitleChange,
	onExport,
	shared = false,
	starred = false,
	onStarToggle,
	onAddLabel,
	onMoveTo,
	onCopyTo,
}: NoteHeaderProps) {
	const { toast } = useToast();
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

	// 🔹 Update browser tab title dynamically
	useEffect(() => {
		document.title = title?.trim()
			? `${title}`
			: "Untitled – NextNote";
	}, [title]);

	const hasContent = title.trim() || content.trim();

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/share/note-${Date.now()}`);
			toast({
				title: "Link copied",
				description: "Shareable link copied to clipboard",
			});
		} catch {
			toast({
				title: "Copy failed",
				description: "Failed to copy link",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between bg-background h-14 px-5">
				{/* Left Section */}
				<div className="flex items-center gap-3 flex-1 min-w-0">
					{/* Icon */}
					<div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
						<FileText className="h-4 w-4 text-primary" />
					</div>

					{/* Title Input */}
					<div className="flex flex-col min-w-0 flex-1">
						<Input
							value={title}
							onChange={(e) => onTitleChange(e.target.value)}
							placeholder="Untitled document"
							className="h-7 px-0 border-none shadow-none bg-transparent text-base font-semibold text-foreground truncate focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{/* Status line under title */}
						{/* <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
							<Clock className="h-3 w-3" />
							<span>{isSaved ? "All changes saved" : "Saving..."}</span>
						</div> */}
					</div>
				</div>

				{/* Right Section */}
				<div className="flex items-center gap-2 flex-shrink-0">
					{/* Star Button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={onStarToggle}
						className={`h-9 w-9 ${starred ? "text-yellow-500" : "text-muted-foreground"
							}`}
					>
						<Star className={`h-4 w-4 ${starred ? "fill-current" : ""}`} />
					</Button>

					{/* Share Button */}
					{hasContent && (
						<Button
							variant="outline"
							size="sm"
							className="h-9 px-4 text-sm font-medium flex items-center gap-2 rounded-lg"
							onClick={() => setIsShareDialogOpen(true)}
						>
							<Share2 className="h-4 w-4" />
							<span>Share</span>
						</Button>
					)}

					{/* Save Button */}
					<Button
						onClick={onSave}
						size="sm"
						disabled={!hasContent || isSaved}
						className="h-9 px-4 text-sm font-medium rounded-lg"
					>
						<Save className="h-4 w-4 mr-2" />
						{isSaved ? "Saved" : "Save"}
					</Button>

					{/* More Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 text-muted-foreground"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end" className="w-52 text-sm">
							{/* File Actions */}
							<DropdownMenuItem onClick={onAddLabel}>
								<Tag className="h-4 w-4 mr-2" /> Add label
							</DropdownMenuItem>
							<DropdownMenuItem onClick={onMoveTo}>
								<Folder className="h-4 w-4 mr-2" /> Move to folder
							</DropdownMenuItem>
							<DropdownMenuItem onClick={onCopyTo}>
								<Copy className="h-4 w-4 mr-2" /> Duplicate
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							{/* Export */}
							<DropdownMenuItem onClick={onExport}>
								<Download className="h-4 w-4 mr-2" /> Export as TXT
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => window.print()}>
								<Printer className="h-4 w-4 mr-2" /> Print
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							{/* Share / Link */}
							<DropdownMenuItem onClick={handleCopyLink}>
								<Link2 className="h-4 w-4 mr-2" /> Copy link
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setIsShareDialogOpen(true)}
							>
								<Users className="h-4 w-4 mr-2" /> Share settings
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Share Dialog */}
			<ShareNote
				open={isShareDialogOpen}
				onOpenChange={setIsShareDialogOpen}
				title={title}
				content={content}
				onCopyLink={handleCopyLink}
			/>
		</>
	);
}
