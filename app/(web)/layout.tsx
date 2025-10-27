

export default function WebLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex-1 bg-gray-100 dark:bg-background overflow-y-auto p-2">
			{children}
		</main>
	)
}