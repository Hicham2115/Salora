"use client"

import { useState, useMemo } from "react"
import { Plus, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import BookingPopUp from "@/components/BookingPopUp"

type Status = "confirmed" | "pending" | "cancelled"

interface Booking {
  initials: string
  name: string
  phone: string
  service: string
  staff: string
  date: string
  time: string
  duration: string
  price: string
  status: Status
}

/* ---------------- DATA ---------------- */

const bookings: Booking[] = [
  {
    initials: "HA",
    name: "Hamza Alaoui",
    phone: "+212 661 234 567",
    service: "Haircut + Beard",
    staff: "Youssef",
    date: "2026-04-28",
    time: "09:00",
    duration: "60min",
    price: "120 MAD",
    status: "confirmed",
  },
  {
    initials: "KB",
    name: "Karim Benali",
    phone: "+212 662 345 678",
    service: "Classic Haircut",
    staff: "Youssef",
    date: "2026-04-28",
    time: "10:30",
    duration: "30min",
    price: "60 MAD",
    status: "confirmed",
  },
  {
    initials: "OT",
    name: "Omar Tahiri",
    phone: "+212 663 456 789",
    service: "Premium Shave",
    staff: "Amine",
    date: "2026-04-28",
    time: "11:30",
    duration: "45min",
    price: "80 MAD",
    status: "pending",
  },
  {
    initials: "MC",
    name: "Mehdi Chaoui",
    phone: "+212 664 567 890",
    service: "Beard Styling",
    staff: "Youssef",
    date: "2026-04-28",
    time: "14:00",
    duration: "30min",
    price: "60 MAD",
    status: "confirmed",
  },
  {
    initials: "SM",
    name: "Said Mansouri",
    phone: "+212 665 678 901",
    service: "Haircut",
    staff: "Amine",
    date: "2026-04-28",
    time: "15:00",
    duration: "30min",
    price: "60 MAD",
    status: "cancelled",
  },
]

/* ---------------- STATUS UI ---------------- */

const statusConfig: Record<Status, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-500 border border-red-200",
  },
}

/* ---------------- TABLE ---------------- */

const columnHelper = createColumnHelper<Booking>()

const columns = [
  columnHelper.accessor("name", {
    header: "Client",
    cell: (info) => (
      <span className="font-semibold text-gray-600">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("service", {
    header: "Service",
    cell: (info) => <span className="text-black">{info.getValue()}</span>,
  }),
  columnHelper.accessor("staff", {
    header: "Staff",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => {
      const date = new Date(info.getValue())
      return (
        <span className="font-semibold text-gray-600">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </span>
      )
    },
  }),
  columnHelper.accessor("time", {
    header: "Time",
  }),
  columnHelper.accessor("duration", {
    header: "Duration",
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => (
      <span className="font-semibold text-gray-800">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue()
      const { label, className } = statusConfig[status]

      return (
        <span className={cn("rounded-full px-3 py-1 text-xs", className)}>
          {label}
        </span>
      )
    },
  }),
]

/* ---------------- PAGE ---------------- */

type FilterTab = "all" | Status
const DRAWER_SIDES = ["right"] as const

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  /* FILTER DATA */
  const filteredData = useMemo(() => {
    if (activeTab === "all") return bookings
    return bookings.filter((b) => b.status === activeTab)
  }, [activeTab])

  /* COUNTS */
  const counts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "confirmed", label: `Confirmed (${counts.confirmed})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "cancelled", label: `Cancelled (${counts.cancelled})` },
  ]

  return (
    <div className="min-h-screen bg-[#f2ede6] p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {bookings.length} total appointments
          </p>
        </div>

        <Button
          className="cursor-pointer gap-2 py-5"
          onClick={() => setDialogOpen(true)}
        >
          <Plus size={15} />
          New booking
        </Button>
      </div>

      {/* CARD */}
      <div className="rounded-sm bg-white shadow-md">
        {/* TABS */}
        <div className="flex gap-1 border-b border-gray-100 px-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-t-lg px-4 py-2 text-sm font-medium",
                activeTab === tab.key
                  ? "border border-b-0 border-gray-200 bg-[#f2ede6] text-gray-900"
                  : "text-muted-foreground hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-gray-50 px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                  <th className="px-5 py-3" />
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-gray-50 transition-colors hover:bg-gray-50",
                    row.original.status === "confirmed" &&
                      "hover:bg-emerald-50/40",
                    row.original.status === "pending" && "hover:bg-amber-50/40",
                    row.original.status === "cancelled" && "hover:bg-red-50/40"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-right">
                    <div className="flex cursor-pointer flex-wrap gap-2">
                      {DRAWER_SIDES.map((side) => (
                        <Drawer key={side} direction={side}>
                          <DrawerTrigger asChild>
                            {/* ACTION */}
                            <ChevronRight
                              size={16}
                              className="text-muted-foreground"
                            />
                          </DrawerTrigger>
                          <DrawerContent className="flex flex-col">
                            <DrawerHeader className="flex items-center justify-between border-b pb-4">
                              <DrawerTitle className="text-lg font-semibold">
                                Booking details
                              </DrawerTitle>
                              <DrawerClose className="text-muted-foreground hover:text-foreground">
                                <span className="text-xl leading-none">
                                  &times;
                                </span>
                              </DrawerClose>
                            </DrawerHeader>
                            <DrawerDescription className="sr-only">
                              Details for {row.original.name}&apos;s booking
                            </DrawerDescription>
                            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6">
                              {/* Avatar + name + phone + status */}
                              <div className="mb-6 flex flex-col items-center gap-2 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600">
                                  {row.original.initials}
                                </div>
                                <p className="text-base font-bold">
                                  {row.original.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {row.original.phone}
                                </p>
                                <span
                                  className={cn(
                                    "rounded-full px-3 py-0.5 text-xs font-medium",
                                    row.original.status === "confirmed" &&
                                      "bg-emerald-100 text-emerald-700",
                                    row.original.status === "pending" &&
                                      "bg-amber-100 text-amber-700",
                                    row.original.status === "cancelled" &&
                                      "bg-red-100 text-red-600"
                                  )}
                                >
                                  {row.original.status.charAt(0).toUpperCase() +
                                    row.original.status.slice(1)}
                                </span>
                              </div>

                              {/* Detail rows */}
                              <div className="divide-y divide-gray-100">
                                {[
                                  {
                                    label: "Service",
                                    value: row.original.service,
                                  },
                                  { label: "Staff", value: row.original.staff },
                                  { label: "Date", value: row.original.date },
                                  { label: "Time", value: row.original.time },
                                  {
                                    label: "Duration",
                                    value: row.original.duration,
                                  },
                                  { label: "Price", value: row.original.price },
                                ].map(({ label, value }) => (
                                  <div
                                    key={label}
                                    className="flex items-center justify-between py-3"
                                  >
                                    <span className="text-sm text-muted-foreground">
                                      {label}
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <DrawerFooter className="gap-2 px-6 pb-6">
                              <Button variant="outline" className="w-full">
                                Reschedule
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                              >
                                Cancel booking
                              </Button>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BookingPopUp open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
