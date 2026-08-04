"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

const notifSchema = [
  {
    id: "new_booking",
    label: "New booking",
    description: "Get notified when a client books an appointment",
    dbKey: "booking_notification",
  },
  {
    id: "cancellation",
    label: "Cancellation",
    description: "Get notified when a booking is cancelled",
    dbKey: "cancelation_notification",
  },
  {
    id: "reminder",
    label: "Appointment reminder",
    description: "Receive a reminder 1 hour before each appointment",
    dbKey: "appointement_reminder",
  },
  {
    id: "review",
    label: "New review",
    description: "Get notified when a client leaves a review",
    dbKey: "new_review_notification",
  },
  {
    id: "marketing",
    label: "Marketing updates",
    description: "News and tips from the Salora team",
    dbKey: "marketing_notification",
  },
]

const defaultEnabled = {
  new_booking: true,
  cancellation: true,
  reminder: false,
  review: true,
  marketing: false,
}

export function NotificationsTab() {
  const queryClient = useQueryClient()
  const [notifs, setNotifs] = useState(
    notifSchema.map((n) => ({ ...n, enabled: defaultEnabled[n.id] }))
  )

  const { data: existingData } = useQuery({
    queryKey: ["notifications_data"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications_data`)
        .then((res) => res.data.data),
    retry: false,
  })

  useEffect(() => {
    if (existingData) {
      setNotifs((prev) =>
        prev.map((n) => ({ ...n, enabled: !!existingData[n.dbKey] }))
      )
    }
  }, [existingData])

  const toggle = (id) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )

  const buildPayload = () =>
    notifSchema.reduce((acc, n) => {
      acc[n.dbKey] = notifs.find((s) => s.id === n.id).enabled
      return acc
    }, {})

  const mutationConfig = (url) => ({
    mutationFn: (payload) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/${url}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications_data"] })
      toast.success("Notification settings saved", {
        description: "Your notification preferences have been updated.",
      })
    },
    onError: (error) => {
      const status = error?.response?.status
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to save notification settings"
      if (status >= 400 && status < 500) {
        toast.warning(errorMessage, {
          description: "Please check your inputs and try again.",
        })
      } else {
        toast.error(errorMessage, {
          description: "Something went wrong. Please try again.",
        })
      }
    },
  })

  const saveMutation = useMutation(mutationConfig("create_notifications"))

  const handleSave = () => saveMutation.mutate(buildPayload())

  const isPending = saveMutation.isPending

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold text-white">Notifications</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Choose which alerts you want to receive by email.
      </p>
      <div className="flex flex-col gap-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-card px-5 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-white">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.description}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={n.enabled}
                onChange={() => toggle(n.id)}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-white/15 transition-colors peer-checked:bg-primary after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  )
}
