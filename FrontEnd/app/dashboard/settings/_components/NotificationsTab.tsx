"use client"

import { useState } from "react"
import { toast } from "sonner"

interface NotifSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

const initialNotifs: NotifSetting[] = [
  { id: "new_booking", label: "New booking", description: "Get notified when a client books an appointment", enabled: true },
  { id: "cancellation", label: "Cancellation", description: "Get notified when a booking is cancelled", enabled: true },
  { id: "reminder", label: "Appointment reminder", description: "Receive a reminder 1 hour before each appointment", enabled: false },
  { id: "review", label: "New review", description: "Get notified when a client leaves a review", enabled: true },
  { id: "marketing", label: "Marketing updates", description: "News and tips from the Salora team", enabled: false },
]

export function NotificationsTab() {
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
            toast.success("Notifications saved", {
              classNames: {
                toast: "!bg-green-50 !border !border-green-400",
                title: "!text-green-700 !font-semibold",
              },
            })
          }}
          className="cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {saved ? "Saved!" : "Save changes"}
        </button>
      </div>
    </div>
  )
}
