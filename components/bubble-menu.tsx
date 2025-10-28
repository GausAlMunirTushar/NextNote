// components/bubble-menu.tsx
"use client";

import { BubbleMenu as TipTapBubbleMenu } from '@tiptap/react/menus'
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	Code,
	Quote,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import type { Editor } from "@tiptap/react";

interface BubbleMenuProps {
	editor: Editor;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
	return (
		<TipTapBubbleMenu
			editor={editor}
			tippyOptions={{ duration: 100 }}
			className="flex items-center gap-1 p-2 bg-popover border rounded-lg shadow-lg"
		>
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

			<Toggle
				pressed={editor.isActive("strike")}
				onPressedChange={() => editor.chain().focus().toggleStrike().run()}
				size="sm"
				className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
			>
				<Strikethrough className="h-4 w-4" />
			</Toggle>

			<Toggle
				pressed={editor.isActive("code")}
				onPressedChange={() => editor.chain().focus().toggleCode().run()}
				size="sm"
				className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
			>
				<Code className="h-4 w-4" />
			</Toggle>

			<Toggle
				pressed={editor.isActive("blockquote")}
				onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
				size="sm"
				className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
			>
				<Quote className="h-4 w-4" />
			</Toggle>
		</TipTapBubbleMenu>
	);
}