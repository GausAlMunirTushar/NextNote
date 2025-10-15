"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { useNotesStore } from "@/store/notes-store"
import { useToast } from "@/hooks/use-toast"
import { Save, X } from "lucide-react"

export default function NewNotePage() {
  const router = useRouter()
  const { toast } = useToast()
  const addNote = useNotesStore((state) => state.addNote)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Empty note",
        description: "Please add some content before saving.",
        variant: "destructive",
      })
      return
    }

    addNote({
      title: title || "Untitled Document",
      content,
      labels: [],
      starred: false,
    })

    toast({
      title: "Note saved!",
      description: "Your note has been saved successfully.",
    })

    router.push("/dashboard/all-notes")
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">New Note</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/all-notes")}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            <X className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
          <Button onClick={handleSave} className="flex-1 sm:flex-none" size="sm">
            <Save className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Save Note</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-card rounded-lg">
        <RichTextEditor title={title} content={content} onTitleChange={setTitle} onContentChange={setContent} />
      </div>
    </div>
  )
}
