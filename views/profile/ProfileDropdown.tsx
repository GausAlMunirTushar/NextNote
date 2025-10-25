// components/profile-dropdown.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import {
	User,
	Settings,
	CreditCard,
	Bell,
	LogOut,
	Moon,
	Sun,
	HelpCircle,
	Shield
} from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UserData {
	name: string
	email: string
	avatar?: string
	plan?: string
}

interface ProfileDropdownProps {
	user: UserData
	className?: string
}

export function ProfileDropdown({ user, className }: ProfileDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const { theme, setTheme } = useTheme()
	const router = useRouter()
	const { toast } = useToast()

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(part => part.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const handleSignOut = () => {
		toast({
			title: "Signed out",
			description: "You have been successfully signed out.",
		})
		// Add your sign out logic here
		router.push("/")
	}

	const handleThemeToggle = () => {
		setTheme(theme === "dark" ? "light" : "dark")
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full p-0 hover:bg-accent transition-all"
				>
					<Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary/20 transition-colors">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="bg-primary text-white font-medium text-sm">
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-64 mt-2 mr-2 p-2"
				align="end"
				forceMount
			>
				{/* User Info Section */}
				<DropdownMenuLabel className="p-3 font-normal">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600  text-white font-medium">
								{getInitials(user.name)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user.email}
							</p>
							{user.plan && (
								<div className="flex items-center gap-1 mt-1">
									<div className="w-2 h-2 rounded-full bg-green-500" />
									<span className="text-xs text-muted-foreground">
										{user.plan} Plan
									</span>
								</div>
							)}
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Quick Actions */}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/profile" className="cursor-pointer">
							<User className="h-4 w-4 mr-2" />
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link href="/settings" className="cursor-pointer">
							<Settings className="h-4 w-4 mr-2" />
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link href="/billing" className="cursor-pointer">
							<CreditCard className="h-4 w-4 mr-2" />
							Billing
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Preferences */}
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleThemeToggle} className="cursor-pointer">
						{theme === "dark" ? (
							<Sun className="h-4 w-4 mr-2" />
						) : (
							<Moon className="h-4 w-4 mr-2" />
						)}
						{theme === "dark" ? "Light Mode" : "Dark Mode"}
						<DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link href="/notifications" className="cursor-pointer">
							<Bell className="h-4 w-4 mr-2" />
							Notifications
							<DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Support & Legal */}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/help" className="cursor-pointer">
							<HelpCircle className="h-4 w-4 mr-2" />
							Help & Support
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link href="/privacy" className="cursor-pointer">
							<Shield className="h-4 w-4 mr-2" />
							Privacy & Terms
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Sign Out */}
				<DropdownMenuItem
					onClick={handleSignOut}
					className="cursor-pointer text-destructive focus:text-destructive"
				>
					<LogOut className="h-4 w-4 mr-2" />
					Sign out
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}