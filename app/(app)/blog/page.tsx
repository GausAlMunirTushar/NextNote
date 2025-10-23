import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with NextNote",
    excerpt: "Learn how to create your first note and organize your thoughts effectively with NextNote.",
    date: "October 10, 2025",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Organizing Notes with Labels",
    excerpt: "Discover how to use labels and tags to keep your notes organized and easily searchable.",
    date: "October 8, 2025",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Keyboard Shortcuts Guide",
    excerpt: "Master NextNote with these essential keyboard shortcuts to boost your productivity.",
    date: "October 5, 2025",
    readTime: "3 min read",
  },
  {
    id: 4,
    title: "Dark Mode Best Practices",
    excerpt: "Tips for using dark mode effectively and reducing eye strain during long writing sessions.",
    date: "October 1, 2025",
    readTime: "6 min read",
  },
]

export default function BlogPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Blog</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Tutorials, tips, and updates about NextNote</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
                <span>•</span>
                <BookOpen className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <CardTitle className="text-lg sm:text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">{post.excerpt}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
