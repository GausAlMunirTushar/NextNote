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
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import { common, createLowlight } from 'lowlight';
import { Input } from "@/components/ui/input";
import { EditorHeader } from "@/components/editor-header";
import { SlashCommands } from "@/components/slash-commands";
import { BubbleMenu } from "@/components/bubble-menu";
import { FloatingMenu } from "@/components/floating-menu";
import { AIAssistant } from "@/components/ai-assistant";
import { Sparkles, MessageCircle, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";

const lowlight = createLowlight(common);

interface NextEditorProps {
	title: string;
	content: string;
	onTitleChange: (title: string) => void;
	onContentChange: (content: string) => void;
	documentId?: string;
	isCollaborative?: boolean;
}

export default function NextEditor({
	title,
	content,
	onTitleChange,
	onContentChange,
	documentId = "default",
	isCollaborative = false,
}: NextEditorProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [showSlashCommands, setShowSlashCommands] = useState(false);
	const [slashCommandQuery, setSlashCommandQuery] = useState("");
	const [showAIAssistant, setShowAIAssistant] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [collaborators] = useState([
		{ id: 1, name: "You", color: "#3b82f6", avatar: "Y" },
		{ id: 2, name: "Alex Chen", color: "#ef4444", avatar: "A" },
		{ id: 3, name: "Sam Taylor", color: "#10b981", avatar: "S" },
	]);

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
						class: "list-disc list-outside ml-6 space-y-2",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal list-outside ml-6 space-y-2",
					},
				},
				blockquote: {
					HTMLAttributes: {
						class: "border-l-4 border-primary/20 pl-4 italic my-4",
					},
				},
				code: {
					HTMLAttributes: {
						class: "bg-muted rounded px-1.5 py-0.5 font-mono text-sm",
					},
				},
			}),
			Underline.configure({
				HTMLAttributes: {
					class: "underline",
				},
			}),
			Heading.configure({
				levels: [1, 2, 3],
				HTMLAttributes: {
					class: "font-bold tracking-tight scroll-m-20",
				},
			}),
			TextStyle,
			Color.configure({
				types: ['textStyle'],
			}),
			Highlight.configure({
				multicolor: true,
				HTMLAttributes: {
					class: "rounded px-1 py-0.5",
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-primary underline underline-offset-4 cursor-pointer",
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
					class: "flex items-start gap-3",
				},
			}),
			Blockquote,
			CodeBlockLowlight.configure({
				lowlight,
				HTMLAttributes: {
					class: "bg-muted rounded-lg p-4 font-mono text-sm my-4 relative",
				},
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph', 'image'],
			}),
			Superscript,
			Subscript,
			Image.configure({
				HTMLAttributes: {
					class: "rounded-lg max-w-full h-auto my-4",
				},
			}),
			// Table extensions
			Table.configure({
				resizable: true,
				HTMLAttributes: {
					class: "border-collapse border border-border my-4",
				},
			}),
			TableRow.configure({
				HTMLAttributes: {
					class: "border-border",
				},
			}),
			TableHeader.configure({
				HTMLAttributes: {
					class: "border border-border bg-muted/50 px-4 py-2 text-left font-medium",
				},
			}),
			TableCell.configure({
				HTMLAttributes: {
					class: "border border-border px-4 py-2",
				},
			}),
			CharacterCount.configure({
				limit: 100000,
			}),
			Typography,
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
				class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[600px] prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed prose-pre:bg-muted prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-table:border prose-table:border-border prose-th:bg-muted/50 prose-th:font-medium prose-td:p-4 prose-th:p-4 prose-img:rounded-lg prose-img:my-4",
			},
			handleKeyDown: (view, event) => {
				// Slash commands
				if (event.key === "/") {
					setShowSlashCommands(true);
					return true;
				}

				// Markdown shortcuts
				if (event.key === " " && event.shiftKey) {
					const { from, to } = view.state.selection;
					const text = view.state.doc.textBetween(from, to);

					// Markdown shortcuts
					if (text === "```") {
						event.preventDefault();
						editor?.chain().focus().toggleCodeBlock().run();
						return true;
					}
					if (text === "***") {
						event.preventDefault();
						editor?.chain().focus().toggleBold().toggleItalic().run();
						return true;
					}
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

	const handleImageUpload = useCallback((file: File) => {
		if (!editor) return;

		// Simulate upload - in real app, upload to your storage
		const reader = new FileReader();
		reader.onload = (e) => {
			editor.chain().focus().setImage({ src: e.target?.result as string }).run();
		};
		reader.readAsDataURL(file);
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
		<div className="flex flex-col h-full bg-background">
			{/* Editor Toolbar */}
			<EditorHeader editor={editor} onImageUpload={handleImageUpload} />

			{/* Collaboration & AI Bar */}
			<div className="flex items-center justify-between px-6 py-2 border-b bg-muted/20">
				<div className="flex items-center gap-4">
					{/* Collaboration Status */}
					{isCollaborative && (
						<div className="flex items-center gap-2">
							<div className="flex -space-x-2">
								{collaborators.map((user) => (
									<div
										key={user.id}
										className="h-6 w-6 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white"
										style={{ backgroundColor: user.color }}
									>
										{user.avatar}
									</div>
								))}
							</div>
							<span className="text-sm text-muted-foreground">
								{collaborators.length} people editing
							</span>
						</div>
					)}

					{/* Character Count */}
					<div className="text-sm text-muted-foreground">
						{editor.storage.characterCount.characters()} characters
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* AI Assistant Toggle */}
					<Toggle
						pressed={showAIAssistant}
						onPressedChange={setShowAIAssistant}
						size="sm"
						className="h-8 px-3"
					>
						<Brain className="h-4 w-4 mr-2" />
						AI Assistant
					</Toggle>

					{/* Comments Toggle */}
					<Toggle
						pressed={showComments}
						onPressedChange={setShowComments}
						size="sm"
						className="h-8 px-3"
					>
						<MessageCircle className="h-4 w-4 mr-2" />
						Comments
					</Toggle>

					{/* Collaboration Badge */}
					{isCollaborative && (
						<Badge variant="secondary" className="gap-1">
							<Users className="h-3 w-3" />
							Live
						</Badge>
					)}
				</div>
			</div>

			{/* Editor Content */}
			<div className="flex-1 overflow-y-auto relative">
				<div className="max-w-5xl mx-auto px-6 py-8">
					{/* Title Input */}
					<Input
						value={title}
						onChange={(e) => onTitleChange(e.target.value)}
						placeholder="Untitled Document"
						className="text-4xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-8 placeholder:text-muted-foreground/50 h-auto py-2 bg-transparent"
					/>

					<div className="relative">
						{/* Bubble Menu for selected text */}
						{/* <BubbleMenu editor={editor} /> */}

						{/* Floating Menu for empty lines */}
						{/* <FloatingMenu editor={editor} /> */}

						{/* Editor Content */}
						<EditorContent
							editor={editor}
							className="min-h-[600px] focus:outline-none"
						/>

						{/* Slash Commands */}
						{showSlashCommands && (
							<SlashCommands
								query={slashCommandQuery}
								onQueryChange={setSlashCommandQuery}
								onCommand={handleSlashCommand}
							/>
						)}

						{/* AI Assistant */}
						{showAIAssistant && (
							<AIAssistant editor={editor} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}