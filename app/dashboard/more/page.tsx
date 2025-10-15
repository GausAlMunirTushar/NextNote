import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Info, Shield, FileText } from "lucide-react"

const moreLinks = [
  {
    title: "About NextNote",
    description: "Learn more about our mission and the team behind NextNote",
    icon: Info,
  },
  {
    title: "Help Center",
    description: "Find answers to common questions and troubleshooting guides",
    icon: HelpCircle,
  },
  {
    title: "Privacy Policy",
    description: "Read about how we protect and handle your data",
    icon: Shield,
  },
  {
    title: "Terms of Service",
    description: "Review the terms and conditions for using NextNote",
    icon: FileText,
  },
]

export default function MorePage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">More</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Additional resources and information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
        {moreLinks.map((link) => {
          const Icon = link.icon
          return (
            <Card key={link.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{link.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">{link.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
