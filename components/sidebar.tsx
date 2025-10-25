"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
	FilePlus,
	Files,
	CheckSquare,
	Calendar,
	Star,
	Users,
	Folder,
	Trash2,
	Settings,
	ChevronLeft,
	ChevronRight,
	PanelLeftClose,
	PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ProfileDropdown } from "@/views/profile/ProfileDropdown"
import * as Tooltip from "@radix-ui/react-tooltip"

const mainNavigation = [
	{ name: "New Note", href: "/new", icon: FilePlus },
	{ name: "All Notes", href: "/notes", icon: Files },
	{ name: "Tasks", href: "/tasks", icon: CheckSquare },
]

const secondaryNavigation = [
	{ name: "Favorites", href: "/favorites", icon: Star },
	{ name: "Shared", href: "/shared", icon: Users },
	{ name: "Templates", href: "/templates", icon: Folder },
]

const footerNavigation = [
	{ name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
	className?: string
}

export function Sidebar({ className }: SidebarProps) {
	const [isCollapsed, setIsCollapsed] = useState(true)
	const [isHovered, setIsHovered] = useState(false)
	const pathname = usePathname()

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed)
	}

	const mockUser = {
		name: "John Doe",
		email: "john@example.com",
		plan: "Pro"
	}

	// Custom Tooltip Provider for sidebar
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
					"lg:translate-x-0 overflow-hidden", // Changed from overflow-x-auto to overflow-hidden
					isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
				)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Header - Only Logo and Toggle */}
				<div className={cn(
					"flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 relative min-h-[80px]",
					isCollapsed ? "px-3" : "px-4"
				)}>
					{/* Logo - Hide on hover when collapsed */}
					<div className={cn(
						"flex items-center gap-3 transition-all duration-300",
						isCollapsed ? "justify-center w-full" : "flex-1",
						isCollapsed && isHovered && "opacity-0" // Hide logo when hovered in collapsed state
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

					{/* Toggle Button - Show different icons based on state */}
					{!isCollapsed ? (
						<button
							onClick={toggleSidebar}
							className={cn(
								"flex items-center justify-center w-6 h-6 rounded-md",
								"hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
								"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							)}
						>
							<PanelLeftClose className="h-4 w-4" />
						</button>
					) : (
						// Show expand button on hover when collapsed (centered when logo is hidden)
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
								<PanelLeftOpen className="h-4 w-4" />
							</button>
						</div>
					)}
				</div>

				{/* Navigation Content */}
				<div className="flex-1 py-4 overflow-y-auto"> {/* Only vertical scrolling */}
					{/* Main Navigation */}
					<div className={cn(
						"space-y-1",
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
					{!isCollapsed && (
						<div className="mt-8 px-3">
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
					)}

					{/* Collapsed Secondary Navigation */}
					{isCollapsed && (
						<div className="mt-6 space-y-1 px-2">
							{secondaryNavigation.map((item) => {
								const isActive = pathname === item.href
								return (
									<CollapsedNavigationItem
										key={item.name}
										item={item}
										isActive={isActive}
									/>
								)
							})}
						</div>
					)}
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
						<ChevronLeft className="h-3 w-3" />
					)}
				</button>
			</div>
		</>
	)
}