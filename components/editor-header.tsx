// components/editor-header.tsx
"use client";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Link as LinkIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Undo,
  Redo,
  Pilcrow,
  Minus,
  Type,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";

interface EditorHeaderProps {
  editor: Editor | null;
}

export function EditorHeader({ editor }: EditorHeaderProps) {
  if (!editor) return null;

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
  ];

  const highlightColors = [
    { name: "Default", value: "" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Orange", value: "#fed7aa" },
    { name: "Red", value: "#fecaca" },
  ];

  const getSelectedFormat = () => {
    if (editor.isActive('heading', { level: 1 })) return 'heading1';
    if (editor.isActive('heading', { level: 2 })) return 'heading2';
    if (editor.isActive('heading', { level: 3 })) return 'heading3';
    return 'normal';
  };

  const setHeading = (level: 1 | 2 | 3 | null) => {
    if (level) {
      editor.chain().focus().setHeading({ level }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="p-3">
        {/* First Row - Text Formatting */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          {/* Text Format */}
          <Select value={getSelectedFormat()} onValueChange={(value) => {
            if (value === "normal") setHeading(null);
            else if (value === "heading1") setHeading(1);
            else if (value === "heading2") setHeading(2);
            else if (value === "heading3") setHeading(3);
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
            <CheckSquare className="h-4 w-4" />
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
                          editor.chain().focus().setColor(color.value).run();
                        } else {
                          editor.chain().focus().unsetColor().run();
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
                          editor.chain().focus().toggleHighlight({ color: color.value }).run();
                        } else {
                          editor.chain().focus().unsetHighlight().run();
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
  );
}