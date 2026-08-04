"use client"

import { useState, useEffect } from "react"
import {
  Copy,
  ExternalLink,
  MessageCircle,
  Share2,
  Eye,
  CalendarCheck,
  TrendingUp,
  Check,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function BookingPageDashboard() {
  const { user } = useUser()
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("")

  // window is undefined during SSR, so the real origin can only be read after mount
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Owner Data
  const { data: salonRaw } = useQuery({
    queryKey: ["owner_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/salon_data`
      )
      return res.data
    },
  })
  // Booking Data
  const { data: bookingRaw } = useQuery({
    queryKey: ["booking_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings_data`
      )
      return res.data
    },
  })

  // salon_data
  const salon = salonRaw?.data ?? salonRaw ?? null
  const bookingCount = Array.isArray(bookingRaw?.data)
    ? bookingRaw.data.length
    : Array.isArray(bookingRaw)
      ? bookingRaw.length
      : 0

  const stats = [
    {
      label: "Page views this month",
      value: "1,284",
      icon: Eye,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15",
    },
    {
      label: "Bookings from page",
      value: bookingCount,
      icon: CalendarCheck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15",
    },
    {
      label: "Conversion rate",
      value: "3.7%",
      icon: TrendingUp,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15",
    },
  ]

  const { data: servicesRaw } = useQuery({
    queryKey: ["services_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services_data`
      )
      return res.data
    },
  })
  const services = Array.isArray(servicesRaw) ? servicesRaw : []

  const publicPath = user?.id ? `/book/${user.id}` : null
  const publicUrl = publicPath ? `${origin}${publicPath}` : ""
  const displayUrl = publicPath ? `salora.ma${publicPath}` : "Loading..."

  function handleCopy() {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Booking Page</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Share this link with your clients
          </p>
        </div>
        {publicUrl && (
          <Button className="cursor-pointer gap-2 py-5" asChild>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} />
              Open live page
            </a>
          </Button>
        )}
      </div>

      {/* Public link */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-card p-5">
        <p className="mb-3 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Your public link
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-muted px-4 py-2.5">
            <ExternalLink
              size={14}
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate text-sm font-medium text-white">
              {displayUrl}
            </span>
          </div>
          <button
            onClick={handleCopy}
            disabled={!publicUrl}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
              copied
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-[#1a1a1a] text-white hover:bg-white/5"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={
              publicUrl
                ? `https://wa.me/?text=Book+your+appointment+at+${encodeURIComponent(publicUrl)}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            <MessageCircle size={14} className="text-green-500" />
            Share on WhatsApp
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            <Share2 size={14} className="text-pink-500" />
            Share on Instagram
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-card p-5"
          >
            <div className={cn("mb-3 w-fit rounded-lg p-2", s.iconBg)}>
              <s.icon size={18} className={s.iconColor} />
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Preview mockup */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-muted px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1.5">
            <ExternalLink
              size={11}
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate text-xs text-muted-foreground">
              {displayUrl}
            </span>
          </div>
          {publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-white"
            >
              Open full page ↗
            </a>
          )}
        </div>

        {/* Static mockup of the public page's hero */}
        <div className="relative overflow-hidden bg-[#0e0e0e] px-10 py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-10">
            <div className="flex max-w-sm flex-col">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    salon?.is_open ? "bg-emerald-400" : "bg-red-400"
                  )}
                />
                {salon?.is_open ? "Open now" : "Closed now"}
              </div>
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white">
                {salon?.salon_name || "Your Salon"}
              </h2>
              <p className="mb-4 text-sm text-white/60">
                {salon?.salon_about || "Premium salon services"}
              </p>
              {salon?.salon_adresse && (
                <span className="flex items-center gap-1.5 text-xs text-white/60">
                  <MapPin size={12} className="shrink-0" />
                  {salon.salon_adresse}
                </span>
              )}
            </div>

            <div className="w-65 shrink-0 rounded-2xl border border-white/10 bg-[#141414] px-5 py-6 shadow-2xl">
              <p className="mb-3 text-sm font-bold text-white">
                Book your visit
              </p>
              <div className="flex flex-col gap-2">
                {services.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2"
                  >
                    <p className="text-xs font-semibold text-white">{s.name}</p>
                    <span className="text-sm font-extrabold text-white">
                      {s.price}{" "}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        MAD
                      </span>
                    </span>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No services yet.
                  </p>
                )}
              </div>
              <div className="mt-4 w-full rounded-lg bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground">
                Book an appointment →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
