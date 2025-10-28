// components/next-editor.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from 'lowlight';
import { Input } from "@/components/ui/input";
import { EditorHeader } from "@/components/editor-header";
import { SlashCommands } from "@/components/slash-commands";
import { Sparkles } from "lucide-react";

const lowlight = createLowlight(common);

interface NextEditorProps {
	title: string;
	content: string;
	onTitleChange: (title: string) => void;
	onContentChange: (content: string) => void;
}

export default function NextEditor({
	title,
	content,
	onTitleChange,
	onContentChange,
}: NextEditorProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [showSlashCommands, setShowSlashCommands] = useState(false);
	const [slashCommandQuery, setSlashCommandQuery] = useState("");

	// Run once after hydration
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false,
				codeBlock: false,
				bulletList: {
					HTMLAttributes: {
						class: "list-disc list-outside ml-6",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal list-outside ml-6",
					},
				},
				blockquote: {
					HTMLAttributes: {
						class: "border-l-4 border-border pl-4 italic my-4",
					},
				},
			}),
			Underline,
			Heading.configure({
				levels: [1, 2, 3],
				HTMLAttributes: {
					class: "font-bold tracking-tight",
				},
			}),
			TextStyle,
			Color,
			Highlight.configure({
				multicolor: true,
				HTMLAttributes: {
					class: "rounded px-1 py-0.5",
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-blue-600 dark:text-blue-400 underline cursor-pointer",
				},
			}),
			TaskList.configure({
				HTMLAttributes: {
					class: "list-none space-y-2 my-4",
				},
			}),
			TaskItem.configure({
				nested: true,
				HTMLAttributes: {
					class: "flex items-start gap-2",
				},
			}),
			Blockquote,
			CodeBlockLowlight.configure({
				lowlight,
				HTMLAttributes: {
					class: "bg-muted rounded-lg p-4 font-mono text-sm my-4",
				},
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Superscript,
			Subscript,
			Placeholder.configure({
				placeholder: "Type '/' for commands, or start writing...",
				emptyEditorClass: "is-editor-empty",
			}),
		],
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onContentChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed max-w-none focus:outline-none min-h-[500px] prose-pre:bg-muted prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-1",
			},
			handleKeyDown: (view, event) => {
				if (event.key === "/") {
					setShowSlashCommands(true);
					return true;
				}
				if (showSlashCommands) {
					if (event.key === "Escape") {
						setShowSlashCommands(false);
						return true;
					}
				}
				return false;
			},
		},
	});

	// Sync external content updates
	useEffect(() => {
		if (editor && content && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	const handleSlashCommand = useCallback((command: any) => {
		if (!editor) return;
		command.command({ editor });
		setShowSlashCommands(false);
		setSlashCommandQuery("");
	}, [editor]);

	if (!isMounted || !editor) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-muted-foreground">
					<Sparkles className="h-5 w-5 animate-pulse" />
					<span>Loading editor...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-background ">
			{/* Editor Header */}
			{/* <EditorHeader editor={editor} /> */}

			{/* Editor Content */}
			<div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-background to-muted/20 relative">
				<Input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="Untitled Document"
					className="text-5xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-6 placeholder:text-muted-foreground/50 h-auto py-2"
				/>

				<div className="relative">
					<EditorContent
						editor={editor}
						className="min-h-[500px] focus:outline-none"
					/>

					{/* Slash Commands */}
					{showSlashCommands && (
						<SlashCommands
							query={slashCommandQuery}
							onQueryChange={setSlashCommandQuery}
							onCommand={handleSlashCommand}
						/>
					)}
				</div>
			</div>
		</div>
	);
}