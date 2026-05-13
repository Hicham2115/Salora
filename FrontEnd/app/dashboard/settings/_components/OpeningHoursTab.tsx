"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { DAYS, DaySchedule, defaultHours } from "./shared"

export function OpeningHoursTab() {
  const [hours, setHours] = useState(defaultHours)
  const queryClient = useQueryClient()

  const toggle = (day: string) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], open: !h[day].open } }))

  const setTime = (day: string, field: "from" | "to", val: string) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], [field]: val } }))

  const { data } = useQuery({
    queryKey: ["opening_hours_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/opening_hours_data`
      )
      return res.data
    },
  })

  useEffect(() => {
    if (!data?.data) return
    const mapped: Record<string, DaySchedule> = {}
    for (const day of DAYS) {
      const entry = data.data[day.toLowerCase()]
      mapped[day] = entry
        ? { open: !entry.is_closed, from: entry.open, to: entry.close }
        : { open: false, from: "09:00", to: "18:00" }
    }
    setHours(mapped)
  }, [data])

  const apiPayload = useMemo(
    () =>
      Object.fromEntries(
        DAYS.map((day) => {
          const s = hours[day]
          return [
            day.toLowerCase(),
            s.open ? { open: s.from, close: s.to, is_closed: false } : null,
          ]
        })
      ),
    [hours]
  )

  const hoursSuccessToast = () =>
    toast.success("Opening hours saved", {
      description: "Your opening hours have been updated successfully.",
      classNames: {
        toast: "!bg-green-50 !border !border-green-400",
        title: "!text-green-700 !font-semibold",
        description: "!text-green-600",
        icon: "!text-green-600",
      },
    })

  const hoursErrorToast = (error: unknown, onRetry: () => void) => {
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
        action: { label: "Retry", onClick: onRetry },
        classNames: {
          toast: "!bg-red-50 !border !border-red-400",
          title: "!text-red-700 !font-semibold",
          description: "!text-red-600",
          actionButton: "!bg-red-600 !text-white hover:!bg-red-700",
          icon: "!text-red-600",
        },
      })
    }
  }

  const addOpeningHours = useMutation({
    mutationFn: (payload: object) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create_opening_hours`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opening_hours_data"] })
      hoursSuccessToast()
    },
    onError: (error) =>
      hoursErrorToast(error, () => addOpeningHours.mutate(apiPayload)),
  })

  const updateOpeningHours = useMutation({
    mutationFn: (payload: object) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/update_opening_hours`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opening_hours_data"] })
      hoursSuccessToast()
    },
    onError: (error) =>
      hoursErrorToast(error, () =>
        updateOpeningHours.mutate({ id: data?.data?.id, ...apiPayload })
      ),
  })

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
                <span className="text-sm font-semibold text-gray-900">{day}</span>
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
            if (data?.data?.id) {
              updateOpeningHours.mutate({ id: data.data.id, ...apiPayload })
            } else {
              addOpeningHours.mutate({ owner_id: 1, ...apiPayload })
            }
          }}
          className="cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {addOpeningHours.isPending || updateOpeningHours.isPending ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={() => setHours(defaultHours)}
          className="cursor-pointer rounded-md border px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
