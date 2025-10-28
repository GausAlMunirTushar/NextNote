// components/folders/folder-stats.tsx
import { FolderIcon, FolderOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FolderStatsProps {
  totalFolders: number;
  rootFolders: number;
  nestedFolders: number;
}

export function FolderStats({ totalFolders, rootFolders, nestedFolders }: FolderStatsProps) {
  const stats = [
    {
      label: "Total Folders",
      value: totalFolders,
      icon: FolderIcon,
      description: "All folders",
    },
    {
      label: "Root Folders",
      value: rootFolders,
      icon: FolderOpen,
      description: "Top level folders",
    },
    {
      label: "Nested Folders",
      value: nestedFolders,
      icon: ChevronRight,
      description: "Subfolders",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}