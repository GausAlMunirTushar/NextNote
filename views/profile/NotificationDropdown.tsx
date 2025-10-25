// components/notification-dropdown.tsx
"use client"

import { useState, useEffect } from "react"
import {
	Bell,
	Check,
	X,
	MoreHorizontal,
	User,
	Share2,
	Edit3,
	Star,
	MessageSquare,
	Users
} from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Notification {
	id: string
	type: 'mention' | 'share' | 'edit' | 'star' | 'comment' | 'collaborator'
	title: string
	description: string
	timestamp: Date
	read: boolean
	avatar?: string
	user?: string
	noteId?: string
}

interface NotificationDropdownProps {
	className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [hasNewNotifications, setHasNewNotifications] = useState(false)
	const { toast } = useToast()

	// Mock data - replace with actual API calls
	useEffect(() => {
		const mockNotifications: Notification[] = [
			{
				id: "1",
				type: "share",
				title: "Note Shared",
				description: "Sarah shared 'Meeting Notes' with you",
				timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
				read: false,
				avatar: "/avatars/sarah.jpg",
				user: "Sarah Wilson",
				noteId: "note-123"
			},
			{
				id: "2",
				type: "mention",
				title: "You were mentioned",
				description: "Mike mentioned you in 'Project Ideas'",
				timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
				read: false,
				avatar: "/avatars/mike.jpg",
				user: "Mike Chen",
				noteId: "note-456"
			},
			{
				id: "3",
				type: "edit",
				title: "Note Updated",
				description: "Emma updated 'Team Meeting Agenda'",
				timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
				read: true,
				avatar: "/avatars/emma.jpg",
				user: "Emma Davis",
				noteId: "note-789"
			},
			{
				id: "4",
				type: "star",
				title: "Note Starred",
				description: "Your note 'Research Findings' was starred by John",
				timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
				read: true,
				avatar: "/avatars/john.jpg",
				user: "John Smith",
				noteId: "note-101"
			}
		]

		setNotifications(mockNotifications)
		setHasNewNotifications(mockNotifications.some(n => !n.read))
	}, [])

	const getNotificationIcon = (type: Notification['type']) => {
		const iconClass = "h-4 w-4"

		switch (type) {
			case 'mention':
				return <User className={iconClass} />
			case 'share':
				return <Share2 className={iconClass} />
			case 'edit':
				return <Edit3 className={iconClass} />
			case 'star':
				return <Star className={iconClass} />
			case 'comment':
				return <MessageSquare className={iconClass} />
			case 'collaborator':
				return <Users className={iconClass} />
			default:
				return <Bell className={iconClass} />
		}
	}

	const getNotificationColor = (type: Notification['type']) => {
		switch (type) {
			case 'mention':
				return "text-blue-500 bg-blue-500/10"
			case 'share':
				return "text-green-500 bg-green-500/10"
			case 'edit':
				return "text-purple-500 bg-purple-500/10"
			case 'star':
				return "text-yellow-500 bg-yellow-500/10"
			case 'comment':
				return "text-orange-500 bg-orange-500/10"
			case 'collaborator':
				return "text-pink-500 bg-pink-500/10"
			default:
				return "text-gray-500 bg-gray-500/10"
		}
	}

	const formatTimeAgo = (timestamp: Date) => {
		const now = new Date()
		const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)

		if (diffInSeconds < 60) return 'Just now'
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
		if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

		return timestamp.toLocaleDateString()
	}

	const markAsRead = (notificationId: string) => {
		setNotifications(prev =>
			prev.map(notif =>
				notif.id === notificationId ? { ...notif, read: true } : notif
			)
		)
		setHasNewNotifications(notifications.some(n => !n.read && n.id !== notificationId))
	}

	const markAllAsRead = () => {
		setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
		setHasNewNotifications(false)
		toast({
			title: "All notifications marked as read",
			description: "You're all caught up!",
		})
	}

	const clearNotification = (notificationId: string) => {
		setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
		setHasNewNotifications(notifications.some(n => !n.read && n.id !== notificationId))
		toast({
			title: "Notification removed",
		})
	}

	const handleNotificationClick = (notification: Notification) => {
		markAsRead(notification.id)
		// Navigate to the relevant note or perform action
		if (notification.noteId) {
			// router.push(`/notes/${notification.noteId}`)
			toast({
				title: "Opening note",
				description: `Opening ${notification.title}`,
			})
		}
	}

	const unreadCount = notifications.filter(n => !n.read).length

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"relative h-9 w-9 rounded-lg hover:bg-accent transition-all",
						hasNewNotifications && "text-primary",
						className
					)}
				>
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-0 rounded-full animate-pulse"
						>
							{unreadCount > 9 ? "9+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-80 mt-2 mr-2 p-0 rounded-xl shadow-lg max-h-[480px] overflow-hidden"
				align="end"
				forceMount
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<div>
						<h3 className="font-semibold text-lg">Notifications</h3>
						<p className="text-sm text-muted-foreground">
							{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
						</p>
					</div>

					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={markAllAsRead}
							className="text-xs h-8"
						>
							<Check className="h-3 w-3 mr-1" />
							Mark all read
						</Button>
					)}
				</div>

				{/* Notifications List */}
				<div className="overflow-y-auto max-h-96">
					{notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<div className="rounded-full bg-muted p-3 mb-3">
								<Bell className="h-6 w-6 text-muted-foreground" />
							</div>
							<p className="font-medium text-sm">No notifications</p>
							<p className="text-sm text-muted-foreground mt-1">
								We'll notify you when something arrives
							</p>
						</div>
					) : (
						<div className="divide-y">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={cn(
										"p-4 hover:bg-accent/50 transition-colors cursor-pointer group relative",
										!notification.read && "bg-blue-50 dark:bg-blue-950/20"
									)}
									onClick={() => handleNotificationClick(notification)}
								>
									{/* Main Content */}
									<div className="flex gap-3">
										{/* Avatar/Icon */}
										<div className="flex-shrink-0">
											{notification.avatar ? (
												<Avatar className="h-10 w-10">
													<AvatarImage src={notification.avatar} alt={notification.user} />
													<AvatarFallback className={getNotificationColor(notification.type)}>
														{getNotificationIcon(notification.type)}
													</AvatarFallback>
												</Avatar>
											) : (
												<div className={cn(
													"h-10 w-10 rounded-full flex items-center justify-center",
													getNotificationColor(notification.type)
												)}>
													{getNotificationIcon(notification.type)}
												</div>
											)}
										</div>

										{/* Text Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2">
												<p className="font-medium text-sm leading-tight">
													{notification.title}
												</p>
												<span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
													{formatTimeAgo(notification.timestamp)}
												</span>
											</div>

											<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
												{notification.description}
											</p>

											{notification.user && (
												<div className="flex items-center gap-1 mt-2">
													<span className="text-xs text-muted-foreground">
														by {notification.user}
													</span>
												</div>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={(e) => {
												e.stopPropagation()
												clearNotification(notification.id)
											}}
										>
											<X className="h-3 w-3" />
										</Button>
									</div>

									{/* Unread Indicator */}
									{!notification.read && (
										<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				{notifications.length > 0 && (
					<>
						<DropdownMenuSeparator />
						<div className="p-2">
							<Button
								variant="ghost"
								className="w-full justify-center text-sm"
								onClick={() => {
									// Navigate to full notifications page
									// router.push('/notifications')
									toast({
										title: "View all notifications",
										description: "Opening notifications page",
									})
								}}
							>
								View All Notifications
							</Button>
						</div>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}