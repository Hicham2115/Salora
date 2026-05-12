"use client"

import { useState, useMemo } from "react"
import { Plus, Search, ChevronRight } from "lucide-react"
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
} from "@/components/ui/dialog"

interface Client {
  id: number
  name: string
  phone: string
  visits: number
  lastVisit: string
  totalSpend: number
  note: string
  tag: "Regular" | "VIP" | "New" | "Walk-in"
  email: string
  birthday: string
}

interface RecentBooking {
  service: string
  date: string
  time: string
  status: "Confirmed" | "Pending" | "Cancelled"
}

const TAGS = ["Regular", "VIP", "New", "Walk-in"] as const

const CLIENT_BOOKINGS: Record<number, RecentBooking[]> = {
  1: [
    {
      service: "Haircut + Beard",
      date: "2026-04-28",
      time: "09:00",
      status: "Confirmed",
    },
  ],
  2: [
    {
      service: "Classic Haircut",
      date: "2026-04-28",
      time: "10:30",
      status: "Confirmed",
    },
  ],
  3: [
    {
      service: "Classic Haircut",
      date: "2026-04-28",
      time: "11:00",
      status: "Confirmed",
    },
  ],
  4: [
    {
      service: "Haircut + Beard",
      date: "2026-04-28",
      time: "09:30",
      status: "Confirmed",
    },
    {
      service: "Beard Styling",
      date: "2026-04-10",
      time: "14:00",
      status: "Confirmed",
    },
  ],
  5: [
    {
      service: "Beard Trim",
      date: "2026-04-25",
      time: "12:00",
      status: "Confirmed",
    },
  ],
  6: [
    {
      service: "Premium Shave",
      date: "2026-04-28",
      time: "08:00",
      status: "Confirmed",
    },
    {
      service: "Premium Shave",
      date: "2026-04-21",
      time: "08:00",
      status: "Confirmed",
    },
  ],
  7: [
    {
      service: "Classic Haircut",
      date: "2026-04-22",
      time: "15:00",
      status: "Confirmed",
    },
  ],
  8: [
    {
      service: "Beard Trim",
      date: "2026-04-20",
      time: "13:30",
      status: "Confirmed",
    },
  ],
}

const STATUS_STYLES: Record<RecentBooking["status"], string> = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-600",
}

const initialClients: Client[] = [
  {
    id: 1,
    name: "Hamza Alaoui",
    phone: "+212 661 234 567",
    visits: 12,
    lastVisit: "Apr 28",
    totalSpend: 1440,
    note: "Prefers short sides",
    tag: "Regular",
    email: "",
    birthday: "",
  },
  {
    id: 2,
    name: "Karim Benali",
    phone: "+212 662 345 678",
    visits: 8,
    lastVisit: "Apr 28",
    totalSpend: 480,
    note: "Always 10:30 slot",
    tag: "Regular",
    email: "",
    birthday: "",
  },
  {
    id: 3,
    name: "Omar Tahiri",
    phone: "+212 663 456 789",
    visits: 3,
    lastVisit: "Apr 28",
    totalSpend: 240,
    note: "",
    tag: "New",
    email: "",
    birthday: "",
  },
  {
    id: 4,
    name: "Mehdi Chaoui",
    phone: "+212 664 567 890",
    visits: 15,
    lastVisit: "Apr 28",
    totalSpend: 900,
    note: "VIP — never keep waiting",
    tag: "VIP",
    email: "",
    birthday: "",
  },
  {
    id: 5,
    name: "Said Mansouri",
    phone: "+212 665 678 901",
    visits: 6,
    lastVisit: "Apr 25",
    totalSpend: 360,
    note: "",
    tag: "Regular",
    email: "",
    birthday: "",
  },
  {
    id: 6,
    name: "Rachid Filali",
    phone: "+212 666 789 012",
    visits: 22,
    lastVisit: "Apr 28",
    totalSpend: 3960,
    note: "Books every Friday",
    tag: "VIP",
    email: "",
    birthday: "",
  },
  {
    id: 7,
    name: "Nabil Ouali",
    phone: "+212 667 890 123",
    visits: 4,
    lastVisit: "Apr 22",
    totalSpend: 480,
    note: "",
    tag: "Regular",
    email: "",
    birthday: "",
  },
  {
    id: 8,
    name: "Hicham Zaki",
    phone: "+212 668 901 234",
    visits: 9,
    lastVisit: "Apr 20",
    totalSpend: 540,
    note: "Always beard only",
    tag: "Regular",
    email: "",
    birthday: "",
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  birthday: "",
  tag: "Regular" as Client["tag"],
  note: "",
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    )
  }, [clients, search])

  const handleAdd = () => {
    if (!form.name.trim() || !form.phone.trim()) return
    const newClient: Client = {
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      visits: 0,
      lastVisit: "—",
      totalSpend: 0,
      note: form.note.trim(),
      tag: form.tag,
      email: form.email.trim(),
      birthday: form.birthday,
    }
    setClients((prev) => [...prev, newClient])
    setForm(EMPTY_FORM)
    setAddOpen(false)
  }

  const previewInitials = form.name ? getInitials(form.name) : "?"

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {clients.length} clients in your database
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="cursor-pointer gap-2 py-5"
        >
          <Plus size={16} />
          Add client
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 w-72">
        <Search
          size={15}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border bg-white py-2.5 pr-4 pl-9 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1.5fr_0.7fr_1fr_1.2fr_1.5fr_40px] border-b px-6 py-3">
          {[
            "CLIENT",
            "PHONE",
            "VISITS",
            "LAST VISIT",
            "TOTAL SPEND",
            "NOTE",
            "",
          ].map((col, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((client, idx) => (
          <div
            key={client.id}
            className={cn(
              "grid grid-cols-[2fr_1.5fr_0.7fr_1fr_1.2fr_1.5fr_40px] items-center px-6 py-4 transition-colors hover:bg-gray-50",
              idx !== filtered.length - 1 && "border-b"
            )}
          >
            {/* Client */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                {getInitials(client.name)}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {client.name}
              </span>
            </div>

            {/* Phone */}
            <span className="text-sm text-gray-600">{client.phone}</span>

            {/* Visits */}
            <span className="inline-flex h-6 w-10 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-gray-700">
              {client.visits}×
            </span>

            {/* Last visit */}
            <span className="text-sm text-gray-600">{client.lastVisit}</span>

            {/* Total spend */}
            <span className="text-sm font-bold text-gray-900">
              {client.totalSpend > 0 ? `${client.totalSpend} MAD` : "—"}
            </span>

            {/* Note */}
            <span className="truncate text-sm text-muted-foreground">
              {client.note || "—"}
            </span>

            {/* Drawer trigger — chevron */}
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
                    Client profile
                  </DrawerTitle>
                  <DrawerClose className="text-muted-foreground hover:text-foreground">
                    <span className="text-xl leading-none">&times;</span>
                  </DrawerClose>
                </DrawerHeader>

                <DrawerDescription className="sr-only">
                  Profile for {client.name}
                </DrawerDescription>

                <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6">
                  {/* Avatar + name + phone */}
                  <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-200 text-xl font-bold text-stone-600">
                      {getInitials(client.name)}
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {client.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client.phone}
                    </p>
                  </div>

                  <hr className="mb-5" />

                  {/* Stat cards */}
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    {[
                      { label: "Total visits", value: `${client.visits}×` },
                      { label: "Last visit", value: client.lastVisit },
                      {
                        label: "Total spend",
                        value:
                          client.totalSpend > 0
                            ? `${client.totalSpend} MAD`
                            : "—",
                      },
                      {
                        label: "Status",
                        value: client.tag === "VIP" ? "⭐ VIP" : client.tag,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl bg-stone-100 px-4 py-3"
                      >
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="mt-0.5 text-base font-bold text-gray-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  {client.note && (
                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="mb-1 text-xs font-semibold text-amber-700">
                        Note
                      </p>
                      <p className="text-sm text-amber-800">{client.note}</p>
                    </div>
                  )}

                  <hr className="mb-5" />

                  {/* Recent bookings */}
                  <div>
                    <p className="mb-3 text-sm font-bold text-gray-900">
                      Recent bookings
                    </p>
                    <div className="divide-y divide-gray-100">
                      {(CLIENT_BOOKINGS[client.id] ?? []).map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {b.service}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {b.date} · {b.time}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              STATUS_STYLES[b.status]
                            )}
                          >
                            {b.status}
                          </span>
                        </div>
                      ))}
                      {!CLIENT_BOOKINGS[client.id]?.length && (
                        <p className="py-3 text-sm text-muted-foreground">
                          No bookings yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DrawerFooter className="gap-2 px-6 pb-6">
                  <Button className="w-full cursor-pointer py-5">
                    Book for {client.name.split(" ")[0]}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No clients found.
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg font-bold">
              Add a new client
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Add a client to your database for faster bookings
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
            {/* Preview */}
            <div className="flex items-center gap-4 rounded-xl bg-stone-100 px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-300 text-sm font-bold text-stone-600">
                {previewInitials}
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Preview
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {form.name.trim() || "New client"}
                </p>
              </div>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karim Benali"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Email + Birthday */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="client@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Birthday
                </label>
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, birthday: e.target.value }))
                  }
                  className="rounded-lg border px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  For automatic birthday offers
                </p>
              </div>
            </div>

            {/* Client tag */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">
                Client tag
              </label>
              <div className="flex gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setForm((f) => ({ ...f, tag }))}
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      form.tag === tag
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {form.tag === tag && (
                      <span className="mr-1 text-xs">✓</span>
                    )}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Internal notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Prefers short sides, allergic to certain products..."
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
                className="resize-none rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                Preferences, allergies, special requests — only visible to your
                team
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button
              variant="outline"
              onClick={() => {
                setForm(EMPTY_FORM)
                setAddOpen(false)
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.name.trim() || !form.phone.trim()}
              className="cursor-pointer gap-2"
            >
              <Plus size={15} />
              Add client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
