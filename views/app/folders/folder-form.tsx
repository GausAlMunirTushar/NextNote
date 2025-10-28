// components/folders/folder-form.tsx
import { useState } from "react";
import { Folder } from "@/store/folders-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface FolderFormProps {
  folder?: Folder;
  folders: Folder[];
  onSubmit: (data: { name: string; parentId: string | null; color: string }) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}

export function FolderForm({ folder, folders, onSubmit, onCancel, mode }: FolderFormProps) {
  const [name, setName] = useState(folder?.name || "");
  const [parentId, setParentId] = useState<string | null>(folder?.parentId || null);
  const [color, setColor] = useState(folder?.color || "#3b82f6");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      parentId,
      color,
    });
  };

  const getFolderPath = (folderId: string): string => {
    const path: string[] = [];
    let current = folders.find(f => f.id === folderId);
    
    while (current) {
      path.unshift(current.name);
      current = current.parentId ? folders.find(f => f.id === current!.parentId!) : undefined;
    }
    
    return path.join(" / ");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="folder-name">Folder Name</Label>
        <Input
          id="folder-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter folder name"
          autoFocus
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parent-folder">Parent Folder</Label>
        <select
          id="parent-folder"
          value={parentId || ""}
          onChange={(e) => setParentId(e.target.value || null)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Root Level</option>
          {folders
            .filter(f => !folder || f.id !== folder.id) // Don't allow selecting self as parent
            .map((f) => (
              <option key={f.id} value={f.id}>
                {getFolderPath(f.id)}
              </option>
            ))
          }
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="folder-color">Folder Color</Label>
        <div className="flex items-center gap-3">
          <input
            id="folder-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 border-0 rounded cursor-pointer bg-transparent"
          />
          <span className="text-sm text-muted-foreground">
            Choose a color for visual organization
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={!name.trim()}
          className="flex-1"
        >
          <Check className="h-4 w-4 mr-2" />
          {mode === "create" ? "Create Folder" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}