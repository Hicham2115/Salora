"use client"

import { useMemo, useState } from "react"
import {
  Monitor,
  UserRound,
  CalendarDays,
  ExternalLink,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import BookingPopUp from "@/components/BookingPopUp"

interface Booking {
  id: number
  client_name: string
  phone: string | null
  service: string
  staff: string
  date: string // YYYY-MM-DD
  time: string
  duration: number
  price: number
  status: "confirmed" | "cancelled"
  notes: string | null
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function localDateStr(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const offset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return { offset, daysInMonth }
}

export default function OverviewPage() {
  const today = new Date()
  const todayStr = localDateStr(today)
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const { user } = useUser()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: bookingsRaw } = useQuery({
    queryKey: ["bookings_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings_data`
      )
      return res.data
    },
  })

  const { data: clientsRaw } = useQuery({
    queryKey: ["clients_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients_data`
      )
      return res.data
    },
  })

  const bookings: Booking[] = Array.isArray(bookingsRaw) ? bookingsRaw : []
  const totalClients: number = Array.isArray(clientsRaw) ? clientsRaw.length : 0

  // Week bounds (Mon–Sun)
  const weekBounds = useMemo(() => {
    const d = new Date(today)
    const dow = d.getDay()
    const mondayOffset = dow === 0 ? -6 : 1 - dow
    const mon = new Date(d)
    mon.setDate(d.getDate() + mondayOffset)
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    return { start: localDateStr(mon), end: localDateStr(sun) }
  }, [])

  const todaysBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.date.substring(0, 10) === todayStr && b.status === "confirmed")
        .sort((a, b) => a.time.localeCompare(b.time)),
    [bookings, todayStr]
  )

  const weekCount = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.date.substring(0, 10) >= weekBounds.start &&
          b.date.substring(0, 10) <= weekBounds.end &&
          b.status === "confirmed"
      ).length,
    [bookings, weekBounds]
  )

  const bookedDays = useMemo(
    () =>
      new Set(
        bookings
          .filter((b) => {
            const d = new Date(b.date)
            return (
              d.getFullYear() === calYear &&
              d.getMonth() === calMonth &&
              b.status === "confirmed"
            )
          })
          .map((b) => new Date(b.date).getDate())
      ),
    [bookings, calYear, calMonth]
  )

  const stats = [
    {
      icon: Monitor,
      value: todaysBookings.length,
      label: "Today's bookings",
      badge: `${todaysBookings.length} confirmed`,
      badgeColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: CalendarDays,
      value: weekCount,
      label: "This week",
      badge: `Mon – Sun`,
      badgeColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: UserRound,
      value: totalClients,
      label: "Active clients",
      badge: `${totalClients} total`,
      badgeColor: "text-orange-600 bg-orange-50",
      iconColor: "text-orange-400",
    },
  ]

  const { offset, daysInMonth } = getCalendarDays(calYear, calMonth)
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - offset + 1
    return day >= 1 && day <= daysInMonth ? day : null
  })

  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  function prevMonth() {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11) }
    else setCalMonth((m) => m - 1)
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0) }
    else setCalMonth((m) => m + 1)
  }

  return (
    <div className="min-h-screen bg-[#f2ede6] p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.fullName || "Guest User"}
            <span className="text-primary">✦</span>
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {dateStr} · {todaysBookings.length} appointments today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="cursor-pointer gap-2 bg-white py-5">
            <ExternalLink size={15} />
            View public page
          </Button>
          <Button className="cursor-pointer gap-2 py-5" onClick={() => setDialogOpen(true)}>
            <Plus size={15} />
            New booking
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-[#f2ede9] p-2">
                <stat.icon size={18} className={stat.iconColor ?? "text-gray-500"} />
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", stat.badgeColor)}>
                {stat.badge}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar + Appointments */}
      <div className="grid grid-cols-[1fr_360px] gap-4">
        {/* Calendar */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {MONTH_NAMES[calMonth]} {calYear}
              </h2>
              <p className="text-sm text-muted-foreground">
                {bookedDays.size} booked day{bookedDays.size !== 1 ? "s" : ""} this month
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={prevMonth}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={nextMonth}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} className="py-2 text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const isBooked = day !== null && bookedDays.has(day)
              const isToday =
                day === today.getDate() &&
                calMonth === today.getMonth() &&
                calYear === today.getFullYear()

              return (
                <div
                  key={i}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition-colors",
                    day === null && "invisible",
                    isBooked && !isToday && "bg-emerald-100 text-emerald-800",
                    isToday && "bg-primary text-white",
                    !isBooked && !isToday && day !== null && "cursor-pointer text-gray-700 hover:bg-muted/50"
                  )}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>

        {/* Today's appointments */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Today&apos;s appointments
            </h2>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900"
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {todaysBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No appointments today.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {todaysBookings.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center gap-3 rounded-md border border-gray-100 bg-[#f2ede9] px-3 py-2.5"
                >
                  <span className="min-w-11.5 rounded-lg bg-primary px-1.5 py-1 text-center text-xs font-bold text-white">
                    {appt.time}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {appt.client_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {appt.service} · {appt.staff}
                    </p>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
                    {appt.price} MAD
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingPopUp open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
