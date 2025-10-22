"use client"

import { useRef, useCallback, useState } from "react"
import {
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
	Undo,
	Redo,
	Maximize,
	Minimize,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
	title: string
	content: string
	onTitleChange: (title: string) => void
	onContentChange: (content: string) => void
}

export function RichTextEditor({ title, content, onTitleChange, onContentChange }: RichTextEditorProps) {
	const contentRef = useRef<HTMLDivElement>(null)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [fontSize, setFontSize] = useState("16")
	const [fontFamily, setFontFamily] = useState("sans-serif")

	const execCommand = useCallback((command: string, value?: string) => {
		document.execCommand(command, false, value)
		contentRef.current?.focus()
	}, [])

	// ✅ Editor Input Handler — no re-render
	const handleInput = useCallback(() => {
		if (!contentRef.current) return
		const html = contentRef.current.innerHTML
		onContentChange(html)
	}, [onContentChange])

	// ✅ initialize only once
	const handleMount = useCallback((el: HTMLDivElement | null) => {
		if (el && content) {
			el.innerHTML = content
		}
	}, [content])

	return (
		<div className={cn("flex flex-col h-full", isFullscreen && "fixed inset-0 z-50 bg-background")}>
			{/* Toolbar */}
			<div className="border-b border-border bg-muted/30 p-2 flex items-center flex-wrap gap-1">
				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")} title="Bold">
					<Bold className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("italic")} title="Italic">
					<Italic className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("underline")} title="Underline">
					<Underline className="h-4 w-4" />
				</Button>

				<div className="h-6 w-px bg-border mx-1" />

				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertUnorderedList")} title="Bullet List">
					<List className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertOrderedList")} title="Numbered List">
					<ListOrdered className="h-4 w-4" />
				</Button>

				<div className="h-6 w-px bg-border mx-1" />

				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("undo")} title="Undo">
					<Undo className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("redo")} title="Redo">
					<Redo className="h-4 w-4" />
				</Button>

				<div className="h-6 w-px bg-border mx-1" />

				<Select
					onValueChange={(v) => {
						setFontSize(v)
						if (contentRef.current) contentRef.current.style.fontSize = `${v}px`
					}}
					defaultValue="16"
				>
					<SelectTrigger className="w-20 h-8 text-xs">
						<SelectValue placeholder="Size" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="12">12px</SelectItem>
						<SelectItem value="14">14px</SelectItem>
						<SelectItem value="16">16px</SelectItem>
						<SelectItem value="18">18px</SelectItem>
						<SelectItem value="20">20px</SelectItem>
						<SelectItem value="24">24px</SelectItem>
					</SelectContent>
				</Select>

				<Select
					onValueChange={(v) => {
						setFontFamily(v)
						execCommand("fontName", v)
					}}
					defaultValue="sans-serif"
				>
					<SelectTrigger className="w-28 h-8 text-xs">
						<SelectValue placeholder="Font" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="sans-serif">Sans Serif</SelectItem>
						<SelectItem value="serif">Serif</SelectItem>
						<SelectItem value="monospace">Monospace</SelectItem>
						<SelectItem value="Arial">Arial</SelectItem>
						<SelectItem value="Georgia">Georgia</SelectItem>
					</SelectContent>
				</Select>

				<div className="h-6 w-px bg-border mx-1" />

				<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(!isFullscreen)} title="Fullscreen">
					{isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
				</Button>
			</div>

			{/* Editor */}
			<div className="flex-1 p-4 sm:p-6 overflow-y-auto">
				<Input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="Untitled Document"
					className="text-xl sm:text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-4"
				/>
				<div
					ref={(el) => {
						contentRef.current = el
						handleMount(el)
					}}
					contentEditable
					onInput={handleInput}
					className="w-full min-h-[400px] border-none bg-transparent text-foreground focus:outline-none prose prose-sm sm:prose max-w-none"
					style={{ fontSize: `${fontSize}px`, fontFamily }}
					suppressContentEditableWarning={true}
				/>
			</div>
		</div>
	)
}
