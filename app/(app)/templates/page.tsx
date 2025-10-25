// app/templates/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTemplatesStore } from "@/store/templates-store"
import { useNotesStore } from "@/store/notes-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Star, 
  TrendingUp, 
  Filter,
  Copy,
  Edit,
  Trash2,
  Grid,
  List
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "work",
    icon: "📄",
    content: "",
    tags: [] as string[],
    isPublic: true
  })

  const { 
    templates, 
    userTemplates, 
    getPopularTemplates, 
    searchTemplates, 
    getCategories,
    createTemplate,
    deleteTemplate,
    duplicateTemplate,
    incrementUsage
  } = useTemplatesStore()

  const { addNote } = useNotesStore()

  const categories = getCategories()
  const popularTemplates = getPopularTemplates(6)
  
  const allTemplates = [...templates, ...userTemplates]
  const filteredTemplates = selectedCategory === "all" 
    ? allTemplates 
    : allTemplates.filter(template => template.category === selectedCategory)
  
  const searchedTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : filteredTemplates

  const handleUseTemplate = (template: any) => {
    incrementUsage(template.id)
    
    // Create a new note from template
    const newNote = {
      title: template.name,
      content: template.content,
      labels: [...template.tags],
      folderId: null,
      starred: false,
    }

    addNote(newNote)
    
    // Navigate to the new note (you might need to adjust this based on your store)
    const notes = useNotesStore.getState().notes
    const latestNote = notes[notes.length - 1]
    router.push(`/notes/${latestNote.id}`)
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) return

    createTemplate(newTemplate)
    setNewTemplate({
      name: "",
      description: "",
      category: "work",
      icon: "📄",
      content: "",
      tags: [],
      isPublic: true
    })
    setIsCreateDialogOpen(false)
  }

  const handleDuplicateTemplate = (templateId: string) => {
    duplicateTemplate(templateId)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplate(templateId)
    }
  }

  const categoryIcons: { [key: string]: string } = {
    all: "📁",
    work: "💼",
    personal: "👤",
    productivity: "⚡",
    learning: "🎓",
    creativity: "🎨"
  }

  const categoryNames: { [key: string]: string } = {
    all: "All Templates",
    work: "Work",
    personal: "Personal",
    productivity: "Productivity",
    learning: "Learning",
    creativity: "Creativity"
  }

  const TemplateCard = ({ template, showActions = true }: { template: any; showActions?: boolean }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{template.icon}</span>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {template.description}
              </CardDescription>
            </div>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Use Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                {userTemplates.find(t => t.id === template.id) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="capitalize">{template.category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>{template.usageCount}</span>
          </div>
        </div>

        <Button 
          className="w-full mt-3" 
          onClick={() => handleUseTemplate(template)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Jumpstart your notes with pre-built templates</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a custom template for your notes.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Template Name *</label>
                    <Input
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="Enter template name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md mt-1 bg-background"
                    >
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>
                          {categoryNames[category]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Describe what this template is for"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Template Content *</label>
                  <Textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    placeholder="Enter your template content. Use {{placeholders}} for dynamic fields."
                    rows={12}
                    className="mt-1 resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {'{{placeholders}}'} for dynamic fields that users can fill in.
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTemplate} 
                    disabled={!newTemplate.name.trim() || !newTemplate.content.trim()}
                  >
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Popular Templates */}
      {!searchQuery && selectedCategory === "all" && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Popular Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2"
            >
              <span>{categoryIcons[category]}</span>
              {categoryNames[category]}
            </Button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {searchQuery ? "Search Results" : categoryNames[selectedCategory]}
          </h2>
          <span className="text-sm text-muted-foreground">
            {searchedTemplates.length} templates
          </span>
        </div>

        {searchedTemplates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-4xl mb-4 opacity-50">📄</div>
              <h3 className="font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "No templates match your search. Try different keywords."
                  : "No templates in this category yet."
                }
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {searchedTemplates.map(template => (
              <Card key={template.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" />
                            <span>{template.usageCount} uses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {userTemplates.find(t => t.id === template.id) && (
                            <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}