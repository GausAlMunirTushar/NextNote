import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
				{/* <Header /> */}
				<main className="flex-1 bg-gray-100 dark:bg-background overflow-y-auto">
					{children}
				</main>
			</div>
		</div>
	)
}