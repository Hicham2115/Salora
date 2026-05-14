"use client"

import { useState, useMemo } from "react"
import { Plus, Search, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
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

interface Client {
  id: number
  name: string
  phone: string
  visits: number
  last_visit: string | null
  total_spend: number
  note: string
}

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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

function errorMsg(error: unknown, fallback: string) {
  return (error as any)?.response?.data?.message || fallback
}

export default function ClientsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["clients_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients_data`
      )
      return res.data
    },
  })

  const clients: Client[] = data ?? []

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q)
    )
  }, [clients, search])

  const form = useForm({
    defaultValues: { name: "", phone: "", note: "" },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        phone: value.phone.trim(),
        note: value.note.trim(),
      }
      if (editingId !== null) {
        updateMutation.mutate({ id: editingId, ...payload })
      } else {
        createMutation.mutate(payload)
      }
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; phone: string; note: string }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create_client`,
        payload
      ),
    onSuccess: async (_, vars) => {
      await queryClient.refetchQueries({ queryKey: ["clients_data"] })
      form.reset()
      setFormOpen(false)
      toast.success("Client added", {
        description: `${vars.name} has been added to your database.`,
        classNames: successToast,
      })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to add client"), {
        classNames: errorToast,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: number
      name: string
      phone: string
      note: string
    }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_client`,
        payload
      ),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["clients_data"] })
      form.reset()
      setEditingId(null)
      setFormOpen(false)
      toast.success("Client updated", { classNames: successToast })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to update client"), {
        classNames: errorToast,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/delete_client`, {
        id,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["clients_data"] })
      setConfirmId(null)
      toast.success("Client removed", { classNames: successToast })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to delete client"), {
        classNames: errorToast,
      })
    },
  })

  const openAdd = () => {
    form.reset()
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (client: Client) => {
    form.setFieldValue("name", client.name)
    form.setFieldValue("phone", client.phone ?? "")
    form.setFieldValue("note", client.note ?? "")
    setEditingId(client.id)
    setFormOpen(true)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

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
        <Button onClick={openAdd} className="cursor-pointer gap-2 py-5">
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
        <div className="grid grid-cols-[2fr_1.5fr_0.7fr_1fr_1.2fr_1.5fr_80px] border-b px-6 py-3">
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

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading clients...
          </div>
        ) : (
          <>
            {filtered.map((client, idx) => (
              <div
                key={client.id}
                className={cn(
                  "grid grid-cols-[2fr_1.5fr_0.7fr_1fr_1.2fr_1.5fr_80px] items-center px-6 py-4 transition-colors hover:bg-gray-50",
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
                <span className="text-sm text-gray-600">
                  {client.phone || "—"}
                </span>

                {/* Visits */}
                <span className="inline-flex h-6 w-10 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-gray-700">
                  {client.visits}×
                </span>

                {/* Last visit */}
                <span className="text-sm text-gray-600">
                  {formatDate(client.last_visit)}
                </span>

                {/* Total spend */}
                <span className="text-sm font-bold text-gray-900">
                  {client.total_spend > 0 ? `${client.total_spend} MAD` : "—"}
                </span>

                {/* Note */}
                <span className="truncate text-sm text-muted-foreground">
                  {client.note || "—"}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(client)}
                    className="cursor-pointer text-gray-400 transition-colors hover:text-primary"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmId(client.id)}
                    className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Drawer */}
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
                        <div className="mb-6 flex flex-col items-center gap-2 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-200 text-xl font-bold text-stone-600">
                            {getInitials(client.name)}
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {client.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {client.phone || "—"}
                          </p>
                        </div>

                        <hr className="mb-5" />

                        <div className="mb-5 grid grid-cols-2 gap-3">
                          {[
                            {
                              label: "Total visits",
                              value: `${client.visits}×`,
                            },
                            {
                              label: "Last visit",
                              value: formatDate(client.last_visit),
                            },
                            {
                              label: "Total spend",
                              value:
                                client.total_spend > 0
                                  ? `${client.total_spend} MAD`
                                  : "—",
                            },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className="rounded-xl bg-stone-100 px-4 py-3"
                            >
                              <p className="text-xs text-muted-foreground">
                                {label}
                              </p>
                              <p className="mt-0.5 text-base font-bold text-gray-900">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>

                        {client.note && (
                          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <p className="mb-1 text-xs font-semibold text-amber-700">
                              Note
                            </p>
                            <p className="text-sm text-amber-800">
                              {client.note}
                            </p>
                          </div>
                        )}

                        <hr className="mb-5" />

                        <div>
                          <p className="mb-3 text-sm font-bold text-gray-900">
                            Recent bookings
                          </p>
                          <p className="py-3 text-sm text-muted-foreground">
                            No bookings yet.
                          </p>
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
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No clients found.
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.reset()
            setEditingId(null)
          }
          setFormOpen(open)
        }}
      >
        <DialogContent className="max-w-lg overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg font-bold">
              {editingId !== null ? "Edit client" : "Add a new client"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {editingId !== null
                ? "Update client information"
                : "Add a client to your database for faster bookings"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || value.trim().length < 2)
                          return "Name must be at least 2 characters"
                        if (!/^[\p{L}\s'-]+$/u.test(value.trim()))
                          return "Name can only contain letters"
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <input
                          autoFocus
                          type="text"
                          placeholder="e.g. Karim Benali"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className={inputCls}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1 text-xs text-red-500">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Phone number
                  </label>
                  <form.Field name="phone">
                    {(field) => (
                      <input
                        type="tel"
                        placeholder="+212 6XX XXX XXX"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={inputCls}
                      />
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Internal notes
                </label>
                <form.Field name="note">
                  {(field) => (
                    <textarea
                      rows={3}
                      placeholder="e.g. Prefers short sides, allergic to certain products..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full resize-none rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  )}
                </form.Field>
                <p className="text-[11px] text-muted-foreground">
                  Preferences, allergies, special requests — only visible to
                  your team
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  setEditingId(null)
                  setFormOpen(false)
                }}
                className="cursor-pointer rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer gap-2 rounded-md"
              >
                <Plus size={15} />
                {isPending
                  ? "Saving..."
                  : editingId !== null
                    ? "Save changes"
                    : "Add client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove client?</DialogTitle>
            <DialogDescription>
              This will permanently delete the client from your database. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="cursor-pointer rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => {
                if (confirmId !== null) deleteMutation.mutate(confirmId)
              }}
              className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
