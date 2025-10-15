import type React from "react"
import Link from "next/link"
import { FileText, Sparkles, Lock, Palette, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NextNote</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/new-note">Start Writing</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Free & Open Source</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Your thoughts, beautifully organized
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            A modern, fast, and intuitive note-taking app. Write, organize, and find your notes effortlessly. No signup
            required to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="/dashboard/new-note">Start Writing Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
              <Link href="/dashboard/all-notes">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Everything you need to stay organized</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Lightning Fast"
              description="Start writing instantly. No loading screens, no delays. Your notes are always ready."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Powerful Search"
              description="Find any note in seconds with our intelligent search that looks through titles and content."
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title="Customizable"
              description="Dark mode, light mode, or system theme. Organize with custom colored labels."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Privacy First"
              description="Your notes are stored locally. Sign up only when you want to sync across devices."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Rich Text Editor"
              description="Format your notes with bold, italic, lists, and more. Write the way you want."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Clean Interface"
              description="Beautiful, distraction-free design that lets you focus on what matters: your ideas."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-8 sm:p-12 border border-primary/10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            No credit card required. No signup needed. Just start writing.
          </p>
          <Button size="lg" asChild className="text-base">
            <Link href="/dashboard/new-note">Create Your First Note</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">NextNote</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 NextNote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}
