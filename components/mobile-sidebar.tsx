"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
	FileText,
	FilePlus,
	Files,
	Search,
	MessageSquare,
	BookOpen,
	Settings,
	MoreHorizontal,
	Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const navigation = [
	{ name: "New Note", href: "//new", icon: FilePlus },
	{ name: "All Notes", href: "//notes", icon: Files },
	{ name: "Search Notes", href: "//search-notes", icon: Search },
	{ name: "Feedback", href: "//feedback", icon: MessageSquare },
	{ name: "Blog", href: "//blog", icon: BookOpen },
	{ name: "Settings", href: "//settings", icon: Settings },
	{ name: "More", href: "//more", icon: MoreHorizontal },
]

export function MobileSidebar() {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden">
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-64 p-0">
				<div className="flex h-full flex-col">
					<div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
						<Image src="/logo.svg" width={100} height={100} alt="Logo" className="h-8 w-8" />
						<span className="text-xl font-bold text-sidebar-foreground">NextNote</span>
					</div>
					<nav className="flex-1 space-y-1 p-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href
							return (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setOpen(false)}
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
			</SheetContent>
		</Sheet>
	)
}
