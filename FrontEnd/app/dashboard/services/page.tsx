"use client"

import { useState, useMemo } from "react"
import { Plus, X, Clock, Pencil } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface Service {
  id: number
  name: string
  category: string
  duration: number
  price: number
}

const CATEGORIES = ["Haircut", "Beard", "Grooming", "Color", "Treatment"]

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"

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

export default function ServicesPage() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["services_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services_data`
      )
      return res.data
    },
  })

  const services: Service[] = data ?? []

  const categories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category))),
    [services]
  )

  const form = useForm({
    defaultValues: {
      name: "",
      category: CATEGORIES[0],
      duration: "30",
      price: "60",
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        category: value.category,
        duration: Number(value.duration),
        price: Number(value.price),
      }
      if (editingId !== null) {
        updateMutation.mutate({ id: editingId, ...payload })
      } else {
        createMutation.mutate(payload)
      }
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: {
      name: string
      category: string
      duration: number
      price: number
    }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create_service`,
        payload
      ),
    onSuccess: async (_, vars) => {
      await queryClient.refetchQueries({ queryKey: ["services_data"] })
      form.reset()
      setFormOpen(false)
      toast.success("Service added", {
        description: `${vars.name} has been added.`,
        classNames: successToast,
      })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to add service"), {
        classNames: errorToast,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: number
      name: string
      category: string
      duration: number
      price: number
    }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_service`,
        payload
      ),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["services_data"] })
      form.reset()
      setEditingId(null)
      setFormOpen(false)
      toast.success("Service updated", { classNames: successToast })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to update service"), {
        classNames: errorToast,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/delete_service`, {
        id,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["services_data"] })
      setConfirmId(null)
      toast.success("Service removed", { classNames: successToast })
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to delete service"), {
        classNames: errorToast,
      })
    },
  })

  const openAdd = () => {
    form.reset()
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (service: Service) => {
    form.setFieldValue("name", service.name)
    form.setFieldValue("category", service.category)
    form.setFieldValue("duration", String(service.duration))
    form.setFieldValue("price", String(service.price))
    setEditingId(service.id)
    setFormOpen(true)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {services.length} service{services.length !== 1 ? "s" : ""} across{" "}
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Button onClick={openAdd} className="cursor-pointer gap-2 py-5">
          <Plus size={16} />
          Add service
        </Button>
      </div>

      {/* Services grouped by category */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No services yet. Add your first service to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {categories.map((category) => {
            const categoryServices = services.filter(
              (s) => s.category === category
            )
            return (
              <div key={category}>
                <div className="mb-3 flex items-center justify-between border-b pb-2">
                  <h2 className="text-base font-semibold text-gray-900">
                    {category}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {categoryServices.length} service
                    {categoryServices.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="relative rounded-2xl border bg-white p-5 shadow-sm"
                    >
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="cursor-pointer text-gray-400 transition-colors hover:text-primary"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmId(service.id)}
                          className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <p className="pr-14 text-sm font-bold text-gray-900">
                        {service.name}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {service.duration} min
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {service.price} MAD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

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
              {editingId !== null ? "Edit service" : "Add a new service"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {editingId !== null
                ? "Update service details"
                : "Add a service to your menu"}
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
              {/* Category + Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <form.Field name="category">
                    {(field) => (
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={inputCls}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </form.Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Service name <span className="text-red-500">*</span>
                  </label>
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || value.trim().length < 2)
                          return "Name must be at least 2 characters"
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <input
                          autoFocus
                          type="text"
                          placeholder="e.g. Classic Fade"
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
              </div>

              {/* Duration + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Duration (min) <span className="text-red-500">*</span>
                  </label>
                  <form.Field
                    name="duration"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || Number(value) < 1)
                          return "Duration must be at least 1 minute"
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <input
                          type="number"
                          min={1}
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
                    Price (MAD) <span className="text-red-500">*</span>
                  </label>
                  <form.Field
                    name="price"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === "" || Number(value) < 0)
                          return "Price must be 0 or more"
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <input
                          type="number"
                          min={0}
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
                    : "Add service"}
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
            <DialogTitle>Remove service?</DialogTitle>
            <DialogDescription>
              This will permanently delete the service. This action cannot be
              undone.
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
