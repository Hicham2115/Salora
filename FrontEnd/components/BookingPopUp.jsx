"use client"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Plus, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

function BookingPopUp({ open, onOpenChange }) {
  const SERVICES = [
    {
      id: "classic-haircut",
      label: "Classic Haircut",
      duration: "30 min",
      price: 60,
    },
    {
      id: "haircut-beard",
      label: "Haircut + Beard",
      duration: "60 min",
      price: 120,
    },
    {
      id: "premium-shave",
      label: "Premium Shave",
      duration: "45 min",
      price: 80,
    },
    {
      id: "beard-styling",
      label: "Beard Styling",
      duration: "30 min",
      price: 60,
    },
  ]

  const STAFF = ["Youssef", "Amine"]

  const TIME_SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const [time, setTime] = useState(TIME_SLOTS[4])
  const [serviceId, setServiceId] = useState(SERVICES[0].id)
  const [staff, setStaff] = useState(STAFF[0])
  const selectedService =
    SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0]
  const [clientName, setClientName] = useState("")
  const [phone, setPhone] = useState("")

  const [date, setDate] = useState("")
  const [notes, setNotes] = useState("")
  const [sendSms, setSendSms] = useState(true)

  return (
    <div>
      {/* NEW BOOKING DIALOG */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-225 gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold">
              New booking
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Add an appointment manually to the calendar
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
            {/* Client name + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="client-name" className="text-sm font-medium">
                  Client name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client-name"
                  placeholder="e.g. Hamza Alaoui"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="+212 6XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Service */}
            <div className="space-y-1.5">
              <Label htmlFor="service" className="text-sm font-medium">
                Service <span className="text-red-500">*</span>
              </Label>
              <select
                id="service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} — {s.duration} · {s.price} MAD
                  </option>
                ))}
              </select>
            </div>

            {/* Staff + Date + Time */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="staff" className="text-sm font-medium">
                  Staff <span className="text-red-500">*</span>
                </Label>
                <select
                  id="staff"
                  value={staff}
                  onChange={(e) => setStaff(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {STAFF.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </Label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-sm font-medium">
                  Time <span className="text-red-500">*</span>
                </Label>
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="e.g. First time client, prefers short sides..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full resize-none rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
              />
              <p className="text-xs text-muted-foreground">
                Private — only visible to your team
              </p>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between rounded-lg bg-[#f2ede6] px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Summary
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {selectedService.label} · {selectedService.duration}
                </p>
              </div>
              <p className="text-2xl font-bold">{selectedService.price} MAD</p>
            </div>

            {/* SMS checkbox */}
            <label className="flex cursor-pointer items-center gap-2 select-none">
              <div
                onClick={() => setSendSms((v) => !v)}
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                  sendSms
                    ? "border-[#1b4331] bg-[#1b4331]"
                    : "border-input bg-background"
                )}
              >
                {sendSms && (
                  <Check size={11} className="text-white" strokeWidth={3} />
                )}
              </div>
              <span className="text-sm">Send confirmation SMS to client</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer py-5"
            >
              Cancel
            </Button>
            <Button className="gap-2 bg-[#1b4331] py-5 hover:bg-[#163828]">
              <Check size={14} />
              Create booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingPopUp
