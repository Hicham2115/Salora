"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface Review {
  id: number
  reviewer_name: string
  review_content: string
  review_stars: number
  created_at: string
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-black/30"
          )}
        />
      ))}
    </div>
  )
}

function RatingBar({ count, total }: { count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-amber-400 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function initials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function ReviewsPage() {
  const { data: raw, isLoading } = useQuery({
    queryKey: ["reviews_data"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews_data`)
      return res.data
    },
  })

  const reviews: Review[] = Array.isArray(raw) ? raw : []
  const total = reviews.length
  const average = total > 0 ? reviews.reduce((s, r) => s + r.review_stars, 0) / total : 0

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.review_stars === star).length,
  }))

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">Reviews</h1>
        <p className="text-sm text-black">
          {total} {total === 1 ? "review" : "reviews"} · {average.toFixed(1)} average rating
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        {/* Summary card */}
        <div className="w-full shrink-0 rounded-xl border bg-card p-6 md:w-72">
          <div className="flex flex-col items-center gap-2 pb-4">
            <span className="text-6xl font-bold text-primary">
              {average.toFixed(1)}
            </span>
            <StarRating rating={Math.round(average)} />
            <p className="text-sm text-black">out of 5 · {total} reviews</p>
          </div>

          <div className="space-y-2 pt-2">
            {distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-2 text-right text-black">{star}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <RatingBar count={count} total={total} />
                <span className="w-3 text-right text-black">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="flex flex-1 flex-col gap-3">
          {isLoading && (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading reviews…</p>
          )}
          {!isLoading && reviews.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No reviews yet.</p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-black">
                    {initials(review.reviewer_name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{review.reviewer_name}</p>
                    <p className="text-xs text-black">{formatDate(review.created_at)}</p>
                  </div>
                </div>
                <StarRating rating={review.review_stars} />
              </div>
              <p className="mt-3 text-sm text-black italic">
                &ldquo;{review.review_content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
