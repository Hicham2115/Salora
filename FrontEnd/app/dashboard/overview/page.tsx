"use client"

import { useState } from "react"
import {
  Monitor,
  Clock,
  TrendingUp,
  UserRound,
  ExternalLink,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import BookingPopUp from "@/components/BookingPopUp"

const stats = [
  {
    icon: Monitor,
    badge: "+2 vs yesterday",
    badgeColor: "text-emerald-600 bg-emerald-50",
    value: "6",
    label: "Today's bookings",
  },
  {
    icon: Clock,
    badge: "↑ 18%",
    badgeColor: "text-emerald-600 bg-emerald-50",
    value: "560 MAD",
    label: "Today's revenue",
  },
  {
    icon: TrendingUp,
    badge: "↑ 12%",
    badgeColor: "text-emerald-600 bg-emerald-50",
    value: "800 MAD",
    label: "Week revenue",
  },
  {
    icon: UserRound,
    badge: "↑ 6%",
    badgeColor: "text-emerald-600 bg-emerald-50",
    value: "142",
    label: "Active clients",
    iconColor: "text-orange-400",
  },
]

const appointments = [
  {
    time: "09:00",
    name: "Hamza Alaoui",
    service: "Haircut + Beard",
    staff: "Youssef",
    price: "120 MAD",
    status: "confirmed",
  },
  {
    time: "10:30",
    name: "Karim Benali",
    service: "Classic Haircut",
    staff: "Youssef",
    price: "60 MAD",
    status: "confirmed",
  },
  {
    time: "11:30",
    name: "Omar Tahiri",
    service: "Premium Shave",
    staff: "Amine",
    price: "80 MAD",
    status: "pending",
  },
  {
    time: "14:00",
    name: "Mehdi Chaoui",
    service: "Beard Styling",
    staff: "Youssef",
    price: "60 MAD",
    status: "confirmed",
  },
  {
    time: "15:00",
    name: "Said Mansouri",
    service: "Haircut",
    staff: "Amine",
    price: "60 MAD",
    status: "confirmed",
  },
  {
    time: "16:00",
    name: "Rachid Filali",
    service: "Full Grooming",
    staff: "Youssef",
    price: "180 MAD",
    status: "confirmed",
  },
]

const BOOKED_DAYS = new Set([2, 3, 8, 10, 14, 17])

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

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
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const { user } = useUser()
  const [dialogOpen, setDialogOpen] = useState(false)

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
    if (calMonth === 0) {
      setCalYear((y) => y - 1)
      setCalMonth(11)
    } else setCalMonth((m) => m - 1)
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalYear((y) => y + 1)
      setCalMonth(0)
    } else setCalMonth((m) => m + 1)
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
            {dateStr} · {appointments.length} appointments today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="cursor-pointer gap-2 bg-white py-5"
          >
            <ExternalLink size={15} />
            View public page
          </Button>
          <Button
            className="cursor-pointer gap-2 py-5"
            onClick={() => setDialogOpen(true)}
          >
            <Plus size={15} />
            New booking
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-[#f2ede9] p-2">
                <stat.icon
                  size={18}
                  className={stat.iconColor ?? "text-gray-500"}
                />
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  stat.badgeColor
                )}
              >
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
                {BOOKED_DAYS.size} booked days this month
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={prevMonth}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={nextMonth}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div
                key={d}
                className="py-2 text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const isBooked = day !== null && BOOKED_DAYS.has(day)
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
                    isBooked && "bg-emerald-100 text-emerald-800",
                    isToday && !isBooked && "bg-primary text-white",
                    !isBooked &&
                      !isToday &&
                      day !== null &&
                      "cursor-pointer text-gray-700 hover:bg-muted/50"
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
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900">
              View all <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {appointments.map((appt, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md border border-gray-100 bg-[#f2ede9] px-3 py-2.5"
              >
                <span
                  className={cn(
                    "min-w-[46px] rounded-lg px-1.5 py-1 text-center text-xs font-bold text-white",
                    appt.status === "pending" ? "bg-amber-400" : "bg-primary"
                  )}
                >
                  {appt.time}
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {appt.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {appt.service} · {appt.staff}
                  </p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
                  {appt.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BookingPopUp open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
