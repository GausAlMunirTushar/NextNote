"use client"

import type React from "react"

import { useRef, useCallback, useState, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  Code,
  Upload,
  Download,
  Copy,
  Maximize,
  Minimize,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Strikethrough,
  LinkIcon,
  ImageIcon,
  Quote,
  Minus,
  Printer,
  Search,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  title: string
  content: string
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
}

export function RichTextEditor({ title, content, onTitleChange, onContentChange }: RichTextEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showFindDialog, setShowFindDialog] = useState(false)
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [fontSize, setFontSize] = useState("16")
  const [fontFamily, setFontFamily] = useState("sans-serif")

  useEffect(() => {
    if (contentRef.current) {
      const text = contentRef.current.innerText || ""
      setCharCount(text.length)
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
    }
  }, [content])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    contentRef.current?.focus()
  }, [])

  const handleFormat = (format: string) => {
    switch (format) {
      case "heading1":
        execCommand("formatBlock", "<h1>")
        break
      case "heading2":
        execCommand("formatBlock", "<h2>")
        break
      case "heading3":
        execCommand("formatBlock", "<h3>")
        break
      case "normal":
        execCommand("formatBlock", "<p>")
        break
    }
  }

  const handleContentInput = () => {
    if (contentRef.current) {
      onContentChange(contentRef.current.innerHTML)
    }
  }

  const handleCopy = async () => {
    if (contentRef.current) {
      try {
        const text = contentRef.current.innerText
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied!",
          description: "Content copied to clipboard.",
        })
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy content.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDownload = (format: "txt" | "html" | "md") => {
    if (!contentRef.current) return

    let content = ""
    let mimeType = ""
    let extension = ""

    switch (format) {
      case "txt":
        content = contentRef.current.innerText
        mimeType = "text/plain"
        extension = "txt"
        break
      case "html":
        content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || "Untitled Document"}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>${title || "Untitled Document"}</h1>
  ${contentRef.current.innerHTML}
</body>
</html>`
        mimeType = "text/html"
        extension = "html"
        break
      case "md":
        content = convertToMarkdown(contentRef.current.innerHTML)
        mimeType = "text/markdown"
        extension = "md"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "document"}.${extension}`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: `Document saved as ${extension.toUpperCase()}.`,
    })
  }

  const convertToMarkdown = (html: string): string => {
    let md = html
    md = md.replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
    md = md.replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
    md = md.replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
    md = md.replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    md = md.replace(/<b>(.*?)<\/b>/g, "**$1**")
    md = md.replace(/<em>(.*?)<\/em>/g, "*$1*")
    md = md.replace(/<i>(.*?)<\/i>/g, "*$1*")
    md = md.replace(/<ul>(.*?)<\/ul>/gs, "$1\n")
    md = md.replace(/<li>(.*?)<\/li>/g, "- $1\n")
    md = md.replace(/<p>(.*?)<\/p>/g, "$1\n\n")
    md = md.replace(/<br\s*\/?>/g, "\n")
    md = md.replace(/<[^>]+>/g, "")
    return md.trim()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (file.type === "text/plain" || file.type === "text/html") {
        const text = await file.text()
        if (contentRef.current) {
          if (file.type === "text/html") {
            contentRef.current.innerHTML = text
          } else {
            contentRef.current.innerText = text
          }
          onContentChange(contentRef.current.innerHTML)
        }
        toast({
          title: "File uploaded!",
          description: "Content loaded successfully.",
        })
      } else if (file.type === "application/pdf") {
        toast({
          title: "PDF Upload",
          description: "PDF text extraction requires a backend service. Showing placeholder text.",
        })
        if (contentRef.current) {
          contentRef.current.innerHTML = `<p>PDF content from: ${file.name}</p><p>Note: Full PDF text extraction requires server-side processing.</p>`
          onContentChange(contentRef.current.innerHTML)
        }
      } else {
        toast({
          title: "Unsupported format",
          description: "Please upload TXT, HTML, or PDF files.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to read file.",
        variant: "destructive",
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = `<img src="${event.target?.result}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`
      document.execCommand("insertHTML", false, img)
      if (contentRef.current) {
        onContentChange(contentRef.current.innerHTML)
      }
    }
    reader.readAsDataURL(file)

    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const handleInsertLink = () => {
    if (linkUrl) {
      execCommand("createLink", linkUrl)
      setLinkUrl("")
      setShowLinkDialog(false)
      toast({
        title: "Link inserted!",
        description: "Link added to selected text.",
      })
    }
  }

  const handleFind = () => {
    if (findText && contentRef.current) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(contentRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)

      if (window.find(findText)) {
        toast({
          title: "Found!",
          description: `Found "${findText}" in document.`,
        })
      } else {
        toast({
          title: "Not found",
          description: `"${findText}" not found in document.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleReplace = () => {
    if (findText && replaceText && contentRef.current) {
      const html = contentRef.current.innerHTML
      const newHtml = html.replace(new RegExp(findText, "g"), replaceText)
      contentRef.current.innerHTML = newHtml
      onContentChange(newHtml)
      toast({
        title: "Replaced!",
        description: `Replaced all instances of "${findText}".`,
      })
    }
  }

  const handleClear = () => {
    if (contentRef.current) {
      contentRef.current.innerHTML = ""
      onContentChange("")
      onTitleChange("")
      toast({
        title: "Cleared!",
        description: "Document cleared.",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleFontSize = (size: string) => {
    setFontSize(size)
    if (contentRef.current) {
      contentRef.current.style.fontSize = `${size}px`
    }
  }

  const handleFontFamily = (family: string) => {
    setFontFamily(family)
    execCommand("fontName", family)
  }

  return (
    <>
      <div className={cn("flex flex-col h-full", isFullscreen && "fixed inset-0 z-50 bg-background")}>
        <div className="border-b border-border bg-muted/30 p-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max flex-wrap">
            {/* Format dropdown */}
            <Select onValueChange={handleFormat} defaultValue="normal">
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder="Normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="heading1">Heading 1</SelectItem>
                <SelectItem value="heading2">Heading 2</SelectItem>
                <SelectItem value="heading3">Heading 3</SelectItem>
              </SelectContent>
            </Select>

            {/* Font family */}
            <Select onValueChange={handleFontFamily} defaultValue="sans-serif">
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Courier New">Courier</SelectItem>
              </SelectContent>
            </Select>

            {/* Font size */}
            <Select onValueChange={handleFontSize} defaultValue="16">
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
                <SelectItem value="24">24px</SelectItem>
                <SelectItem value="32">32px</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Text formatting */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("underline")}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("strikeThrough")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Text color */}
            <input
              type="color"
              onChange={(e) => execCommand("foreColor", e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-border"
              title="Text Color"
            />
            <input
              type="color"
              onChange={(e) => execCommand("backColor", e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-border"
              title="Highlight Color"
            />

            <div className="h-6 w-px bg-border mx-1" />

            {/* Alignment */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("justifyLeft")}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("justifyCenter")}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("justifyRight")}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("justifyFull")}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Lists */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("insertUnorderedList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("insertOrderedList")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Insert elements */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowLinkDialog(true)}
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => imageInputRef.current?.click()}
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("formatBlock", "<blockquote>")}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("insertHorizontalRule")}
              title="Horizontal Line"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => execCommand("formatBlock", "<pre>")}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Undo/Redo */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("undo")} title="Undo">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("redo")} title="Redo">
              <Redo className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Actions */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              title="Upload File"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDownload("txt")}
              title="Download as TXT"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowFindDialog(true)}
              title="Find & Replace"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrint} title="Print">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClear} title="Clear Document">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen} title="Fullscreen">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Document"
            className="text-xl sm:text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 mb-4"
          />
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentInput}
            className="w-full min-h-[300px] sm:min-h-[500px] border-none bg-transparent text-foreground focus:outline-none prose prose-sm sm:prose max-w-none"
            style={{ fontSize: `${fontSize}px`, fontFamily }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="border-t border-border bg-muted/30 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleDownload("html")}>
              Save as HTML
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleDownload("md")}>
              Save as Markdown
            </Button>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".txt,.html,.pdf" onChange={handleFileUpload} className="hidden" />
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Enter the URL for the link</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertLink}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFindDialog} onOpenChange={setShowFindDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find and Replace</DialogTitle>
            <DialogDescription>Search and replace text in your document</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="find-text">Find</Label>
              <Input
                id="find-text"
                placeholder="Search text..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="replace-text">Replace with</Label>
              <Input
                id="replace-text"
                placeholder="Replacement text..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleFind}>
              Find
            </Button>
            <Button onClick={handleReplace}>Replace All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
