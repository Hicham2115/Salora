"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { cn } from "@/lib/utils"
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Shield,
  CalendarCheck,
  MessageSquare,
  Image as ImageIcon,
  AtSign,
} from "lucide-react"

/* ─── Types ─────────────────────────────────────────────────────── */
interface Salon {
  salon_name: string
  salon_about: string
  salon_phone: string
  salon_adresse: string
  salon_email: string
  salon_instagram?: string
  latitude?: number | null
  longitude?: number | null
  is_open?: boolean
}
interface Service {
  id: number
  name: string
  category: string
  duration: number
  price: number
}
interface Review {
  id: number
  reviewer_name: string
  review_content: string
  review_stars: number
  created_at: string
}
interface DayHours {
  open: string
  close: string
}
interface OpeningHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const DAY_KEYS: (keyof OpeningHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]
const DAY_LABELS: Record<keyof OpeningHours, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

function shortName(full: string) {
  const parts = full.trim().split(" ")
  if (parts.length === 1) return full
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function isOpenNow(hours: OpeningHours | null) {
  if (!hours) return { open: false, closes: "" }
  const now = new Date()
  const dayKey = DAY_KEYS[now.getDay() === 0 ? 6 : now.getDay() - 1]
  const today = hours[dayKey]
  if (!today) return { open: false, closes: "" }
  const cur = now.getHours() * 60 + now.getMinutes()
  const [oh, om] = today.open.split(":").map(Number)
  const [ch, cm] = today.close.split(":").map(Number)
  return {
    open: cur >= oh * 60 + om && cur < ch * 60 + cm,
    closes: today.close,
  }
}

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </span>
  )
}

/* Fake portfolio tiles (no portfolio API on public routes yet) */
const PORTFOLIO_TILES = [
  "Classic Fade",
  "Beard Sculpt",
  "Skin Fade",
  "Razor Finish",
  "Line Up",
  "Full Groom",
]

/* ─── Page ───────────────────────────────────────────────────────── */
export default function PublicBookingPage() {
  const [salon, setSalon] = useState<Salon | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [hours, setHours] = useState<OpeningHours | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [mapActive, setMapActive] = useState(false)

  // Review form state
  const [reviewName, setReviewName] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [reviewStars, setReviewStars] = useState(0)
  const [hoverStar, setHoverStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState("")

  const API = process.env.NEXT_PUBLIC_API_URL

  function fetchReviews() {
    axios
      .get(`${API}/api/reviews_data`)
      .then((r) => setReviews(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
  }

  useEffect(() => {
    axios
      .get(`${API}/api/salon_data`)
      .then((r) => setSalon(r.data?.data ?? r.data))
      .catch(() => {})
    axios
      .get(`${API}/api/services_data`)
      .then((r) => setServices(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
    fetchReviews()
    axios
      .get(`${API}/api/opening_hours_data`)
      .then((r) => setHours(r.data?.data ?? null))
      .catch(() => {})
  }, [])

  async function handleReviewSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setReviewError("")
    if (!reviewName.trim()) return setReviewError("Please enter your name.")
    if (reviewStars === 0) return setReviewError("Please select a star rating.")
    if (!reviewContent.trim()) return setReviewError("Please write a review.")
    setSubmitting(true)
    try {
      await axios.post(`${API}/api/create_review`, {
        reviewer_name: reviewName.trim(),
        review_content: reviewContent.trim(),
        review_stars: reviewStars,
      })
      setSubmitted(true)
      setReviewName("")
      setReviewContent("")
      setReviewStars(0)
      fetchReviews()
    } catch {
      setReviewError("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(services.map((s) => s.category)))],
    [services]
  )
  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? services
        : services.filter((s) => s.category === activeCategory),
    [services, activeCategory]
  )
  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + r.review_stars, 0) / reviews.length
      ).toFixed(1)
    : "5.0"

  const { open: computedOpen, closes } = isOpenNow(hours)
  const isOpen = salon?.is_open ?? computedOpen
  const todayKey =
    DAY_KEYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  const todayHours = hours?.[todayKey]

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans text-gray-900">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between bg-[#1b4331] px-8 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-white/15">
            <span className="text-md font-bold text-white">≡</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Salora
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <span className="text-white/60">
            Owner?{" "}
            <a
              href="/sign-up"
              className="text-white underline-offset-2 hover:underline"
            >
              Log in
            </a>
          </span>
          <a
            href="/sign-up"
            className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20"
          >
            Create your page →
          </a>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative flex overflow-hidden bg-[#1b4331]">
        {/* Decorative glow — large circle offset to center-right */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/4 -translate-y-1/2 rounded-full bg-white/6 blur-3xl" />
        </div>

        {/* Left — text content */}
        <div className="relative flex flex-1 flex-col justify-center px-16 py-16 text-white">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isOpen ? "bg-emerald-400" : "bg-red-400"
              )}
            />
            {isOpen ? `Open now ` : "Closed now"}
          </div>
          <h1 className="mb-3 text-6xl leading-[1.08] font-extrabold tracking-tight">
            {salon?.salon_name || "Your Salon"}
          </h1>
          <p className="mb-7 text-lg text-white/60">
            {salon?.salon_about || "Premium salon services"}
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
            {reviews.length > 0 && (
              <span className="flex items-center gap-2">
                <Stars count={Math.round(Number(avgRating))} size={16} />
                <span className="font-bold text-white">{avgRating}</span>
                <span>({reviews.length} reviews)</span>
              </span>
            )}
            {salon?.salon_adresse && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="shrink-0" />
                {salon.salon_adresse}
              </span>
            )}
          </div>
        </div>

        {/* Right — floating booking widget */}
        <div className="relative flex shrink-0 items-center px-10 py-12">
          <div className="w-[320px] rounded-2xl bg-white px-6 py-7 shadow-2xl">
            <p className="mb-0.5 text-base font-bold text-gray-900">
              Book your visit
            </p>
            <p className="mb-5 text-xs text-muted-foreground">
              {isOpen && todayHours
                ? `Available today from ${todayHours.open}`
                : "Currently closed"}
            </p>
            <div className="flex flex-col gap-2.5">
              {services.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.duration}min
                    </p>
                  </div>
                  <span className="text-lg font-extrabold text-gray-900">
                    {s.price}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      MAD
                    </span>
                  </span>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No services yet.
                </p>
              )}
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-5 w-full cursor-pointer rounded-xl bg-[#1b4331] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Book an appointment →
            </button>
          </div>
        </div>
      </section>

      {/* ── Features bar ──────────────────────────────────────── */}
      <div className="grid grid-cols-4 divide-x border-b bg-white shadow-sm">
        {[
          {
            icon: Shield,
            label: "Premium quality",
            sub: "Top-rated in the city",
          },
          {
            icon: CalendarCheck,
            label: "Easy booking",
            sub: "Book online in 60 seconds",
          },
          {
            icon: MessageSquare,
            label: "SMS reminder",
            sub: "We'll remind you 24h before",
          },
          {
            icon: Star,
            label: `${avgRating} / 5 rating`,
            sub: `${reviews.length} verified reviews`,
          },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 px-8 py-5">
            <div className="rounded-lg bg-gray-100 p-2.5">
              <Icon size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main + Sidebar ────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl gap-7 px-8 py-10">
        {/* Left column */}
        <div className="min-w-0 flex-1 space-y-12">
          {/* Our work */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Our work</h2>
              <span className="text-sm text-muted-foreground">
                {PORTFOLIO_TILES.length} photos
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PORTFOLIO_TILES.map((name, i) => (
                <div
                  key={name}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border",
                    i % 3 === 2 ? "bg-[#e8f0ec]" : "bg-gray-100"
                  )}
                >
                  <ImageIcon
                    size={28}
                    className={cn(
                      i % 3 === 2 ? "text-[#6fa882]" : "text-gray-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      i % 3 === 2 ? "text-[#4a8a62]" : "text-gray-500"
                    )}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Services & pricing */}
          <section id="services">
            <h2 className="mb-4 text-xl font-bold">Services &amp; pricing</h2>
            {/* Category pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    activeCategory === cat
                      ? "bg-[#1b4331] text-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Service cards */}
            <div className="flex flex-col gap-3">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl border bg-white px-6 py-5 shadow-sm"
                >
                  <div>
                    <p className="text-base font-bold">{s.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {s.duration} min
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-2xl font-extrabold">
                      {s.price}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        MAD
                      </span>
                    </span>
                    <button className="cursor-pointer rounded-xl bg-[#1b4331] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                      Book now
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No services in this category.
                </p>
              )}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-xl font-bold">Reviews</h2>
              {reviews.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Stars count={Math.round(Number(avgRating))} size={14} />
                  <span className="text-base font-semibold">{avgRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </span>
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                No reviews yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border bg-white px-6 py-5 shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-600">
                          {r.reviewer_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {shortName(r.reviewer_name)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(r.created_at)}
                          </p>
                        </div>
                      </div>
                      <Stars count={r.review_stars} size={14} />
                    </div>
                    <p className="text-sm text-gray-700">
                      &ldquo;{r.review_content}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Leave a review form */}
            <div className="mt-6 rounded-2xl border bg-white px-6 py-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold">Leave a review</h3>
              {submitted ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Star
                      size={18}
                      className="fill-emerald-500 text-emerald-500"
                    />
                  </div>
                  <p className="font-semibold text-gray-900">
                    Thank you for your review!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your feedback helps others find us.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 cursor-pointer text-sm text-[#1b4331] underline-offset-2 hover:underline"
                  >
                    Write another review
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleReviewSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Your name
                    </label>
                    <input
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Mohamed A."
                      className="w-full rounded-xl border bg-[#f5f3ef] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b4331]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewStars(n)}
                          onMouseEnter={() => setHoverStar(n)}
                          onMouseLeave={() => setHoverStar(0)}
                          className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={cn(
                              "transition-colors",
                              n <= (hoverStar || reviewStars)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Your review
                    </label>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Share your experience..."
                      rows={3}
                      className="w-full resize-none rounded-xl border bg-[#f5f3ef] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b4331]/30"
                    />
                  </div>
                  {reviewError && (
                    <p className="text-sm text-red-500">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer rounded-xl bg-[#1b4331] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit review"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <aside className="w-72 shrink-0 space-y-4">
          {/* CTA */}
          <div className="rounded-2xl bg-[#1b4331] p-5 text-white">
            <p className="mb-1 text-base font-bold">Ready to book?</p>
            <p className="mb-4 text-sm text-white/70">
              Choose a service and pick a time
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full cursor-pointer rounded-xl bg-white py-2.5 text-sm font-semibold text-[#1b4331] transition-opacity hover:opacity-90"
            >
              Browse services →
            </button>
          </div>

          {/* Salon info */}
          {salon && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold">Salon info</p>
              <div className="flex flex-col gap-2.5 text-sm text-gray-600">
                {salon.salon_adresse && (
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <span>{salon.salon_adresse}</span>
                  </div>
                )}
                {salon.salon_phone && (
                  <div className="flex items-center gap-2">
                    <Phone
                      size={15}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span>{salon.salon_phone}</span>
                  </div>
                )}
                {salon.salon_instagram && (
                  <div className="flex items-center gap-2">
                    <AtSign
                      size={15}
                      className="shrink-0 text-muted-foreground"
                    />
                    <a
                      href={`https://instagram.com/${salon.salon_instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1b4331] hover:underline"
                    >
                      {salon.salon_instagram.replace(/^@/, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Opening hours */}
          {hours && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold">Opening hours</p>
              <div className="flex flex-col gap-1.5">
                {DAY_KEYS.map((day) => {
                  const h = hours[day]
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{DAY_LABELS[day]}</span>
                      {h ? (
                        <span className="font-medium">
                          {h.open} – {h.close}
                        </span>
                      ) : (
                        <span className="font-medium text-red-500">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
              {isOpen && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Open now · Closes at {closes}
                </div>
              )}
            </div>
          )}

          {/* Map */}
          {salon?.salon_adresse && (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              {salon.latitude && salon.longitude ? (
                <div
                  className="relative h-48 w-full"
                  onMouseLeave={() => setMapActive(false)}
                >
                  <iframe
                    title="Salon location"
                    src={`https://maps.google.com/maps?q=${salon.latitude},${salon.longitude}&z=16&output=embed`}
                    className="h-48 w-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  {!mapActive && (
                    <div
                      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/10 transition-opacity"
                      onClick={() => setMapActive(true)}
                    >
                      <div className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
                        Click to interact with map
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#d9ede2]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b4331] shadow-lg">
                      <MapPin size={16} className="text-white" fill="white" />
                    </div>
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1b4331]/30" />
                  </div>
                </div>
              )}
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {salon.salon_adresse.split(",")[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {salon.salon_adresse.split(",").slice(1).join(",").trim()}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="mt-4 flex items-center justify-between border-t bg-[#1a1a1a] px-10 py-5">
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} {salon?.salon_name || "Your Salon"} ·
          Powered by <span className="font-semibold text-white">Salora</span>
        </p>
        <a
          href="/sign-up"
          className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          Create your salon page →
        </a>
      </footer>
    </div>
  )
}
