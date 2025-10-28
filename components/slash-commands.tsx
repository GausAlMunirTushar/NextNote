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
  Image as ImageIcon,
  Youtube,
  FileUp,
  Calculator,
  Calendar,
  BarChart3,
  Database,
  MessageSquare,
  AtSign,
  Video,
  FileCode,
  LayoutGrid,
  Columns,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const slashCommands = [
  // Text & Headings
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

  // Lists
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

  // Blocks
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

  // Media
  {
    title: "Image",
    description: "Upload or embed an image",
    icon: ImageIcon,
    command: ({ editor }: { editor: any }) => {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  },
  {
    title: "Video",
    description: "Embed a video",
    icon: Video,
    command: ({ editor }: { editor: any }) => {
      const url = window.prompt('Enter video URL:');
      if (url) {
        editor.chain().focus().insertContent(`<video src="${url}" controls></video>`).run();
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
        editor.chain().focus().insertContent(`<iframe src="${url}" width="560" height="315"></iframe>`).run();
      }
    }
  },

  // Advanced
  {
    title: "Table",
    description: "Insert a table",
    icon: Table,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  },
  {
    title: "Mention",
    description: "Mention a person or page",
    icon: AtSign,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('@').run();
    }
  },
  {
    title: "Comment",
    description: "Add a comment",
    icon: MessageSquare,
    command: ({ editor }: { editor: any }) => {
      // Comment implementation
      editor.chain().focus().insertContent('💬 ').run();
    }
  },

  // Files & Embeds
  {
    title: "File",
    description: "Upload a file",
    icon: FileUp,
    command: ({ editor }: { editor: any }) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          editor.chain().focus().insertContent(`📎 ${file.name}`).run();
        }
      };
      fileInput.click();
    }
  },
  {
    title: "Code File",
    description: "Embed a code file",
    icon: FileCode,
    command: ({ editor }: { editor: any }) => {
      const language = window.prompt('Enter programming language:');
      if (language) {
        editor.chain().focus().insertContent(`\`\`\`${language}\n// Your code here\n\`\`\``).run();
      }
    }
  },

  // Data & Layout
  {
    title: "Math",
    description: "Add mathematical equations",
    icon: Calculator,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('\\[ E = mc^2 \\]').run();
    }
  },
  {
    title: "Calendar",
    description: "Insert a calendar view",
    icon: Calendar,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('📅 Calendar View').run();
    }
  },
  {
    title: "Chart",
    description: "Add a chart or graph",
    icon: BarChart3,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('📊 Chart').run();
    }
  },
  {
    title: "Database",
    description: "Create a database view",
    icon: Database,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('🗃️ Database').run();
    }
  },
  {
    title: "Columns",
    description: "Create multi-column layout",
    icon: Columns,
    command: ({ editor }: { editor: any }) => {
      editor.chain().focus().insertContent('<div class="columns-2">Content</div>').run();
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

  // Group commands by category for better organization
  const groupedCommands = {
    "Text & Headings": filteredCommands.filter(cmd => 
      ["Text", "Heading 1", "Heading 2", "Heading 3"].includes(cmd.title)
    ),
    "Lists": filteredCommands.filter(cmd => 
      ["Bullet List", "Numbered List", "To-do List"].includes(cmd.title)
    ),
    "Blocks": filteredCommands.filter(cmd => 
      ["Code Block", "Quote", "Divider", "Table"].includes(cmd.title)
    ),
    "Media": filteredCommands.filter(cmd => 
      ["Image", "Video", "YouTube", "File"].includes(cmd.title)
    ),
    "Advanced": filteredCommands.filter(cmd => 
      ["Mention", "Comment", "Math", "Columns"].includes(cmd.title)
    ),
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
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
        {Object.entries(groupedCommands).map(([category, commands]) => (
          commands.length > 0 && (
            <div key={category}>
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {category}
              </div>
              {commands.map((command) => (
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
            </div>
          )
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