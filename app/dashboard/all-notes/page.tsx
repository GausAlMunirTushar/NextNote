"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, SortAsc, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NoteCard } from "@/components/note-card"
import { useNotesStore, type Note } from "@/store/notes-store"
import { useToast } from "@/hooks/use-toast"

export default function AllNotesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { notes, deleteNote, updateNote } = useNotesStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")

  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "date-asc":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

  const handleEdit = (note: Note) => {
    toast({
      title: "Edit note",
      description: "Edit functionality would open the note editor.",
    })
  }

  const handleDelete = (id: string) => {
    deleteNote(id)
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    })
  }

  const handleToggleStar = (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (note) {
      updateNote(id, { starred: !note.starred })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">All Notes</h2>
        <Button onClick={() => router.push("/dashboard/new-note")} size="sm">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Create New Note</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No notes found matching your search." : "No notes yet. Create your first note!"}
          </p>
          {!searchQuery && <Button onClick={() => router.push("/dashboard/new-note")}>Create Note</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStar={handleToggleStar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
