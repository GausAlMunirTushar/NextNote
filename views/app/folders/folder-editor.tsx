// components/folders/folder-editor.tsx
import { Folder } from "@/store/folders-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

interface FolderEditorProps {
  folder: Folder;
  name: string;
  color: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function FolderEditor({
  folder,
  name,
  color,
  onNameChange,
  onColorChange,
  onSave,
  onCancel,
}: FolderEditorProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-6 h-6 border-0 rounded cursor-pointer flex-shrink-0"
        />
        <Input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Folder name"
          autoFocus
          className="flex-1"
        />
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <Button
          onClick={onSave}
          size="sm"
          className="h-8 w-8 p-0"
          disabled={!name.trim()}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}