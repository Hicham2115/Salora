"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CircleUserRoundIcon, Plus, Trash2 } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

/* ─────────────────────────── types ─────────────────────────── */

type Tab = "profile" | "hours" | "staff" | "notifications"

interface StaffMember {
  id: number
  name: string
  role: string
  initials: string
}

interface DaySchedule {
  open: boolean
  from: string
  to: string
}

/* ─────────────────────────── mock data ─────────────────────────── */

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const defaultHours: Record<string, DaySchedule> = {
  Monday: { open: true, from: "09:00", to: "19:00" },
  Tuesday: { open: true, from: "09:00", to: "19:00" },
  Wednesday: { open: true, from: "09:00", to: "19:00" },
  Thursday: { open: true, from: "09:00", to: "19:00" },
  Friday: { open: true, from: "09:00", to: "19:00" },
  Saturday: { open: true, from: "10:00", to: "17:00" },
  Sunday: { open: false, from: "10:00", to: "17:00" },
}

const initialStaff: StaffMember[] = [
  { id: 1, name: "Youssef Benali", role: "Owner · Barber", initials: "YB" },
  { id: 2, name: "Amine Karimi", role: "Barber", initials: "AK" },
]

/* ─────────────────────────── helpers ─────────────────────────── */

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/* ─────────────────────────── sub-components ─────────────────────────── */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
        active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {children}
    </button>
  )
}

/* ─────────────── Salon Profile tab ─────────────── */

function SalonProfileTab() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    })

  const previewUrl = files[0]?.preview || null

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
    address: "",
    about: "",
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["owner_data"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/salon_data`)
      console.log(res.data)
      return res.data
    },
  })

  const serverImageUrl = data?.data?.salon_logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${data.data.salon_logo}`
    : null
  const effectivePreviewUrl = previewUrl || serverImageUrl

  const addSalonMutation = useMutation({
    mutationFn: (data: FormData) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create_salon`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },

    onSuccess: (response) => {
      console.log(response.data)
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
      console.log((error as any)?.response)

      const status = (error as any)?.response?.status
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data ||
        "Failed to save information"

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
          description:
            "Something went wrong while saving your salon profile. Please try again.",
          action: {
            label: "Retry",
            onClick: () => form.handleSubmit(),
          },
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
          address: data.data.salon_adresse ?? "",
          about: data.data.salon_about ?? "",
        }
      : defaultValues,

    onSubmit: async ({ value }) => {
      console.log(value)

      const formData = new FormData()
      formData.append("name", value.name)
      formData.append("phone", value.phone)
      formData.append("email", value.email)
      formData.append("website", value.website ?? "")
      formData.append("address", value.address)
      formData.append("about", value.about ?? "")

      const file = files[0]?.file
      if (file instanceof File) {
        formData.append("img", file)
      }

      addSalonMutation.mutate(formData)
    },
  })

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold text-gray-900">Salon Profile</h2>

      {/* Logo */}
      <div className="mb-6 flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-[#f2ede6] text-xl font-bold text-gray-600">
          {effectivePreviewUrl ? (
            <img
              alt="Salon logo"
              className="size-full object-cover"
              src={effectivePreviewUrl}
            />
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

      {/* Fields */}
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
                  const result = salonProfileSchema.shape.name.safeParse(value)

                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputCls}
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="PHONE NUMBER">
            <form.Field
              name="phone"
              validators={{
                onChange: ({ value }) => {
                  const result = salonProfileSchema.shape.phone.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputCls}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="EMAIL">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const result = salonProfileSchema.shape.email.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    type="email"
                    className={inputCls}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </Field>
          <Field label="WEBSITE">
            <form.Field
              name="website"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    salonProfileSchema.shape.website.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputCls}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
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
                    const result =
                      salonProfileSchema.shape.address.safeParse(value)
                    return result.success
                      ? undefined
                      : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <div>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={inputCls}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="ABOUT YOUR SALON">
              <form.Field
                name="about"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      salonProfileSchema.shape.about.safeParse(value)
                    return result.success
                      ? undefined
                      : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <div>
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      rows={4}
                      className={cn(inputCls, "resize-none pt-2.5")}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </Field>
          </div>
        </div>
      </form>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => form.handleSubmit()}
          className="cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {/* {saved ? "Saved!" : "Save changes"} */} save
        </button>
        <button
          onClick={() => form.reset()}
          className="cursor-pointer rounded-xl border px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ─────────────── Opening Hours tab ─────────────── */

function OpeningHoursTab() {
  const [hours, setHours] = useState(defaultHours)
  const [saved, setSaved] = useState(false)

  const toggle = (day: string) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], open: !h[day].open } }))

  const setTime = (day: string, field: "from" | "to", val: string) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], [field]: val } }))

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold text-gray-900">Opening Hours</h2>
      <div className="flex flex-col gap-3">
        {DAYS.map((day) => {
          const s = hours[day]
          return (
            <div
              key={day}
              className="flex items-center gap-4 rounded-xl border bg-white px-5 py-3.5"
            >
              <div className="w-28">
                <span className="text-sm font-semibold text-gray-900">
                  {day}
                </span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={s.open}
                  onChange={() => toggle(day)}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-primary after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
              </label>
              {s.open ? (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={s.from}
                    onChange={(e) => setTime(day, "from", e.target.value)}
                    className="rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="time"
                    value={s.to}
                    onChange={(e) => setTime(day, "to", e.target.value)}
                    className="rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
          className="cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {saved ? "Saved!" : "Save changes"}
        </button>
      </div>
    </div>
  )
}

/* ─────────────── Staff tab ─────────────── */

function StaffTab() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("Barber")

  const handleAdd = () => {
    if (!newName.trim()) return
    setStaff((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        role: newRole,
        initials: initials(newName),
      },
    ])
    setNewName("")
    setNewRole("Barber")
    setShowForm(false)
    toast.success("Staff member added", {
      description: `${newName.trim()} has been added to the team.`,
      classNames: {
        toast: "!bg-green-50 !border !border-green-400",
        title: "!text-green-700 !font-semibold",
        description: "!text-green-600",
        icon: "!text-green-600",
      },
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <h2 className="text-lg font-bold text-gray-900">Staff</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={15} /> Add member
        </button>
      </div>

      {showForm && (
        <div className="mb-5 rounded-2xl border-2 border-primary bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            New staff member
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="FULL NAME">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Karim Alaoui"
                className={inputCls}
              />
            </Field>
            <Field label="ROLE">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className={inputCls}
              >
                {["Barber", "Senior Barber", "Manager", "Receptionist"].map(
                  (r) => (
                    <option key={r}>{r}</option>
                  )
                )}
              </select>
            </Field>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAdd}
              className="cursor-pointer rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="cursor-pointer rounded-xl border px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {member.initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            <button
              onClick={() =>
                setStaff((prev) => prev.filter((s) => s.id !== member.id))
              }
              className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────── Notifications tab ─────────────── */

interface NotifSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

const initialNotifs: NotifSetting[] = [
  {
    id: "new_booking",
    label: "New booking",
    description: "Get notified when a client books an appointment",
    enabled: true,
  },
  {
    id: "cancellation",
    label: "Cancellation",
    description: "Get notified when a booking is cancelled",
    enabled: true,
  },
  {
    id: "reminder",
    label: "Appointment reminder",
    description: "Receive a reminder 1 hour before each appointment",
    enabled: false,
  },
  {
    id: "review",
    label: "New review",
    description: "Get notified when a client leaves a review",
    enabled: true,
  },
  {
    id: "marketing",
    label: "Marketing updates",
    description: "News and tips from the Salora team",
    enabled: false,
  },
]

function NotificationsTab() {
  const [notifs, setNotifs] = useState<NotifSetting[]>(initialNotifs)
  const [saved, setSaved] = useState(false)

  const toggle = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold text-gray-900">Notifications</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Choose which alerts you want to receive by email.
      </p>
      <div className="flex flex-col gap-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between rounded-xl border bg-white px-5 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.description}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={n.enabled}
                onChange={() => toggle(n.id)}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-primary after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
          className="cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {saved ? "Saved!" : "Save changes"}
        </button>
      </div>
    </div>
  )
}

/* ─────────────── shared helpers ─────────────── */

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

/* ─────────────── Page ─────────────── */

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile")

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your salon profile and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left nav */}
        <nav className="flex w-48 shrink-0 flex-col gap-1">
          <TabButton
            active={tab === "profile"}
            onClick={() => setTab("profile")}
          >
            Salon Profile
          </TabButton>
          <TabButton active={tab === "hours"} onClick={() => setTab("hours")}>
            Opening Hours
          </TabButton>
          <TabButton active={tab === "staff"} onClick={() => setTab("staff")}>
            Staff
          </TabButton>
          <TabButton
            active={tab === "notifications"}
            onClick={() => setTab("notifications")}
          >
            Notifications
          </TabButton>
        </nav>

        {/* Content panel */}
        <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm">
          {tab === "profile" && <SalonProfileTab />}
          {tab === "hours" && <OpeningHoursTab />}
          {tab === "staff" && <StaffTab />}
          {tab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  )
}
