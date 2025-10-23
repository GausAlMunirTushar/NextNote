"use client"

import { useState, useEffect, useCallback } from "react"
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
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Placeholder from "@tiptap/extension-placeholder"
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
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Minus,
	Superscript as SuperscriptIcon,
	Subscript as SubscriptIcon,
	Type,
	Sparkles,
	Table,
	Image,
	Divide,
	FileText,
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
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"


const lowlight = createLowlight(common)

interface NoteEditorProps {
	title: string
	content: string
	onTitleChange: (title: string) => void
	onContentChange: (content: string) => void
}

type Level = 1 | 2 | 3

// Slash command items
const slashCommands = [
	{
		title: "Text",
		description: "Just start writing with plain text",
		icon: FileText,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().setParagraph().run()
		}
	},
	{
		title: "Heading 1",
		description: "Large section heading",
		icon: Heading1,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().setHeading({ level: 1 }).run()
		}
	},
	{
		title: "Heading 2",
		description: "Medium section heading",
		icon: Heading2,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().setHeading({ level: 2 }).run()
		}
	},
	{
		title: "Heading 3",
		description: "Small section heading",
		icon: Heading3,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().setHeading({ level: 3 }).run()
		}
	},
	{
		title: "Bullet List",
		description: "Create a simple bulleted list",
		icon: List,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().toggleBulletList().run()
		}
	},
	{
		title: "Numbered List",
		description: "Create a numbered list",
		icon: ListOrdered,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().toggleOrderedList().run()
		}
	},
	{
		title: "To-do List",
		description: "Track tasks with a checklist",
		icon: CheckSquare,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().toggleTaskList().run()
		}
	},
	{
		title: "Code Block",
		description: "Capture a code snippet",
		icon: Code,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().toggleCodeBlock().run()
		}
	},
	{
		title: "Quote",
		description: "Capture a quote",
		icon: Quote,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().toggleBlockquote().run()
		}
	},
	{
		title: "Divider",
		description: "Visual line break",
		icon: Divide,
		command: ({ editor }: { editor: any }) => {
			editor.chain().focus().setHorizontalRule().run()
		}
	},
]

export default function NoteEditor({
	title,
	content,
	onTitleChange,
	onContentChange,
}: NoteEditorProps) {
	const [selectedFormat, setSelectedFormat] = useState("normal")
	const [selectedFont, setSelectedFont] = useState("inter")
	const [isMounted, setIsMounted] = useState(false)
	const [linkUrl, setLinkUrl] = useState("")
	const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
	const [showSlashCommands, setShowSlashCommands] = useState(false)
	const [slashCommandQuery, setSlashCommandQuery] = useState("")

	// Run once after hydration
	useEffect(() => {
		setIsMounted(true)
	}, [])

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
			onContentChange(editor.getHTML())
		},
		editorProps: {
			attributes: {
				class: "prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed max-w-none focus:outline-none min-h-[500px] prose-pre:bg-muted prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-1",
			},
			handleKeyDown: (view, event) => {
				if (event.key === "/") {
					setShowSlashCommands(true)
					return true
				}
				if (showSlashCommands) {
					if (event.key === "Escape") {
						setShowSlashCommands(false)
						return true
					}
				}
				return false
			},
		},
	})

	// Sync external content updates
	useEffect(() => {
		if (editor && content && content !== editor.getHTML()) {
			editor.commands.setContent(content)
		}
	}, [content, editor])

	// Update selected format based on editor state
	useEffect(() => {
		if (!editor) return

		if (editor.isActive('heading', { level: 1 })) {
			setSelectedFormat('heading1')
		} else if (editor.isActive('heading', { level: 2 })) {
			setSelectedFormat('heading2')
		} else if (editor.isActive('heading', { level: 3 })) {
			setSelectedFormat('heading3')
		} else {
			setSelectedFormat('normal')
		}
	}, [editor?.state.selection])

	// Handle slash commands
	const handleSlashCommand = useCallback((command: any) => {
		if (!editor) return
		command.command({ editor })
		setShowSlashCommands(false)
		setSlashCommandQuery("")
	}, [editor])

	// Filter slash commands based on query
	const filteredSlashCommands = slashCommands.filter(command =>
		command.title.toLowerCase().includes(slashCommandQuery.toLowerCase()) ||
		command.description.toLowerCase().includes(slashCommandQuery.toLowerCase())
	)

	const fontFamilies = {
		inter: "Inter, sans-serif",
		geist: "Geist Sans, sans-serif",
		mono: "Geist Mono, monospace",
		serif: "Georgia, serif",
		system: "system-ui, sans-serif",
	}

	const setHeading = (level: Level | null) => {
		if (!editor) return
		if (level) {
			editor.chain().focus().setHeading({ level }).run()
		} else {
			editor.chain().focus().setParagraph().run()
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
		{ name: "Gray", value: "#6b7280" },
		{ name: "Red", value: "#dc2626" },
		{ name: "Orange", value: "#ea580c" },
		{ name: "Amber", value: "#d97706" },
		{ name: "Green", value: "#16a34a" },
		{ name: "Blue", value: "#2563eb" },
		{ name: "Indigo", value: "#4f46e5" },
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
		{ name: "Orange", value: "#fed7aa" },
		{ name: "Red", value: "#fecaca" },
	]

	if (!isMounted || !editor) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-muted-foreground">
					<Sparkles className="h-5 w-5 animate-pulse" />
					<span>Loading editor...</span>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
			{/* Enhanced Toolbar */}
			<div className="border-b bg-card/50 backdrop-blur-sm">
				<div className="p-3">
					{/* First Row - Text Formatting */}
					<div className="flex flex-wrap items-center gap-1 mb-3">
						{/* Text Format */}
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
							<SelectTrigger className="w-32 h-8">
								<SelectValue placeholder="Normal" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="normal">
									<div className="flex items-center gap-2">
										<Pilcrow className="h-4 w-4" />
										<span>Normal</span>
									</div>
								</SelectItem>
								<SelectItem value="heading1">
									<div className="flex items-center gap-2">
										<Heading1 className="h-4 w-4" />
										<span>Heading 1</span>
									</div>
								</SelectItem>
								<SelectItem value="heading2">
									<div className="flex items-center gap-2">
										<Heading2 className="h-4 w-4" />
										<span>Heading 2</span>
									</div>
								</SelectItem>
								<SelectItem value="heading3">
									<div className="flex items-center gap-2">
										<Heading3 className="h-4 w-4" />
										<span>Heading 3</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>

						{/* Font Family */}
						<Select value={selectedFont} onValueChange={setSelectedFont}>
							<SelectTrigger className="w-32 h-8">
								<SelectValue placeholder="Font" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="inter">Inter</SelectItem>
								<SelectItem value="geist">Geist Sans</SelectItem>
								<SelectItem value="mono">Geist Mono</SelectItem>
								<SelectItem value="serif">Serif</SelectItem>
								<SelectItem value="system">System</SelectItem>
							</SelectContent>
						</Select>

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Basic Formatting */}
						<Toggle
							pressed={editor.isActive("bold")}
							onPressedChange={() => editor.chain().focus().toggleBold().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<Bold className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive("italic")}
							onPressedChange={() => editor.chain().focus().toggleItalic().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<Italic className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive("underline")}
							onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<UnderlineIcon className="h-4 w-4" />
						</Toggle>

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Text Alignment */}
						<Toggle
							pressed={editor.isActive({ textAlign: 'left' })}
							onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<AlignLeft className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive({ textAlign: 'center' })}
							onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<AlignCenter className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive({ textAlign: 'right' })}
							onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<AlignRight className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive({ textAlign: 'justify' })}
							onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<AlignJustify className="h-4 w-4" />
						</Toggle>
					</div>

					{/* Second Row - Advanced Formatting */}
					<div className="flex flex-wrap items-center gap-1">
						{/* Lists */}
						<Toggle
							pressed={editor.isActive("bulletList")}
							onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<List className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive("orderedList")}
							onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<ListOrdered className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive("taskList")}
							onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<CheckSquare className="h-6 w-6" />
						</Toggle>

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Block Elements */}
						<Toggle
							pressed={editor.isActive("blockquote")}
							onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<Quote className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive("codeBlock")}
							onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<Code className="h-4 w-4" />
						</Toggle>

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Text Color */}
						<Popover>
							<PopoverTrigger asChild>
								<Toggle
									size="sm"
									className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
								>
									<Palette className="h-4 w-4" />
								</Toggle>
							</PopoverTrigger>
							<PopoverContent className="w-64">
								<div className="grid gap-3">
									<Label>Text Color</Label>
									<div className="grid grid-cols-5 gap-2">
										{textColors.map((color) => (
											<button
												key={color.value || "default"}
												className={cn(
													"h-8 w-8 rounded-md border-2 flex items-center justify-center transition-all hover:scale-110",
													color.value ? "" : "border-dashed"
												)}
												style={{
													backgroundColor: color.value || "transparent",
													borderColor: color.value ? color.value : "hsl(var(--border))",
												}}
												onClick={() => {
													if (color.value) {
														editor.chain().focus().setColor(color.value).run()
													} else {
														editor.chain().focus().unsetColor().run()
													}
												}}
											>
												{!color.value && <Type className="h-3 w-3 text-muted-foreground" />}
											</button>
										))}
									</div>
								</div>
							</PopoverContent>
						</Popover>

						{/* Highlight Color */}
						<Popover>
							<PopoverTrigger asChild>
								<Toggle
									size="sm"
									className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
								>
									<Highlighter className="h-4 w-4" />
								</Toggle>
							</PopoverTrigger>
							<PopoverContent className="w-64">
								<div className="grid gap-3">
									<Label>Highlight Color</Label>
									<div className="grid grid-cols-4 gap-2">
										{highlightColors.map((color) => (
											<button
												key={color.value || "default"}
												className={cn(
													"h-8 w-8 rounded-md border flex items-center justify-center transition-all hover:scale-110",
													color.value ? "" : "border-dashed"
												)}
												style={{
													backgroundColor: color.value || "transparent",
													borderColor: color.value ? color.value : "hsl(var(--border))",
												}}
												onClick={() => {
													if (color.value) {
														editor.chain().focus().toggleHighlight({ color: color.value }).run()
													} else {
														editor.chain().focus().unsetHighlight().run()
													}
												}}
											>
												{!color.value && <Minus className="h-3 w-3 text-muted-foreground" />}
											</button>
										))}
									</div>
								</div>
							</PopoverContent>
						</Popover>

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Link */}
						<Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
							<PopoverTrigger asChild>
								<Toggle
									pressed={editor.isActive("link")}
									size="sm"
									className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
								>
									<LinkIcon className="h-4 w-4" />
								</Toggle>
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
											className="flex-1"
										/>
										<Button onClick={setLink} size="sm">
											Apply
										</Button>
									</div>
									{editor.isActive("link") && (
										<Button
											variant="outline"
											size="sm"
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

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Superscript & Subscript */}
						<Toggle
							pressed={editor.isActive("superscript")}
							onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<SuperscriptIcon className="h-4 w-4" />
						</Toggle>
						<Toggle
							pressed={editor.isActive("subscript")}
							onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
							size="sm"
							className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<SubscriptIcon className="h-4 w-4" />
						</Toggle>

						<Separator orientation="vertical" className="h-6 mx-1" />

						{/* Undo / Redo */}
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8"
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().undo()}
						>
							<Undo className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8"
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().redo()}
						>
							<Redo className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Editor Content */}
			<div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-background to-muted/20 relative">
				<Input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="Untitled Document"
					className="text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-6 placeholder:text-muted-foreground/50 h-auto py-2"
				/>

				<div className="relative">
					<EditorContent
						editor={editor}
						className="min-h-[500px] focus:outline-none"
					/>

					{/* Slash Commands Menu */}
					{showSlashCommands && (
						<div className="absolute top-0 left-0 right-0 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
							<div className="p-2 border-b">
								<Input
									placeholder="Filter commands..."
									value={slashCommandQuery}
									onChange={(e) => setSlashCommandQuery(e.target.value)}
									className="border-0 focus-visible:ring-0"
									autoFocus
								/>
							</div>
							<div className="p-1">
								{filteredSlashCommands.map((command, index) => (
									<button
										key={command.title}
										className="flex items-center gap-3 w-full p-2 text-sm rounded-md hover:bg-accent transition-colors"
										onClick={() => handleSlashCommand(command)}
									>
										<command.icon className="h-4 w-4 text-muted-foreground" />
										<div className="flex-1 text-left">
											<div className="font-medium">{command.title}</div>
											<div className="text-xs text-muted-foreground">{command.description}</div>
										</div>
									</button>
								))}
								{filteredSlashCommands.length === 0 && (
									<div className="p-2 text-sm text-muted-foreground text-center">
										No commands found
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}