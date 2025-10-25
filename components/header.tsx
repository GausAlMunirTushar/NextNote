"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { ProfileDropdown } from "@/views/profile/ProfileDropdown"
import { NotificationDropdown } from "@/views/profile/NotificationDropdown"

const userData = {
	name: "Alex Johnson",
	email: "alex.johnson@example.com",
	avatar: "/avatars/alex.jpg", // Optional - will use fallback if not provided
	plan: "Pro",
	status: "online" as const // "online" | "away" | "offline"
}

export function Header() {
	const router = useRouter()

	const handleSave = () => {
		router.push("/login")
	}

	return (
		<header className="flex h-16 items-center justify-between border-b border-gray-100 dark:border-none bg-white dark:bg-background px-4 sm:px-6">
			<div className="flex items-center gap-3">
				<MobileSidebar />
				<h1 className="text-base sm:text-lg font-semibold">Dashboard</h1>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={handleSave} className="hidden sm:inline-flex bg-transparent">
					<Save className="h-4 w-4 mr-2" />
					Save & Sync
				</Button>
				<ThemeToggle />
				<NotificationDropdown />
				<ProfileDropdown user={userData} />
			</div>
		</header>
	)
}
