// components/sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FilePlus,
  Files,
  CheckSquare,
  Folder,
  FolderOpen,
  Plus,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ProfileDropdown } from "@/views/profile/ProfileDropdown"
import * as Tooltip from "@radix-ui/react-tooltip"
import { useFoldersStore } from "@/store/folders-store"
import { useNotesStore } from "@/store/notes-store"

const mainNavigation = [
  { name: "New Note", href: "/new", icon: FilePlus },
  { name: "All Notes", href: "/notes", icon: Files },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
]

const footerNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

// Tooltip Component
function SidebarTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-[100] px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg select-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            side="right"
            sideOffset={8}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  const { folders, getSubfolders, addFolder } = useFoldersStore()
  const { getNotesByFolder } = useNotesStore()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    plan: "Pro"
  }

  // Navigation Item for expanded state
  const NavigationItem = ({ item, isActive }: { item: typeof mainNavigation[0], isActive: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground"
      )}
    >
      <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
      {!isCollapsed && (
        <span className="flex-1 truncate">{item.name}</span>
      )}
    </Link>
  )

  // Icon-only navigation item for collapsed state with tooltip
  const CollapsedNavigationItem = ({ item, isActive }: { item: typeof mainNavigation[0], isActive: boolean }) => (
    <SidebarTooltip content={item.name}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all mx-auto",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
      </Link>
    </SidebarTooltip>
  )

  // Folder Component
  const FolderItem = ({ folder, level = 0 }: { folder: any; level?: number }) => {
    const subfolders = getSubfolders(folder.id)
    const notes = getNotesByFolder(folder.id)
    const isExpanded = expandedFolders.has(folder.id)
    const isActive = pathname === `/f/${folder.slug}`

    return (
      <div>
        {/* Folder */}
        <div
          className={cn(
            "flex items-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer group",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
            isCollapsed && "justify-center"
          )}
          style={{ marginLeft: isCollapsed ? 0 : level * 12 }}
          onClick={() => !isCollapsed && subfolders.length > 0 ? toggleFolder(folder.id) : null}
        >
          {!isCollapsed && subfolders.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
              className="flex items-center justify-center w-4 h-4"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : !isCollapsed ? (
            <div className="w-4" />
          ) : null}

          <Link 
            href={`/f/${folder.slug}`}
            className="flex items-center gap-2 flex-1"
            onClick={(e) => {
              if (!isCollapsed && subfolders.length > 0) {
                e.preventDefault()
              }
            }}
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0" style={{ color: folder.color }} />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0" style={{ color: folder.color }} />
            )}
            
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate">{folder.name}</span>
                <span className="text-xs text-muted-foreground px-1">
                  {notes.length}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Subfolders and Notes */}
        {!isCollapsed && isExpanded && (
          <div className="ml-4">
            {/* Notes in this folder */}
            {notes.map(note => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className={cn(
                  "flex items-center gap-2 py-1 px-3 rounded-lg transition-all text-sm",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === `/notes/${note.id}` && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                style={{ marginLeft: 12 }}
              >
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="truncate flex-1">{note.title}</span>
              </Link>
            ))}

            {/* Subfolders */}
            {subfolders.map(subfolder => (
              <FolderItem key={subfolder.id} folder={subfolder} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:")
    if (name && name.trim()) {
      addFolder({
        name: name.trim(),
        color: '#3b82f6',
        parentId: null
      })
    }
  }

  const rootFolders = getSubfolders(null)

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col h-full bg-white dark:bg-background border-r border-gray-200 dark:border-gray-800",
          "transition-all duration-300 ease-in-out z-50 fixed lg:relative",
          isCollapsed ? "w-16" : "w-64",
          "lg:translate-x-0 overflow-hidden",
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 relative min-h-[80px]",
          isCollapsed ? "px-3" : "px-4"
        )}>
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed ? "justify-center w-full" : "flex-1",
            isCollapsed && isHovered && "opacity-0"
          )}>
            <Image
              src="/logo.svg"
              width={32}
              height={32}
              alt="Logo"
              className="h-8 w-8 flex-shrink-0 transition-opacity"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-sidebar-foreground truncate">
                  NextNote
                </span>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {!isCollapsed ? (
            <button
              onClick={toggleSidebar}
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md",
                "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              "transition-all duration-300",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
            )}>
              <button
                onClick={toggleSidebar}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
                  "hover:shadow transition-all duration-300",
                  "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                  "hover:scale-110"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 py-4 overflow-y-auto">
          {/* Main Navigation */}
          <div className={cn(
            "space-y-1 mb-6",
            isCollapsed ? "px-2" : "px-3"
          )}>
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href
              return isCollapsed ? (
                <CollapsedNavigationItem
                  key={item.name}
                  item={item}
                  isActive={isActive}
                />
              ) : (
                <NavigationItem
                  key={item.name}
                  item={item}
                  isActive={isActive}
                />
              )
            })}
          </div>

          {/* Folders Section */}
          {!isCollapsed && (
            <div className="mb-4 px-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Folders
                </h3>
                <button
                  onClick={handleCreateFolder}
                  className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-sidebar-accent transition-colors"
                  title="New Folder"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Folders List */}
          <div className={cn(
            "space-y-1",
            isCollapsed ? "px-2" : "px-3"
          )}>
            {rootFolders.map(folder => (
              <FolderItem key={folder.id} folder={folder} />
            ))}

            {rootFolders.length === 0 && !isCollapsed && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No folders yet</p>
                <button
                  onClick={handleCreateFolder}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Create folder
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "border-t border-gray-100 dark:border-gray-800 p-3 space-y-2",
          isCollapsed ? "px-2" : "px-3"
        )}>
          {/* Footer Navigation */}
          <div className={cn(
            isCollapsed ? "space-y-1" : "space-y-1"
          )}>
            {footerNavigation.map((item) => (
              isCollapsed ? (
                <SidebarTooltip key={item.name} content={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-all mx-auto",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </Link>
                </SidebarTooltip>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </div>

          {/* User Profile */}
          <div className={cn(
            "flex items-center rounded-lg transition-all p-2",
            "hover:bg-sidebar-accent",
            isCollapsed ? "justify-center" : "gap-3"
          )}>
            {isCollapsed ? (
              <SidebarTooltip content={`${mockUser.name} (${mockUser.plan})`}>
                <div>
                  <ProfileDropdown
                    user={mockUser}
                    className="scale-90"
                  />
                </div>
              </SidebarTooltip>
            ) : (
              <>
                <ProfileDropdown user={mockUser} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {mockUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {mockUser.email}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "lg:hidden absolute -right-3 top-4 w-6 h-6 rounded-full",
            "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
            "flex items-center justify-center shadow-md z-[60]",
            "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </div>
    </>
  )
}