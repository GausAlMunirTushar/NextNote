"use client"

import { useState, useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Heading from "@tiptap/extension-heading"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from 'lowlight'
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	List,
	ListOrdered,
	Undo,
	Redo,
	Link as LinkIcon,
	Palette,
	Highlighter,
	Quote,
	Code,
	CheckSquare,
	Heading1,
	Heading2,
	Heading3,
	Pilcrow,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

const lowlight = createLowlight(common)

interface NoteEditorProps {
	title: string
	content: string
	onTitleChange: (title: string) => void
	onContentChange: (content: string) => void
}

type Level = 1 | 2 | 3

export default function NoteEditor({
	title,
	content,
	onTitleChange,
	onContentChange,
}: NoteEditorProps) {
	const [selectedFormat, setSelectedFormat] = useState("normal")
	const [selectedFont, setSelectedFont] = useState("geist")
	const [isMounted, setIsMounted] = useState(false)
	const [linkUrl, setLinkUrl] = useState("")
	const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)

	// Run once after hydration
	useEffect(() => {
		setIsMounted(true)
	}, [])

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false,
				codeBlock: false,
			}),
			Underline,
			Heading.configure({ levels: [1, 2, 3] }),
			TextStyle,
			Color,
			Highlight.configure({ multicolor: true }),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-blue-500 underline",
				},
			}),
			TaskList,
			TaskItem.configure({
				nested: true,
				HTMLAttributes: {
					class: "flex items-start my-2",
				},
			}),
			Blockquote,
			CodeBlockLowlight.configure({
				lowlight,
			}),
		],
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onContentChange(editor.getHTML())
		},
	})

	// Sync external content updates
	useEffect(() => {
		if (editor && content && content !== editor.getHTML()) {
			editor.commands.setContent(content)
		}
	}, [content, editor])

	const fontFamilies = {
		geist: "Geist Sans, sans-serif",
		mono: "Geist Mono, monospace",
		serif: "Georgia, serif",
	}

	const setHeading = (level: Level | null) => {
		if (!editor) return
		if (level) {
			editor.chain().focus().setHeading({ level }).run()
			setSelectedFormat(`heading${level}`)
		} else {
			editor.chain().focus().setParagraph().run()
			setSelectedFormat("normal")
		}
	}

	const setLink = () => {
		if (!editor) return

		if (linkUrl) {
			editor.chain().focus().setLink({ href: linkUrl }).run()
		} else {
			editor.chain().focus().unsetLink().run()
		}

		setLinkUrl("")
		setIsLinkPopoverOpen(false)
	}

	const textColors = [
		{ name: "Default", value: "" },
		{ name: "Red", value: "#dc2626" },
		{ name: "Blue", value: "#2563eb" },
		{ name: "Green", value: "#16a34a" },
		{ name: "Yellow", value: "#ca8a04" },
		{ name: "Purple", value: "#9333ea" },
		{ name: "Pink", value: "#db2777" },
	]

	const highlightColors = [
		{ name: "Default", value: "" },
		{ name: "Yellow", value: "#fef08a" },
		{ name: "Green", value: "#bbf7d0" },
		{ name: "Blue", value: "#bfdbfe" },
		{ name: "Pink", value: "#fbcfe8" },
		{ name: "Purple", value: "#e9d5ff" },
	]

	if (!isMounted || !editor) {
		return <div className="p-4 text-sm text-muted-foreground">Loading editor...</div>
	}

	return (
		<div className="flex flex-col h-full">
			{/* Toolbar */}
			<div className="border-b border-border bg-muted/30 p-4">
				<div className="flex flex-wrap items-center gap-2">
					{/* Heading Selector */}
					<Select value={selectedFormat} onValueChange={(value) => {
						if (value === "normal") {
							setHeading(null)
						} else if (value === "heading1") {
							setHeading(1)
						} else if (value === "heading2") {
							setHeading(2)
						} else if (value === "heading3") {
							setHeading(3)
						}
					}}>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Normal" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="normal">
								<div className="flex items-center gap-2">
									<Pilcrow className="h-4 w-4" />
									Normal Text
								</div>
							</SelectItem>
							<SelectItem value="heading1">
								<div className="flex items-center gap-2">
									<Heading1 className="h-4 w-4" />
									Heading 1
								</div>
							</SelectItem>
							<SelectItem value="heading2">
								<div className="flex items-center gap-2">
									<Heading2 className="h-4 w-4" />
									Heading 2
								</div>
							</SelectItem>
							<SelectItem value="heading3">
								<div className="flex items-center gap-2">
									<Heading3 className="h-4 w-4" />
									Heading 3
								</div>
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Font Family */}
					<Select value={selectedFont} onValueChange={setSelectedFont}>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Font Family" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="geist">Geist Sans</SelectItem>
							<SelectItem value="mono">Geist Mono</SelectItem>
							<SelectItem value="serif">Serif</SelectItem>
						</SelectContent>
					</Select>

					<div className="h-6 w-px bg-border mx-2" />

					{/* Basic Formatting */}
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""
							}`}
						onClick={() => editor.chain().focus().toggleBold().run()}
					>
						<Bold className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""
							}`}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					>
						<Italic className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("underline")
							? "bg-accent text-accent-foreground"
							: ""
							}`}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
					>
						<UnderlineIcon className="h-4 w-4" />
					</Button>

					<div className="h-6 w-px bg-border mx-2" />

					{/* Lists */}
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("bulletList")
							? "bg-accent text-accent-foreground"
							: ""
							}`}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					>
						<List className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("orderedList")
							? "bg-accent text-accent-foreground"
							: ""
							}`}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					>
						<ListOrdered className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("taskList")
							? "bg-accent text-accent-foreground"
							: ""
							}`}
						onClick={() => editor.chain().focus().toggleTaskList().run()}
					>
						<CheckSquare className="h-4 w-4" />
					</Button>

					<div className="h-6 w-px bg-border mx-2" />

					{/* Text Color */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
							>
								<Palette className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48">
							<div className="grid gap-2">
								<Label>Text Color</Label>
								<div className="grid grid-cols-4 gap-2">
									{textColors.map((color) => (
										<Button
											key={color.value || "default"}
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0"
											onClick={() => editor.chain().focus().setColor(color.value).run()}
										>
											<div
												className="h-4 w-4 rounded border"
												style={{
													backgroundColor: color.value || "transparent",
													borderColor: color.value ? color.value : "#ccc",
												}}
											/>
										</Button>
									))}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => editor.chain().focus().unsetColor().run()}
								>
									Reset Color
								</Button>
							</div>
						</PopoverContent>
					</Popover>

					{/* Highlight Color */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
							>
								<Highlighter className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48">
							<div className="grid gap-2">
								<Label>Highlight Color</Label>
								<div className="grid grid-cols-4 gap-2">
									{highlightColors.map((color) => (
										<Button
											key={color.value || "default"}
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0"
											onClick={() => editor.chain().focus().toggleHighlight({ color: color.value }).run()}
										>
											<div
												className="h-4 w-4 rounded border"
												style={{
													backgroundColor: color.value || "transparent",
													borderColor: color.value ? color.value : "#ccc",
												}}
											/>
										</Button>
									))}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => editor.chain().focus().unsetHighlight().run()}
								>
									Reset Highlight
								</Button>
							</div>
						</PopoverContent>
					</Popover>

					<div className="h-6 w-px bg-border mx-2" />

					{/* Block Elements */}
					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("blockquote")
							? "bg-accent text-accent-foreground"
							: ""
							}`}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					>
						<Quote className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className={`h-8 w-8 ${editor.isActive("codeBlock")
							? "bg-accent text-accent-foreground"
							: ""
							}`}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					>
						<Code className="h-4 w-4" />
					</Button>

					{/* Link */}
					<Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className={`h-8 w-8 ${editor.isActive("link")
									? "bg-accent text-accent-foreground"
									: ""
									}`}
							>
								<LinkIcon className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="grid gap-4">
								<Label>Insert Link</Label>
								<div className="flex gap-2">
									<Input
										placeholder="https://example.com"
										value={linkUrl}
										onChange={(e) => setLinkUrl(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												setLink()
											}
										}}
									/>
									<Button onClick={setLink}>
										Apply
									</Button>
								</div>
								{editor.isActive("link") && (
									<Button
										variant="outline"
										onClick={() => {
											editor.chain().focus().unsetLink().run()
											setIsLinkPopoverOpen(false)
										}}
									>
										Remove Link
									</Button>
								)}
							</div>
						</PopoverContent>
					</Popover>

					<div className="h-6 w-px bg-border mx-2" />

					{/* Undo / Redo */}
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={() => editor.chain().focus().undo().run()}
					>
						<Undo className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={() => editor.chain().focus().redo().run()}
					>
						<Redo className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Editor */}
			<div className="flex-1 p-6 overflow-y-auto">
				<Input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="Untitled Document"
					className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-4"
				/>

				<EditorContent
					editor={editor}
					className="prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] text-foreground"
				/>
			</div>
		</div>
	)
}