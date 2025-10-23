"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Frown, Meh, Smile, Laugh } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  rating: z.number().min(1).max(5),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FeedbackInput = z.infer<typeof feedbackSchema>

const ratings = [
  { value: 1, label: "Terrible", icon: Frown, color: "text-red-500" },
  { value: 2, label: "Bad", icon: Frown, color: "text-orange-500" },
  { value: 3, label: "Average", icon: Meh, color: "text-yellow-500" },
  { value: 4, label: "Good", icon: Smile, color: "text-green-500" },
  { value: 5, label: "Amazing", icon: Laugh, color: "text-primary" },
]

export default function FeedbackPage() {
  const { toast } = useToast()
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
  })

  const onSubmit = async (data: FeedbackInput) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Feedback submitted!",
      description: "Thank you for your feedback. We appreciate it!",
    })

    reset()
    setSelectedRating(0)
    setIsSubmitting(false)
  }

  const handleRatingClick = (value: number) => {
    setSelectedRating(value)
    setValue("rating", value)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Give Feedback</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">We'd love to hear from you</CardTitle>
          <CardDescription>Your feedback helps us improve NextNote for everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label>How do you feel about NextNote?</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ratings.map((rating) => {
                  const Icon = rating.icon
                  return (
                    <button
                      key={rating.value}
                      type="button"
                      onClick={() => handleRatingClick(rating.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all hover:scale-105",
                        selectedRating === rating.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", rating.color)} />
                      <span className="text-xs font-medium">{rating.label}</span>
                    </button>
                  )
                })}
              </div>
              {errors.rating && <p className="text-sm text-destructive">Please select a rating</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us what you think..." rows={5} {...register("message")} />
              {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
