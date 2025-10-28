// components/slash-commands.tsx
"use client";

import {
  FileText,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Divide,
  Table,
  Image,
  Youtube,
  FileUp,
  Calculator,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const slashCommands = [
  {
    title: "Text",
    description: "Just start writing with plain text",
    icon: FileText,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().setParagraph().run();
    }
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: Heading1,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().setHeading({ level: 1 }).run();
    }
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().setHeading({ level: 2 }).run();
    }
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().setHeading({ level: 3 }).run();
    }
  },
  {
    title: "Bullet List",
    description: "Create a simple bulleted list",
    icon: List,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().toggleBulletList().run();
    }
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: ListOrdered,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().toggleOrderedList().run();
    }
  },
  {
    title: "To-do List",
    description: "Track tasks with a checklist",
    icon: CheckSquare,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().toggleTaskList().run();
    }
  },
  {
    title: "Code Block",
    description: "Capture a code snippet",
    icon: Code,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().toggleCodeBlock().run();
    }
  },
  {
    title: "Quote",
    description: "Capture a quote",
    icon: Quote,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().toggleBlockquote().run();
    }
  },
  {
    title: "Divider",
    description: "Visual line break",
    icon: Divide,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().setHorizontalRule().run();
    }
  },
  {
    title: "Table",
    description: "Insert a table",
    icon: Table,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  },
  {
    title: "Image",
    description: "Upload or embed an image",
    icon: Image,
    command: ({ editor }: { editor: any }) => {
      // Image upload implementation would go here
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  },
  {
    title: "YouTube",
    description: "Embed a YouTube video",
    icon: Youtube,
    command: ({ editor }: { editor: any }) => {
      const url = window.prompt('Enter YouTube URL:');
      if (url) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    }
  },
  {
    title: "File",
    description: "Upload a file",
    icon: FileUp,
    command: ({ editor }: { editor: any }) => {
      // File upload implementation
      alert("File upload functionality would be implemented here");
    }
  },
  {
    title: "Math",
    description: "Add mathematical equations",
    icon: Calculator,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('\\[ E = mc^2 \\]').run();
    }
  },
];

interface SlashCommandsProps {
  query: string;
  onQueryChange: (query: string) => void;
  onCommand: (command: any) => void;
}

export function SlashCommands({ query, onQueryChange, onCommand }: SlashCommandsProps) {
  const filteredCommands = slashCommands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="absolute top-0 left-0 right-0 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      <div className="p-2 border-b">
        <Input
          placeholder="Filter commands..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="border-0 focus-visible:ring-0"
          autoFocus
        />
      </div>
      <div className="p-1">
        {filteredCommands.map((command) => (
          <button
            key={command.title}
            className="flex items-center gap-3 w-full p-2 text-sm rounded-md hover:bg-accent transition-colors"
            onClick={() => onCommand(command)}
          >
            <command.icon className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 text-left">
              <div className="font-medium">{command.title}</div>
              <div className="text-xs text-muted-foreground">{command.description}</div>
            </div>
          </button>
        ))}
        {filteredCommands.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground text-center">
            No commands found
          </div>
        )}
      </div>
    </div>
  );
}