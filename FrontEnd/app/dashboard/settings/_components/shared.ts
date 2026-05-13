export interface StaffMember {
  id: number
  name: string
  role: string
  initials: string
}

export interface DaySchedule {
  open: boolean
  from: string
  to: string
}

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export const defaultHours: Record<string, DaySchedule> = {
  Monday: { open: true, from: "09:00", to: "19:00" },
  Tuesday: { open: true, from: "09:00", to: "19:00" },
  Wednesday: { open: true, from: "09:00", to: "19:00" },
  Thursday: { open: true, from: "09:00", to: "19:00" },
  Friday: { open: true, from: "09:00", to: "19:00" },
  Saturday: { open: true, from: "10:00", to: "17:00" },
  Sunday: { open: false, from: "10:00", to: "17:00" },
}

export const ROLES = ["Barber", "Senior Barber", "Manager", "Receptionist"]

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const inputCls =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
