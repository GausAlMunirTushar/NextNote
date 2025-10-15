"use client"

import { useState } from "react"
import { Download, FileText, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Note } from "@/store/notes-store"

interface ExportNoteDialogProps {
  note: Note
}

export function ExportNoteDialog({ note }: ExportNoteDialogProps) {
  const [format, setFormat] = useState<"txt" | "json" | "html">("txt")
  const [open, setOpen] = useState(false)

  const handleExport = () => {
    let content = ""
    let filename = ""
    let mimeType = ""

    switch (format) {
      case "txt":
        content = `${note.title}\n\n${note.content.replace(/<[^>]*>/g, "")}`
        filename = `${note.title}.txt`
        mimeType = "text/plain"
        break
      case "json":
        content = JSON.stringify(note, null, 2)
        filename = `${note.title}.json`
        mimeType = "application/json"
        break
      case "html":
        content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${note.title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div>${note.content}</div>
</body>
</html>`
        filename = `${note.title}.html`
        mimeType = "text/html"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Note</DialogTitle>
          <DialogDescription>Choose a format to export your note</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as typeof format)}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
              <RadioGroupItem value="txt" id="txt" />
              <Label htmlFor="txt" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="h-4 w-4" />
                <div>
                  <div className="font-medium">Plain Text (.txt)</div>
                  <div className="text-xs text-muted-foreground">Simple text format</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
              <RadioGroupItem value="html" id="html" />
              <Label htmlFor="html" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="h-4 w-4" />
                <div>
                  <div className="font-medium">HTML (.html)</div>
                  <div className="text-xs text-muted-foreground">Web page format with formatting</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileJson className="h-4 w-4" />
                <div>
                  <div className="font-medium">JSON (.json)</div>
                  <div className="text-xs text-muted-foreground">Structured data format</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
