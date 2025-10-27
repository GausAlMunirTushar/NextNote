// app/ai/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Send,
	Brain,
	Bot,
	User,
	Copy,
	CheckCheck,
	Download,
	Share2,
	Plus,
	Loader2,
	Lightbulb,
	ThumbsUp,
	ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
	liked?: boolean;
};

const quickPrompts = [
	"Write a professional email to a client",
	"Explain quantum computing in simple terms",
	"Create a workout plan for beginners",
	"Help me debug this Python code",
	"Write a creative short story about space exploration",
	"Summarize the key points of a meeting",
];

export default function AIPage() {
	// If parent provides messages via props or context, replace with that.
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const showWelcome = useMemo(() => messages.length === 0, [messages.length]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			id: crypto.randomUUID(),
			content: input,
			role: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Simulate AI response (replace with real API call)
		setTimeout(() => {
			const aiResponse: Message = {
				id: crypto.randomUUID(),
				content: `Thanks! Here's a helpful draft based on: “${userMessage.content}”. 

**What I can do next:**
- Improve tone and clarity
- Add bullet points or a summary
- Generate code snippets / examples
- Provide references or an outline

Reply with “refine” + your notes to iterate further.`,
				role: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, aiResponse]);
			setIsLoading(false);
		}, 900);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const copyToClipboard = async (text: string, messageId: string) => {
		await navigator.clipboard.writeText(text);
		setCopiedMessageId(messageId);
		setTimeout(() => setCopiedMessageId(null), 1500);
	};

	const toggleLike = (messageId: string) => {
		setMessages((prev) =>
			prev.map((m) => (m.id === messageId ? { ...m, liked: !m.liked } : m))
		);
	};

	const clearChat = () => setMessages([]);

	return (
		<div className="flex h-screen bg-background">
			{/* Main Column Only (no sidebar) */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className="border-b border-border p-3 sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="max-w-4xl mx-auto flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<Brain className="h-4 w-4 text-primary-foreground" />
						</div>
						<h1 className="text-base font-semibold">NextNote AI</h1>
						<Badge variant="secondary" className="ml-1">Beta</Badge>

						<div className="ml-auto flex items-center gap-2">
							{messages.length > 0 && (
								<Button variant="outline" size="sm" onClick={clearChat}>
									<Plus className="h-4 w-4 mr-2" />
									New
								</Button>
							)}
							<Button variant="outline" size="sm">
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
							<Button variant="outline" size="sm">
								<Download className="h-4 w-4 mr-2" />
								Export
							</Button>
						</div>
					</div>
				</header>

				{/* Chat Body */}
				<div className="flex-1 overflow-hidden">
					<div className="h-full overflow-y-auto">
						<div className="max-w-4xl mx-auto p-4 space-y-6">
							{showWelcome ? (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="mt-10 text-center space-y-8"
								>
									<div className="flex justify-center">
										<div className="relative">
											<div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
												<Brain className="h-10 w-10 text-white" />
											</div>
											<div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
												<div className="h-2 w-2 rounded-full bg-white animate-pulse" />
											</div>
										</div>
									</div>
									<div>
										<h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
											How can I help you today?
										</h2>
										<p className="text-muted-foreground max-w-xl mx-auto mt-2">
											I can help you write, brainstorm, code, research, summarize, and more.
										</p>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
										{quickPrompts.map((prompt, i) => (
											<motion.button
												key={prompt}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: i * 0.05 }}
												onClick={() => setInput(prompt)}
												className="p-4 text-left rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition"
											>
												<div className="flex items-center gap-3">
													<Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
													<span className="text-sm font-medium">{prompt}</span>
												</div>
											</motion.button>
										))}
									</div>
								</motion.div>
							) : (
								<AnimatePresence initial={false}>
									{messages.map((message) => (
										<motion.div
											key={message.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0 }}
											className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
										>
											{message.role === "assistant" && (
												<Avatar className="h-8 w-8">
													<AvatarFallback className="bg-primary text-primary-foreground">
														<Bot className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}

											<div className={`flex-1 max-w-3xl ${message.role === "user" ? "order-first" : ""}`}>
												<div className="flex items-center gap-2 mb-1">
													<span className="text-xs font-medium">
														{message.role === "user" ? "You" : "NextNote AI"}
													</span>
													<span className="text-[10px] text-muted-foreground">
														{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
													</span>
												</div>

												<Card
													className={`border ${message.role === "user"
															? "bg-primary text-primary-foreground"
															: "bg-card"
														}`}
												>
													<CardContent className="p-4">
														<div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
															{message.content}
														</div>
													</CardContent>
												</Card>

												{message.role === "assistant" && (
													<div className="flex items-center gap-1 mt-1">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() => copyToClipboard(message.content, message.id)}
															title="Copy"
														>
															{copiedMessageId === message.id ? (
																<CheckCheck className="h-4 w-4 text-green-500" />
															) : (
																<Copy className="h-4 w-4" />
															)}
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() => toggleLike(message.id)}
															title="Like"
														>
															<ThumbsUp className={`h-4 w-4 ${message.liked ? "text-green-500 fill-green-500" : ""}`} />
														</Button>
														<Button variant="ghost" size="icon" className="h-8 w-8" title="Dislike">
															<ThumbsDown className="h-4 w-4" />
														</Button>
													</div>
												)}
											</div>

											{message.role === "user" && (
												<Avatar className="h-8 w-8">
													<AvatarFallback className="bg-muted text-muted-foreground">
														<User className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}
										</motion.div>
									))}

									{isLoading && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className="flex gap-3"
										>
											<Avatar className="h-8 w-8">
												<AvatarFallback className="bg-primary text-primary-foreground">
													<Bot className="h-4 w-4" />
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 max-w-3xl">
												<div className="text-xs text-muted-foreground mb-1">NextNote AI is typing…</div>
												<Card className="border bg-card">
													<CardContent className="p-4">
														<div className="flex items-center gap-2 text-sm">
															<Loader2 className="h-4 w-4 animate-spin" />
															Generating response…
														</div>
													</CardContent>
												</Card>
											</div>
										</motion.div>
									)}

									<div ref={messagesEndRef} />
								</AnimatePresence>
							)}
						</div>
					</div>
				</div>

				{/* Composer */}
				<div className="border-t border-border p-3">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-end gap-3">
							<Textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyPress}
								placeholder="Message NextNote AI..."
								className="min-h-[56px] max-h-[200px] resize-y"
								disabled={isLoading}
							/>
							<Button
								onClick={handleSend}
								disabled={!input.trim() || isLoading}
								size="icon"
								className="h-[56px] w-[56px] flex-shrink-0"
								title="Send"
							>
								{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
							</Button>
						</div>
						<div className="flex justify-center mt-2">
							<p className="text-xs text-muted-foreground">
								NextNote AI can make mistakes. Consider checking important information.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
