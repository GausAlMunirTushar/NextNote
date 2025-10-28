"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signupSchema, type SignupInput } from "@/lib/validations/auth"

export default function SignupPage() {
	const router = useRouter()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupInput>({
		resolver: zodResolver(signupSchema),
	})

	const onSubmit = async (data: SignupInput) => {
	setIsLoading(true)

	const res = await fetch("/api/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (res.ok) {
		toast({ title: "Account created!", description: "You can now login." })
		router.push("/login")
	} else {
		const error = await res.json()
		toast({ title: "Signup failed", description: error.error, variant: "destructive" })
	}

	setIsLoading(false)
}


	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-2">
						<div className="flex items-center gap-2">
							<Image src="/logo.svg" width={100} height={100} alt="Logo" className="h-8 w-8" />
							<span className="text-2xl font-bold">NextNote</span>
						</div>
					</div>
					{/* <CardTitle className="text-xl sm:text-2xl">Create an account</CardTitle> */}
					<CardDescription className="text-sm">Enter your information to get started</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" type="text" placeholder="John Doe" {...register("name")} />
							{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
							{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" placeholder="Create a password" {...register("password")} />
							{errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Confirm your password"
								{...register("confirmPassword")}
							/>
							{errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full mt-3" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-center text-muted-foreground">
							<span>Already have an account?</span>
							<Link href="/login" className="text-primary hover:underline">
								Sign in
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
