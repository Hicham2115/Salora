"use client"

import { useState, useMemo } from "react"
import { Plus, ChevronRight } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import BookingPopUp from "@/components/BookingPopUp"

type Status = "confirmed" | "cancelled" | "pending"

interface Booking {
  id: number
  client_name: string
  phone: string | null
  service: string
  staff: string
  date: string
  time: string
  duration: number
  price: number
  status: Status
  notes: string | null
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/15 text-red-400 border border-red-500/20",
  },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })
}

function errorMsg(error: unknown, fallback: string) {
  return (error as any)?.response?.data?.message || fallback
}

const successToast = {
  toast: "!bg-green-50 !border !border-green-400",
  title: "!text-green-700 !font-semibold",
  description: "!text-green-600",
  icon: "!text-green-600",
}

const errorToast = {
  toast: "!bg-red-50 !border !border-red-400",
  title: "!text-red-700 !font-semibold",
}

type FilterTab = "all" | Status

const columnHelper = createColumnHelper<Booking>()

export default function BookingPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["bookings_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings_data`
      )
      return res.data
    },
  })

  const bookings: Booking[] = data ?? []

  const filteredData = useMemo(() => {
    if (activeTab === "all") return bookings
    return bookings.filter((b) => b.status === activeTab)
  }, [bookings, activeTab])

  const counts = useMemo(
    () => ({
      all: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  )

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; status: Status }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_booking`,
        payload
      ),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["bookings_data"] })
      toast.success("Booking updated", { classNames: successToast })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to update booking"), {
        classNames: errorToast,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/delete_booking`, {
        id,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["bookings_data"] })
      setConfirmDeleteId(null)
      toast.success("Booking deleted", { classNames: successToast })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to delete booking"), {
        classNames: errorToast,
      })
    },
  })

  const columns = [
    columnHelper.accessor("client_name", {
      header: "Client",
      cell: (info) => (
        <span className="font-semibold text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("service", {
      header: "Service",
      cell: (info) => <span className="text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("staff", {
      header: "Staff",
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <span className="font-semibold text-white">
          {formatDate(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("time", {
      header: "Time",
    }),
    columnHelper.accessor("duration", {
      header: "Duration",
      cell: (info) => <span>{info.getValue()}min</span>,
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <span className="font-semibold text-white">
          {info.getValue()} MAD
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const { label, className } = statusConfig[info.getValue()]
        return (
          <span className={cn("rounded-full px-3 py-1 text-xs", className)}>
            {label}
          </span>
        )
      },
    }),
  ]

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
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
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

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-card">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 px-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "cursor-pointer rounded-t-lg px-4 py-2 text-sm font-medium",
                activeTab === tab.key
                  ? "border border-b-0 border-white/10 bg-card text-white"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading bookings...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b border-white/10 px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase"
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
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const booking = row.original
                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          "border-b border-white/10 transition-colors hover:bg-white/5",
                          booking.status === "confirmed" &&
                            "hover:bg-emerald-500/10",
                          booking.status === "cancelled" && "hover:bg-red-500/10"
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
                          <Drawer direction="right">
                            <DrawerTrigger asChild>
                              <ChevronRight
                                size={16}
                                className="cursor-pointer text-muted-foreground"
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
                                Details for {booking.client_name}&apos;s booking
                              </DrawerDescription>

                              <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6">
                                {/* Avatar + name + phone + status */}
                                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold text-white">
                                    {getInitials(booking.client_name)}
                                  </div>
                                  <p className="text-base font-bold text-white">
                                    {booking.client_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.phone || "—"}
                                  </p>
                                  <span
                                    className={cn(
                                      "rounded-full px-3 py-0.5 text-xs font-medium",
                                      booking.status === "confirmed" &&
                                        "bg-emerald-500/15 text-emerald-400",
                                      booking.status === "cancelled" &&
                                        "bg-red-500/15 text-red-400"
                                    )}
                                  >
                                    {booking.status.charAt(0).toUpperCase() +
                                      booking.status.slice(1)}
                                  </span>
                                </div>

                                {/* Detail rows */}
                                <div className="divide-y divide-white/10">
                                  {[
                                    {
                                      label: "Service",
                                      value: booking.service,
                                    },
                                    { label: "Staff", value: booking.staff },
                                    {
                                      label: "Date",
                                      value: formatDate(booking.date),
                                    },
                                    { label: "Time", value: booking.time },
                                    {
                                      label: "Duration",
                                      value: `${booking.duration}min`,
                                    },
                                    {
                                      label: "Price",
                                      value: `${booking.price} MAD`,
                                    },
                                  ].map(({ label, value }) => (
                                    <div
                                      key={label}
                                      className="flex items-center justify-between py-3"
                                    >
                                      <span className="text-sm text-muted-foreground">
                                        {label}
                                      </span>
                                      <span className="text-sm font-semibold text-white">
                                        {value}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {booking.notes && (
                                  <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                                    <p className="mb-1 text-xs font-semibold text-amber-400">
                                      Notes
                                    </p>
                                    <p className="text-sm text-amber-300">
                                      {booking.notes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <DrawerFooter className="gap-2 px-6 pb-6">
                                {booking.status == "pending" && (
                                  <p className="text-center text-xs text-muted-foreground">
                                    Please make sure to confirm the client’s
                                    booking before proceeding.
                                  </p>
                                )}
                                {booking.status == "pending" && (
                                  <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: booking.id,
                                        status: "confirmed",
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    Confirm booking
                                  </Button>
                                )}
                                {booking.status !== "cancelled" && (
                                  <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:text-red-300"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: booking.id,
                                        status: "cancelled",
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    Cancel booking
                                  </Button>
                                )}
                                {booking.status == "cancelled" && (
                                  <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15 hover:text-amber-300"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: booking.id,
                                        status: "pending",
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    Activate booking
                                  </Button>
                                )}

                                <Button
                                  variant="outline"
                                  className="w-full cursor-pointer border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  onClick={() => setConfirmDeleteId(booking.id)}
                                >
                                  Delete booking
                                </Button>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete booking?</DialogTitle>
            <DialogDescription>
              This will permanently remove the booking. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="cursor-pointer rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => {
                if (confirmDeleteId !== null)
                  deleteMutation.mutate(confirmDeleteId)
              }}
              className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BookingPopUp open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
