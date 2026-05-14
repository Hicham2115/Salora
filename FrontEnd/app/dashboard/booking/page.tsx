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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const stats = [
  {
    label: "Page views this month",
    value: "1,284",
    icon: Eye,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    label: "Bookings from page",
    value: "47",
    icon: CalendarCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    label: "Conversion rate",
    value: "3.7%",
    icon: TrendingUp,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
]

export default function BookingPageDashboard() {
  const { user } = useUser()
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

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
    <div className="min-h-screen bg-[#f2ede6] p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Booking Page</h1>
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
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-3 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Your public link
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border bg-[#f2ede6] px-4 py-2.5">
            <ExternalLink size={14} className="shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium text-gray-800">
              {displayUrl}
            </span>
          </div>
          <button
            onClick={handleCopy}
            disabled={!publicUrl}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
              copied
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={publicUrl ? `https://wa.me/?text=Book+your+appointment+at+${encodeURIComponent(publicUrl)}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <MessageCircle size={14} className="text-green-500" />
            Share on WhatsApp
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Share2 size={14} className="text-pink-500" />
            Share on Instagram
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className={cn("mb-3 w-fit rounded-lg p-2", s.iconBg)}>
              <s.icon size={18} className={s.iconColor} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Browser preview */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b bg-gray-50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-md border bg-white px-3 py-1.5">
            <ExternalLink size={11} className="shrink-0 text-muted-foreground" />
            <span className="truncate text-xs text-muted-foreground">
              {displayUrl}
            </span>
          </div>
          {publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-gray-800"
            >
              Open full page ↗
            </a>
          )}
        </div>

        {/* Scaled iframe */}
        {publicPath ? (
          <div className="relative overflow-hidden" style={{ height: "580px" }}>
            <iframe
              src={publicPath}
              title="Public booking page preview"
              style={{
                width: "1280px",
                height: "900px",
                transform: "scale(0.72)",
                transformOrigin: "top left",
                pointerEvents: "none",
                border: "none",
              }}
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Loading preview…
          </div>
        )}
      </div>
    </div>
  )
}
