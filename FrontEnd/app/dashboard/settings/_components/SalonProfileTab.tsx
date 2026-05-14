"use client"

import { cn } from "@/lib/utils"
import { CircleUserRoundIcon } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false })
import { Field } from "./Field"
import { inputCls } from "./shared"

const salonProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters" })
    .min(2, "Name is too short"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .min(10, "Phone number is too short"),
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email",
    }),
  website: z.string().optional(),
  instagram: z.string().optional(),
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address is too short"),
  about: z.string().optional(),
})

type SalonProfileFormData = z.infer<typeof salonProfileSchema>

const defaultValues: SalonProfileFormData = {
  name: "",
  phone: "",
  email: "",
  website: "",
  instagram: "",
  address: "",
  about: "",
}

export function SalonProfileTab() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({ accept: "image/*" })

  const previewUrl = files[0]?.preview || null
  const queryClient = useQueryClient()
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  const { data } = useQuery({
    queryKey: ["owner_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/salon_data`
      )
      return res.data
    },
  })

  useEffect(() => {
    if (data?.data?.latitude != null && data?.data?.longitude != null) {
      setLat(data.data.latitude)
      setLng(data.data.longitude)
    }
    if (data?.data != null) {
      setIsOpen(data.data.is_open ?? true)
    }
  }, [data])

  const serverImageUrl = data?.data?.salon_logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${data.data.salon_logo}`
    : null
  const effectivePreviewUrl = previewUrl || serverImageUrl

  const updateStatusMutation = useMutation({
    mutationFn: (value: boolean) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/update_salon_status`, { is_open: value }),
    onMutate: (value) => {
      // optimistic update — toggle immediately
      setIsOpen(value)
    },
    onSuccess: (_, value) => {
      queryClient.invalidateQueries({ queryKey: ["owner_data"] })
      toast.success(value ? "Salon is now open" : "Salon is now closed", {
        classNames: {
          toast: value ? "!bg-green-50 !border !border-green-400" : "!bg-red-50 !border !border-red-400",
          title: value ? "!text-green-700 !font-semibold" : "!text-red-700 !font-semibold",
        },
      })
    },
    onError: (_err, value) => {
      // revert on failure
      setIsOpen(!value)
      toast.error("Failed to update salon status. Please try again.")
    },
  })

  const updateSalonMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_salon`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner_data"] })
      toast.success("Salon profile saved", {
        description: "Your salon profile has been updated successfully.",
        classNames: {
          toast: "!bg-green-50 !border !border-green-400",
          title: "!text-green-700 !font-semibold",
          description: "!text-green-600",
          icon: "!text-green-600",
        },
      })
    },
    onError: (error) => {
      const status = (error as any)?.response?.status
      const errorMessage =
        (error as any)?.response?.data?.message || "Failed to save information"
      if (status >= 400 && status < 500) {
        toast.warning(errorMessage, {
          description: "Please check your inputs and try again.",
          classNames: {
            toast: "!bg-yellow-50 !border !border-yellow-400",
            title: "!text-yellow-700 !font-semibold",
            description: "!text-yellow-600",
            icon: "!text-yellow-600",
          },
        })
      } else {
        toast.error(errorMessage, {
          description: "Something went wrong. Please try again.",
          action: { label: "Retry", onClick: () => form.handleSubmit() },
          classNames: {
            toast: "!bg-red-50 !border !border-red-400",
            title: "!text-red-700 !font-semibold",
            description: "!text-red-600",
            actionButton: "!bg-red-600 !text-white hover:!bg-red-700",
            icon: "!text-red-600",
          },
        })
      }
    },
  })

  const addSalonMutation = useMutation({
    mutationFn: (data: FormData) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create_salon`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast.success("Salon profile saved", {
        description: "Your salon profile has been updated successfully.",
        classNames: {
          toast: "!bg-green-50 !border !border-green-400",
          title: "!text-green-700 !font-semibold",
          description: "!text-green-600",
          icon: "!text-green-600",
        },
      })
    },
    onError: (error) => {
      const status = (error as any)?.response?.status
      const errorMessage =
        (error as any)?.response?.data?.message || "Failed to save information"
      if (status >= 400 && status < 500) {
        toast.warning(errorMessage, {
          description: "Please check your inputs and try again.",
          classNames: {
            toast: "!bg-yellow-50 !border !border-yellow-400",
            title: "!text-yellow-700 !font-semibold",
            description: "!text-yellow-600",
            icon: "!text-yellow-600",
          },
        })
      } else {
        toast.error(errorMessage, {
          description: "Something went wrong. Please try again.",
          action: { label: "Retry", onClick: () => form.handleSubmit() },
          classNames: {
            toast: "!bg-red-50 !border !border-red-400",
            title: "!text-red-700 !font-semibold",
            description: "!text-red-600",
            actionButton: "!bg-red-600 !text-white hover:!bg-red-700",
            icon: "!text-red-600",
          },
        })
      }
    },
  })

  const form = useForm({
    defaultValues: data?.data
      ? {
          name: data.data.salon_name ?? "",
          phone: data.data.salon_phone ?? "",
          email: data.data.salon_email ?? "",
          website: data.data.salon_website ?? "",
          instagram: data.data.salon_instagram ?? "",
          address: data.data.salon_adresse ?? "",
          about: data.data.salon_about ?? "",
        }
      : defaultValues,
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      formData.append("name", value.name)
      formData.append("phone", value.phone)
      formData.append("email", value.email)
      formData.append("website", value.website ?? "")
      formData.append("instagram", value.instagram ?? "")
      formData.append("address", value.address)
      formData.append("about", value.about ?? "")
      if (lat !== null) formData.append("latitude", String(lat))
      if (lng !== null) formData.append("longitude", String(lng))
      formData.append("is_open", isOpen ? "1" : "0")
      const file = files[0]?.file
      if (file instanceof File) formData.append("img", file)
      if (data?.data?.id) {
        formData.append("id", String(data.data.id))
        updateSalonMutation.mutate(formData)
      } else {
        addSalonMutation.mutate(formData)
      }
    },
  })

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold text-gray-900">Salon Profile</h2>

      {/* Open / Closed toggle */}
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-white px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Salon status</p>
          <p className="text-xs text-muted-foreground">
            Controls the open / closed badge on your public booking page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={isOpen ? "text-xs font-semibold text-emerald-600" : "text-xs font-semibold text-red-500"}>
            {isOpen ? "Open" : "Closed"}
          </span>
          <label className={`relative inline-flex items-center ${updateStatusMutation.isPending ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
            <input
              type="checkbox"
              checked={isOpen}
              disabled={updateStatusMutation.isPending}
              onChange={() => updateStatusMutation.mutate(!isOpen)}
              className="peer sr-only"
            />
            <div className={`peer h-5 w-9 rounded-full transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4 ${isOpen ? "bg-emerald-500" : "bg-gray-300"}`} />
          </label>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-[#f2ede6] text-xl font-bold text-gray-600">
          {effectivePreviewUrl ? (
            <img alt="Salon logo" className="size-full object-cover" src={effectivePreviewUrl} />
          ) : (
            <CircleUserRoundIcon className="size-6 opacity-40" />
          )}
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-900">Salon logo</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openFileDialog}
              className="cursor-pointer rounded-lg border px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Upload logo
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={() => removeFile(files[0].id)}
                className="cursor-pointer rounded-lg border px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Remove
              </button>
            )}
          </div>
          <input {...getInputProps()} className="hidden" />
        </div>
      </div>

      <div className="mb-6 h-px bg-gray-100" />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Field label="SALON NAME">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const r = salonProfileSchema.shape.name.safeParse(value)
                  return r.success ? undefined : r.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className={inputCls} />
                  {field.state.meta.errors.length > 0 && <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="PHONE NUMBER">
            <form.Field
              name="phone"
              validators={{
                onChange: ({ value }) => {
                  const r = salonProfileSchema.shape.phone.safeParse(value)
                  return r.success ? undefined : r.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className={inputCls} />
                  {field.state.meta.errors.length > 0 && <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="EMAIL">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const r = salonProfileSchema.shape.email.safeParse(value)
                  return r.success ? undefined : r.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} type="email" className={inputCls} />
                  {field.state.meta.errors.length > 0 && <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="WEBSITE">
            <form.Field name="website">
              {(field) => (
                <div>
                  <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className={inputCls} />
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="INSTAGRAM">
            <form.Field name="instagram">
              {(field) => (
                <div>
                  <div className="flex items-center rounded-xl border bg-[#f2ede6] focus-within:ring-2 focus-within:ring-primary/30">
                    <span className="pl-3 text-sm text-muted-foreground">@</span>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="yoursalon"
                      className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </form.Field>
          </Field>
          <div className="col-span-2">
            <Field label="ADDRESS">
              <form.Field
                name="address"
                validators={{
                  onChange: ({ value }) => {
                    const r = salonProfileSchema.shape.address.safeParse(value)
                    return r.success ? undefined : r.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <div>
                    <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className={inputCls} />
                    {field.state.meta.errors.length > 0 && <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>}
                  </div>
                )}
              </form.Field>
            </Field>
          </div>
          <div className="col-span-2">
            <p className="mb-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Location on map
            </p>
            <MapPicker
              lat={lat}
              lng={lng}
              onChange={(newLat, newLng) => {
                setLat(newLat)
                setLng(newLng)
              }}
            />
            {lat !== null && lng !== null && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Pinned: {lat.toFixed(5)}, {lng.toFixed(5)}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <Field label="ABOUT YOUR SALON">
              <form.Field name="about">
                {(field) => (
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={4}
                    className={cn(inputCls, "resize-none pt-2.5")}
                  />
                )}
              </form.Field>
            </Field>
          </div>
        </div>
      </form>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => form.handleSubmit()}
          className="cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {updateSalonMutation.isPending || addSalonMutation.isPending ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={() => form.reset()}
          className="cursor-pointer rounded-md border px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
