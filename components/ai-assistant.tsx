// components/ai-assistant.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Wand2, Zap, Lightbulb, FileText } from "lucide-react";
import type { Editor } from "@tiptap/react";

interface AIAssistantProps {
  editor: Editor;
}

const aiPrompts = [
  {
    icon: FileText,
    title: "Improve writing",
    description: "Enhance clarity and flow",
    prompt: "Improve this text for better clarity and flow:"
  },
  {
    icon: Zap,
    title: "Make shorter",
    description: "Summarize and condense",
    prompt: "Make this text more concise:"
  },
  {
    icon: Lightbulb,
    title: "Expand ideas",
    description: "Add more details and examples",
    prompt: "Expand on these ideas with more details:"
  },
  {
    icon: Wand2,
    title: "Fix grammar",
    description: "Correct spelling and grammar",
    prompt: "Fix any grammar and spelling errors in:"
  },
];

export function AIAssistant({ editor }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleAIAction = async (prompt: string) => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    if (!selectedText) {
      // If no text selected, use the entire document
      const fullText = editor.getText();
      // In a real implementation, you would call your AI API here
      console.log("AI action:", prompt, fullText);
    } else {
      console.log("AI action:", prompt, selectedText);
    }

    // Simulate AI response
    setTimeout(() => {
      editor.chain().focus().insertContent(" [AI Enhanced Text] ").run();
    }, 1000);
  };

  return (
    <div className="absolute top-4 right-4 z-40">
      {isOpen ? (
        <div className="w-80 bg-popover border rounded-lg shadow-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>

          <div className="grid gap-2">
            {aiPrompts.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.title}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => handleAIAction(item.prompt)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Custom prompt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && customPrompt.trim()) {
                  handleAIAction(customPrompt);
                  setCustomPrompt("");
                }
              }}
            />
            <Button 
              className="w-full"
              onClick={() => {
                if (customPrompt.trim()) {
                  handleAIAction(customPrompt);
                  setCustomPrompt("");
                }
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply AI
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI
        </Button>
      )}
    </div>
  );
}