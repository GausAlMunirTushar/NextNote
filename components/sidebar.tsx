"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, FilePlus, Files, Search, MessageSquare, BookOpen, Settings, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "New Note", href: "/dashboard/new-note", icon: FilePlus },
  { name: "All Notes", href: "/dashboard/all-notes", icon: Files },
  { name: "Search Notes", href: "/dashboard/search-notes", icon: Search },
  { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
  { name: "Blog", href: "/dashboard/blog", icon: BookOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "More", href: "/dashboard/more", icon: MoreHorizontal },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <FileText className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-sidebar-foreground">NextNote</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
