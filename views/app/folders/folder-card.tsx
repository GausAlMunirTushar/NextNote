// components/folders/folder-card.tsx
import Link from "next/link";
import { Folder } from "@/store/folders-store";
import { FolderIcon, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderCardProps {
  folder: Folder;
  breadcrumb?: string;
  subfolderCount: number;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  level?: number;
  isEditing?: boolean;
  editingContent?: React.ReactNode;
}

export function FolderCard({
  folder,
  breadcrumb,
  subfolderCount,
  onEdit,
  onDelete,
  level = 0,
  isEditing = false,
  editingContent,
}: FolderCardProps) {
  return (
    <Card 
      className={`
        transition-all duration-200 hover:shadow-md border-l-4
        ${level > 0 ? 'ml-8' : ''}
        hover:border-primary/50
      `}
      style={{ borderLeftColor: folder.color }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: folder.color }}
            />
            
            {isEditing ? (
              editingContent
            ) : (
              <>
                <Link
                  href={`/folders/${folder.slug}`}
                  className="flex items-center gap-3 flex-1 min-w-0 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FolderIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-semibold text-base leading-none truncate group-hover:text-primary transition-colors">
                        {folder.name}
                      </h3>
                      {breadcrumb && (
                        <p className="text-xs text-muted-foreground truncate">
                          In {breadcrumb}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {subfolderCount > 0 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {subfolderCount}
                    </Badge>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(folder)}>
                        Edit Folder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(folder)}
                        className="text-destructive focus:text-destructive"
                      >
                        Delete Folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}