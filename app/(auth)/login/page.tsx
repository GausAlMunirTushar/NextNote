"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import Image from "next/image"
import { signIn } from "next-auth/react";

export default function LoginPage() {
	const router = useRouter()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginInput) => {
		setIsLoading(true)
		const res = await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
		})

		if (res?.ok) {
			toast({ title: "Welcome back!", description: "Logged in successfully." })
			router.push("/dashboard")
		} else {
			toast({ title: "Login failed", description: res?.error || "Invalid credentials", variant: "destructive" })
		}

		setIsLoading(false)
	}


	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background p-4">
			<Card className="w-full max-w-md py-8">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-2">
						<div className="flex items-center gap-2">
							<Image src="/logo.svg" width={100} height={100} alt="Logo" className="h-8 w-8" />
							<span className="text-2xl font-bold">NextNote</span>
						</div>
					</div>
					<CardDescription className="text-sm">Enter your credentials to access your notes</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
							{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
							{errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full mt-3" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign in"}
						</Button>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-center text-muted-foreground">
							<span>Don't have an account?</span>
							<Link href="/signup" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
						<div className="text-center">
							<Link href="/" className="text-sm text-primary hover:underline">
								← Back to home
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
