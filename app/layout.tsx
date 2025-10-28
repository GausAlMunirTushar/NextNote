import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"
import { Suspense } from "react"
import NextAuthSessionProvider from "@/components/session-provider"; // ✅
import AuthSessionSync from "@/components/auth-session-sync"; // ✅

export const metadata: Metadata = {
	title: "NextNote - Modern Note Taking App",
	description: "Modern Note Taking App",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
				<Suspense fallback={<div>Loading...</div>}>
					<ThemeProvider>
						
            <NextAuthSessionProvider>
              <AuthSessionSync /> 
              {children}
              <Toaster />
            </NextAuthSessionProvider>
					</ThemeProvider>
				</Suspense>
				<Analytics />
			</body>
		</html>
	)
}
