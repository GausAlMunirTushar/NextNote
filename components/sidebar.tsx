// components/sidebar.tsx
"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
	FilePlus,
	Files,
	CheckSquare,
	Star,
	Users,
	Folder,
	FolderOpen,
	Trash2,
	Settings,
	Plus,
	ChevronDown,
	ChevronRight,
	MoreHorizontal,
	PanelRightOpen,
	PanelRightClose,
	Edit,
	House
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ProfileDropdown } from "@/views/profile/ProfileDropdown"
import * as Tooltip from "@radix-ui/react-tooltip"
import { useFoldersStore } from "@/store/folders-store"
import { useNotesStore } from "@/store/notes-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/auth-store"

const mainNavigation = [
	{ name: "Home", href: "/dashboard", icon: House },
	{ name: "New Note", href: "/new", icon: FilePlus },
	{ name: "All Notes", href: "/notes", icon: Files },
	{ name: "Tasks", href: "/tasks", icon: CheckSquare },
]

const secondaryNavigation = [
	{ name: "Favorites", href: "/favorites", icon: Star },
	{ name: "Shared", href: "/shared", icon: Users },
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
	const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
	const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
	const [editFolderName, setEditFolderName] = useState("")
	const [newFolder, setNewFolder] = useState({
		name: "",
		color: "#3b82f6"
	})
	const { user, isAuthenticated } = useAuthStore()
	const pathname = usePathname()
	const router = useRouter()
	const editInputRef = useRef<HTMLInputElement>(null)

	const { folders, getSubfolders, addFolder, updateFolder, deleteFolder } = useFoldersStore()
	const { getNotesByFolder } = useNotesStore()

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed)
	}

	const toggleFolder = (folderId: string, e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
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

	const handleCreateFolder = () => {
		if (!newFolder.name.trim()) return

		addFolder({
			name: newFolder.name.trim(),
			color: newFolder.color,
			parentId: null
		})

		setNewFolder({ name: "", color: "#3b82f6" })
		setIsCreateFolderOpen(false)
	}

	const handleStartRename = (folder: any, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setEditingFolderId(folder.id)
		setEditFolderName(folder.name)
		setTimeout(() => {
			editInputRef.current?.focus()
			editInputRef.current?.select()
		}, 0)
	}

	const handleRename = (folderId: string, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (editFolderName.trim() && editFolderName.trim() !== getFolderById(folderId)?.name) {
			updateFolder(folderId, { name: editFolderName.trim() })
		}
		setEditingFolderId(null)
		setEditFolderName("")
	}

	const handleDeleteFolder = (folderId: string, e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		if (confirm("Are you sure you want to delete this folder? Notes in this folder will not be deleted.")) {
			deleteFolder(folderId)
		}
	}

	const handleFolderClick = (folder: any, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		router.push(`/folders/${folder.slug}`)
	}

	const getFolderById = (id: string) => {
		return folders.find(f => f.id === id)
	}


	// Navigation Item for expanded state
	const NavigationItem = ({ item, isActive }: { item: any, isActive: boolean }) => (
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
	const CollapsedNavigationItem = ({ item, isActive }: { item: any, isActive: boolean }) => (
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
		const isEditing = editingFolderId === folder.id

		return (
			<div className="select-none">
				{/* Folder Row */}
				<div className="relative group">
					<div
						className={cn(
							"flex items-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer",
							"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
							isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
							isCollapsed && "justify-center"
						)}
						style={{ marginLeft: isCollapsed ? 0 : level * 12 }}
						onDoubleClick={(e) => handleStartRename(folder, e)}
					>
						{/* Chevron for expand/collapse */}
						{!isCollapsed && subfolders.length > 0 && (
							<button
								onClick={(e) => toggleFolder(folder.id, e)}
								className="flex items-center justify-center w-4 h-4 hover:bg-sidebar-accent/50 rounded transition-colors"
							>
								{isExpanded ? (
									<ChevronDown className="h-3 w-3" />
								) : (
									<ChevronRight className="h-3 w-3" />
								)}
							</button>
						)}

						{/* Spacer when no chevron */}
						{!isCollapsed && subfolders.length === 0 && (
							<div className="w-4" />
						)}

						{/* Folder Icon and Name */}
						{isCollapsed ? (
							<SidebarTooltip content={folder.name}>
								<button
									onClick={(e) => handleFolderClick(folder, e)}
									className="flex items-center justify-center"
								>
									<Folder className="h-4 w-4" style={{ color: folder.color }} />
								</button>
							</SidebarTooltip>
						) : (
							<div className="flex items-center gap-2 flex-1 min-w-0">
								{/* Folder Icon */}
								<button
									onClick={(e) => handleFolderClick(folder, e)}
									className="flex items-center justify-center flex-shrink-0"
								>
									{isExpanded ? (
										<FolderOpen className="h-4 w-4" style={{ color: folder.color }} />
									) : (
										<Folder className="h-4 w-4" style={{ color: folder.color }} />
									)}
								</button>

								{/* Folder Name - Editable or Clickable */}
								<div className="flex items-center justify-between flex-1 min-w-0">
									{isEditing ? (
										<Input
											ref={editInputRef}
											value={editFolderName}
											onChange={(e) => setEditFolderName(e.target.value)}
											onBlur={() => handleRename(folder.id, e)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleRename(folder.id, e)
												if (e.key === 'Escape') setEditingFolderId(null)
											}}
											className="h-6 text-sm px-1 flex-1"
											onClick={(e) => e.stopPropagation()}
										/>
									) : (
										<>
											<button
												onClick={(e) => handleFolderClick(folder, e)}
												className="truncate flex-1 text-left hover:underline"
											>
												{folder.name}
											</button>
											<span className="text-xs text-muted-foreground px-1 flex-shrink-0">
												{notes.length}
											</span>
										</>
									)}
								</div>
							</div>
						)}

						{/* Three dots menu for folder actions */}
						{!isCollapsed && !isEditing && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className={cn(
											"h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
											"hover:bg-sidebar-accent/50"
										)}
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
										}}
									>
										<MoreHorizontal className="h-3 w-3" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-48"
									onClick={(e) => e.stopPropagation()}
								>
									<DropdownMenuItem
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleStartRename(folder, e)
										}}
									>
										<Edit className="h-4 w-4 mr-2" />
										Rename
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleDeleteFolder(folder.id, e)
										}}
										className="text-destructive focus:text-destructive"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete Folder
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>

				{/* Subfolders and Notes */}
				{!isCollapsed && isExpanded && (
					<div className="ml-4 mt-1">
						{/* Notes in this folder */}
						{notes.map(note => (
							<Link
								key={note.id}
								href={`/notes/${note.id}`}
								className={cn(
									"flex items-center gap-2 py-1 px-3 rounded-lg transition-all text-sm mb-1",
									"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
									pathname === `/notes/${note.id}` && "bg-sidebar-accent text-sidebar-accent-foreground"
								)}
								style={{ marginLeft: 8 }}
							>
								<div className="w-2 h-2 rounded-full bg-muted-foreground flex-shrink-0" />
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
					"flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 relative h-14",
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
								"flex items-center cursor-pointer justify-center w-6 h-6 rounded-md",
								"hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
								"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							)}
						>
							<PanelRightClose className="h-4 w-4" />
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
									"flex items-center cursor-pointer justify-center w-8 h-8 rounded-lg",
									"bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
									"hover:shadow transition-all duration-300",
									"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
									"hover:scale-110"
								)}
							>
								<PanelRightOpen className="h-4 w-4" />
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

					{/* Secondary Navigation */}
					{/* {!isCollapsed && (
						<div className="mb-6 px-3">
							<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
								Workspace
							</h3>
							<div className="space-y-1">
								{secondaryNavigation.map((item) => {
									const isActive = pathname === item.href
									return (
										<NavigationItem
											key={item.name}
											item={item}
											isActive={isActive}
										/>
									)
								})}
							</div>
						</div>
					)} */}

					{/* Folders Section */}
					{!isCollapsed && (
						<div className="mb-4 px-3">
							<div className="flex items-center justify-between mb-2">
								<Link href="/folders">
									<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Folders
									</h3>
								</Link>
								<Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
									<DialogTrigger asChild>
										<button
											className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-sidebar-accent transition-colors"
											title="New Folder"
										>
											<Plus className="h-3 w-3" />
										</button>
									</DialogTrigger>
									<DialogContent className="max-w-md">
										<DialogHeader>
											<DialogTitle>Create New Folder</DialogTitle>
											<DialogDescription>
												Create a new folder to organize your notes.
											</DialogDescription>
										</DialogHeader>

										<div className="space-y-4">
											<div>
												<label className="text-sm font-medium">Folder Name *</label>
												<Input
													value={newFolder.name}
													onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
													placeholder="Enter folder name"
													className="mt-1"
													autoFocus
												/>
											</div>

											<div>
												<label className="text-sm font-medium">Folder Color</label>
												<div className="flex gap-2 mt-2">
													{[
														{ name: 'Blue', value: '#3b82f6' },
														{ name: 'Red', value: '#ef4444' },
														{ name: 'Green', value: '#10b981' },
														{ name: 'Yellow', value: '#f59e0b' },
														{ name: 'Purple', value: '#8b5cf6' },
														{ name: 'Pink', value: '#ec4899' }
													].map((color) => (
														<button
															key={color.value}
															type="button"
															className={cn(
																"w-8 h-8 rounded-full border-2 transition-all",
																newFolder.color === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
															)}
															style={{ backgroundColor: color.value }}
															onClick={() => setNewFolder({ ...newFolder, color: color.value })}
															title={color.name}
														/>
													))}
												</div>
											</div>

											<div className="flex gap-2 justify-end pt-2">
												<Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
													Cancel
												</Button>
												<Button onClick={handleCreateFolder} disabled={!newFolder.name.trim()}>
													Create Folder
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>
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
									onClick={() => setIsCreateFolderOpen(true)}
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
					<div
						className={cn(
							"flex items-center rounded-lg transition-all p-2",
							"hover:bg-sidebar-accent",
							isCollapsed ? "justify-center" : "gap-3"
						)}
					>
						{isAuthenticated && user ? (
							// ✅ Logged-in user
							isCollapsed ? (
								<SidebarTooltip content={`${user.name} (${user.plan})`}>
									<div>
										<ProfileDropdown
											user={{
												name: user.name,
												email: user.email,
												avatar: user.image,
												plan: user.plan,
											}}
											className="scale-90"
										/>
									</div>
								</SidebarTooltip>
							) : (
								<>
									<ProfileDropdown
										user={{
											name: user.name,
											email: user.email,
											avatar: user.image,
											plan: user.plan,
										}}
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-sidebar-foreground truncate">
											{user.name}
										</p>
										<p className="text-xs text-muted-foreground truncate capitalize">
											{user.plan} Plan
										</p>
									</div>
								</>
							)
						) : (
							// ⚙️ Not logged in → show Sign in
							<Button
								onClick={() => signIn("google")}
								className="w-full justify-center"
								variant="outline"
							>
								Sign in
							</Button>
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