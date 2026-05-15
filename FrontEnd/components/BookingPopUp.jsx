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
import Link from "next/link"
import { Check, UserPlus, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]

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

function BookingPopUp({ open, onOpenChange }) {
  const queryClient = useQueryClient()

  const [clientName, setClientName] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [staffId, setStaffId] = useState("")
  const [date, setDate] = useState(undefined)
  const [time, setTime] = useState(TIME_SLOTS[4])
  const [notes, setNotes] = useState("")
  const [sendSms, setSendSms] = useState(true)

  const { data: servicesData } = useQuery({
    queryKey: ["services_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services_data`
      )
      return res.data
    },
    enabled: open,
  })

  const { data: staffData } = useQuery({
    queryKey: ["staff_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff_data`
      )
      return res.data?.data ?? res.data
    },
    enabled: open,
  })

  const services = Array.isArray(servicesData) ? servicesData : []
  const staff = Array.isArray(staffData) ? staffData : []

  const selectedService = services.find((s) => String(s.id) === serviceId)

  const createMutation = useMutation({
    mutationFn: (payload) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create_booking`,
        payload
      ),
    onSuccess: async (_, vars) => {
      await queryClient.refetchQueries({ queryKey: ["bookings_data"] })
      toast.success("Booking created", {
        description: `Appointment for ${vars.client_name} has been added.`,
        classNames: successToast,
      })
      resetForm()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create booking",
        { classNames: errorToast }
      )
    },
  })

  function resetForm() {
    setClientName("")
    setPhone("")
    setServiceId("")
    setStaffId("")
    setDate(undefined)
    setTime(TIME_SLOTS[4])
    setNotes("")
    setSendSms(true)
  }

  function handleSubmit() {
    if (!clientName.trim()) {
      toast.error("Client name is required", { classNames: errorToast })
      return
    }
    if (!serviceId) {
      toast.error("Please select a service", { classNames: errorToast })
      return
    }
    if (!staffId) {
      toast.error("Please select a staff member", { classNames: errorToast })
      return
    }
    if (!date) {
      toast.error("Please select a date", { classNames: errorToast })
      return
    }

    const selectedStaff = staff.find((s) => String(s.id) === staffId)

    createMutation.mutate({
      client_name: clientName.trim(),
      phone: phone.trim() || null,
      service: selectedService?.name ?? "",
      staff: selectedStaff?.staff_name ?? "",
      date: format(date, "yyyy-MM-dd"),
      time,
      duration: selectedService?.duration ?? 30,
      price: selectedService?.price ?? 0,
      status: "pending",
      notes: notes.trim() || null,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm()
        onOpenChange(val)
      }}
    >
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
                Phone number
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
              <option value="">Select a service…</option>
              {services.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name} — {s.duration}min · {s.price} MAD
                </option>
              ))}
            </select>
          </div>

          {/* Staff + Date + Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="staff" className="text-sm font-medium">
                  Staff <span className="text-red-500">*</span>
                </Label>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <UserPlus size={11} /> Add staff
                </Link>
              </div>
              <select
                id="staff"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
              >
                <option value="">Select staff…</option>
                {staff.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.staff_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon size={14} />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
          {selectedService && (
            <div className="flex items-center justify-between rounded-lg bg-[#f2ede6] px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Summary
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {selectedService.name} · {selectedService.duration}min
                </p>
              </div>
              <p className="text-2xl font-bold">{selectedService.price} MAD</p>
            </div>
          )}

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
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
            className="cursor-pointer py-5"
          >
            Cancel
          </Button>
          <Button
            className="gap-2 bg-[#1b4331] py-5 hover:bg-[#163828]"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            <Check size={14} />
            {createMutation.isPending ? "Creating..." : "Create booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingPopUp
