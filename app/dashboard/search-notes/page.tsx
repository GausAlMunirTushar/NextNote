"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NoteCard } from "@/components/note-card"
import { useNotesStore, type Note } from "@/store/notes-store"
import { useToast } from "@/hooks/use-toast"

export default function SearchNotesPage() {
  const { toast } = useToast()
  const { notes, deleteNote, updateNote } = useNotesStore()
  const [searchQuery, setSearchQuery] = useState("")

  const searchResults = searchQuery.trim()
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

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
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Search Notes</h2>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base sm:text-lg"
            autoFocus
          />
        </div>
      </div>

      {searchQuery.trim() === "" ? (
        <div className="text-center py-12 px-4">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Start typing to search through your notes</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-muted-foreground">No notes found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4 px-1">
            Found {searchResults.length} {searchResults.length === 1 ? "note" : "notes"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
