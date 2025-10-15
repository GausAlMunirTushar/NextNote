import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Label {
  id: string
  name: string
  color: string
}

export interface Note {
  id: string
  title: string
  content: string
  labels: string[]
  createdAt: string
  updatedAt: string
  starred: boolean
}

interface NotesStore {
  notes: Note[]
  labels: Label[]
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  addLabel: (label: Omit<Label, "id">) => void
  deleteLabel: (id: string) => void
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      labels: [],
      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateNote: (id, note) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n)),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
      addLabel: (label) =>
        set((state) => ({
          labels: [...state.labels, { ...label, id: crypto.randomUUID() }],
        })),
      deleteLabel: (id) =>
        set((state) => ({
          labels: state.labels.filter((l) => l.id !== id),
        })),
    }),
    {
      name: "nextnote-storage",
    },
  ),
)
