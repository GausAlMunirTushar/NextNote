// components/comments-extension.tsx
"use client";

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { MessageCircle, X, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useRef, useEffect } from 'react'

export interface Comment {
  id: string
  from: number
  to: number
  content: string
  author: string
  createdAt: Date
  resolved?: boolean
}

interface CommentsStorage {
  comments: Comment[]
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void
  updateComment: (id: string, updates: Partial<Comment>) => void
  deleteComment: (id: string) => void
  resolveComment: (id: string) => void
}

// Mock storage - in real app, use your backend
const createCommentsStorage = (): CommentsStorage => {
  let comments: Comment[] = []

  return {
    get comments() {
      return comments
    },
    addComment(comment) {
      const newComment: Comment = {
        ...comment,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      }
      comments.push(newComment)
      return newComment
    },
    updateComment(id, updates) {
      const comment = comments.find(c => c.id === id)
      if (comment) {
        Object.assign(comment, updates)
      }
    },
    deleteComment(id) {
      comments = comments.filter(c => c.id !== id)
    },
    resolveComment(id) {
      const comment = comments.find(c => c.id === id)
      if (comment) {
        comment.resolved = true
      }
    },
  }
}

const commentsStorage = createCommentsStorage()

export const CommentsExtension = Extension.create({
  name: 'comments',

  addStorage() {
    return {
      comments: commentsStorage.comments,
      addComment: commentsStorage.addComment,
      updateComment: commentsStorage.updateComment,
      deleteComment: commentsStorage.deleteComment,
      resolveComment: commentsStorage.resolveComment,
      activeComment: null as string | null,
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        key: new PluginKey('comments'),

        props: {
          decorations(state) {
            const comments = commentsStorage.comments.filter(comment => !comment.resolved)
            
            const decos = comments.flatMap(comment => {
              return [
                Decoration.inline(comment.from, comment.to, {
                  class: 'bg-yellow-200 dark:bg-yellow-900 rounded-sm',
                }),
                Decoration.widget(comment.from, () => {
                  const widget = document.createElement('span')
                  widget.className = 'comment-widget'
                  widget.innerHTML = '💬'
                  widget.style.cssText = `
                    cursor: pointer;
                    margin-left: 2px;
                    font-size: 12px;
                    vertical-align: super;
                  `
                  widget.onclick = () => {
                    // Use the storage properly
                    if (editor.storage.comments) {
                      editor.storage.comments.activeComment = comment.id
                    }
                    editor.chain().focus().run()
                  }
                  return widget
                }),
              ]
            })

            return DecorationSet.create(state.doc, decos)
          },
        },
      }),
    ]
  },
})

// Comments Sidebar Component
interface CommentsSidebarProps {
  editor: any
  isOpen: boolean
  onClose: () => void
}

export function CommentsSidebar({ editor, isOpen, onClose }: CommentsSidebarProps) {
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const comments = commentsStorage.comments
  const activeComment = editor?.storage.comments?.activeComment

  const handleAddComment = () => {
    if (!newComment.trim() || !editor) return

    const { from, to } = editor.state.selection
    if (from === to) return // No text selected

    const selectedText = editor.state.doc.textBetween(from, to)
    
    commentsStorage.addComment({
      from,
      to,
      content: newComment,
      author: 'You',
    })

    setNewComment('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleUpdateComment = (id: string) => {
    if (!editContent.trim()) return

    commentsStorage.updateComment(id, { content: editContent })
    setEditingComment(null)
    setEditContent('')
  }

  const handleDeleteComment = (id: string) => {
    commentsStorage.deleteComment(id)
    if (activeComment === id) {
      editor.storage.comments.activeComment = null
    }
  }

  const handleResolveComment = (id: string) => {
    commentsStorage.resolveComment(id)
    if (activeComment === id) {
      editor.storage.comments.activeComment = null
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditContent('')
  }

  if (!isOpen) return null

  return (
    <div className="w-80 bg-background border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Comments ({comments.filter(c => !c.resolved).length})
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* New Comment Input */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddComment()
              }
            }}
          />
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Add
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
          </div>
        ) : (
          comments
            .filter(comment => !comment.resolved)
            .map((comment) => (
              <div
                key={comment.id}
                className={`p-3 rounded-lg border ${
                  activeComment === comment.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateComment(comment.id)
                        } else if (e.key === 'Escape') {
                          cancelEditing()
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateComment(comment.id)}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {comment.author.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => startEditing(comment)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveComment(comment.id)}
                    >
                      Resolve
                    </Button>
                  </>
                )}
              </div>
            ))
        )}

        {/* Resolved Comments */}
        {comments.some(comment => comment.resolved) && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Resolved Comments
            </h4>
            {comments
              .filter(comment => comment.resolved)
              .map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg border border-border opacity-60"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-muted text-xs flex items-center justify-center">
                      {comment.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{comment.author}</span>
                  </div>
                  <p className="text-sm line-through">{comment.content}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for using comments
export function useComments(editor: any) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  const addComment = (content: string) => {
    if (!editor) return

    const { from, to } = editor.state.selection
    if (from === to) return

    commentsStorage.addComment({
      from,
      to,
      content,
      author: 'You',
    })
  }

  const toggleComments = () => {
    setIsCommentsOpen(!isCommentsOpen)
  }

  return {
    isCommentsOpen,
    toggleComments,
    addComment,
    comments: commentsStorage.comments,
  }
}