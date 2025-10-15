"use client"

import { useState } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Undo, Redo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NoteEditorProps {
  title: string
  content: string
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
}

export function NoteEditor({ title, content, onTitleChange, onContentChange }: NoteEditorProps) {
  const [selectedFormat, setSelectedFormat] = useState("normal")

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Normal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="heading1">Heading 1</SelectItem>
              <SelectItem value="heading2">Heading 2</SelectItem>
              <SelectItem value="heading3">Heading 3</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="geist">
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

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Underline className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Document"
          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-4"
        />
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing..."
          className="w-full min-h-[500px] resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  )
}
