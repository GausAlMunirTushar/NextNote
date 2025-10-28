// components/floating-menu.tsx
"use client";

import { FloatingMenu as TipTapFloatingMenu } from '@tiptap/extension-floating-menu' 
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Table,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";

interface FloatingMenuProps {
  editor: Editor;
}

export function FloatingMenu({ editor }: FloatingMenuProps) {
  const items = [
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().setHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3,
      title: "Heading 3",
      action: () => editor.chain().focus().setHeading({ level: 3 }).run(),
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      title: "Numbered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: CheckSquare,
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      icon: Code,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: Quote,
      title: "Quote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: Table,
      title: "Table",
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
  ];

  return (
    <TipTapFloatingMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 p-2 bg-popover border rounded-lg shadow-lg"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.title}
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            onClick={item.action}
            title={item.title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </TipTapFloatingMenu>
  );
}