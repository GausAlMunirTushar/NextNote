"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileText, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteCardProps {
	id: string;
	title: string;
	icon?: React.ReactNode;
	coverColor?: string;
	updatedAt?: string;
	author?: string;
	starred?: boolean;
}

export default function NoteCard({
	id,
	title,
	icon,
	coverColor,
	updatedAt,
	author,
	starred,
}: NoteCardProps) {
	const router = useRouter();

	return (
		<div
			onClick={() => router.push(`/notes/${id}`)}
			className={cn(
				"group relative flex flex-col justify-between w-56 h-40 p-4 rounded-2xl border border-border/40 cursor-pointer transition-all duration-200",
				"hover:shadow-lg hover:-translate-y-1 bg-card hover:bg-accent/30"
			)}
		>
			<div className="flex items-start justify-between">
				<div
					className="w-8 h-8 rounded-md flex items-center justify-center"
					style={{ backgroundColor: coverColor || "#f5f5f5" }}
				>
					{icon || <FileText className="h-4 w-4 text-muted-foreground" />}
				</div>
				{starred && (
					<Star className="h-4 w-4 text-yellow-500 fill-yellow-500 opacity-80" />
				)}
			</div>

			<h3 className="font-medium text-sm mt-3 line-clamp-2">{title}</h3>

			<div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
				<div className="flex items-center gap-1.5">
					<Image
						src="/avatars/user.png"
						alt="Author"
						width={16}
						height={16}
						className="rounded-full"
					/>
					<span>{author || "You"}</span>
				</div>
				<span>{updatedAt}</span>
			</div>
		</div>
	);
}
