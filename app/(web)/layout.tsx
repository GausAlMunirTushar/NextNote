import Footer from "@/components/layouts/Footer"
import WebHeader from "@/components/layouts/WebHeader"


export default function WebLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<WebHeader />
			<main className="flex-1 bg-gray-100 dark:bg-background overflow-y-auto">
				{children}
			</main>
			<Footer />
		</>
	)
}