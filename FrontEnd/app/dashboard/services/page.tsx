"use client"

import { useState } from "react"
import { Plus, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Service {
  id: number
  name: string
  category: string
  duration: number
  price: number
  staff: string[]
}

const CATEGORIES = ["Haircut", "Beard", "Grooming", "Color", "Treatment"]

const initialServices: Service[] = [
  {
    id: 1,
    name: "Classic Haircut",
    category: "Haircut",
    duration: 30,
    price: 60,
    staff: ["Youssef", "Amine"],
  },
  {
    id: 2,
    name: "Haircut + Beard",
    category: "Haircut",
    duration: 60,
    price: 120,
    staff: ["Youssef", "Amine"],
  },
  {
    id: 3,
    name: "Kids Haircut",
    category: "Haircut",
    duration: 20,
    price: 40,
    staff: ["Amine"],
  },
  {
    id: 4,
    name: "Beard Trim",
    category: "Beard",
    duration: 20,
    price: 50,
    staff: ["Youssef", "Amine"],
  },
  {
    id: 5,
    name: "Beard Styling",
    category: "Beard",
    duration: 30,
    price: 60,
    staff: ["Youssef"],
  },
  {
    id: 6,
    name: "Premium Shave",
    category: "Beard",
    duration: 45,
    price: 80,
    staff: ["Youssef"],
  },
  {
    id: 7,
    name: "Scalp Treatment",
    category: "Grooming",
    duration: 30,
    price: 90,
    staff: ["Youssef"],
  },
  {
    id: 8,
    name: "Hair Mask",
    category: "Grooming",
    duration: 45,
    price: 100,
    staff: ["Amine"],
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    category: "Haircut",
    name: "",
    duration: "30",
    price: "60",
  })

  const categories = Array.from(new Set(services.map((s) => s.category)))

  const totalServices = services.length
  const totalCategories = categories.length

  const handleSave = () => {
    if (!form.name.trim()) return
    const newService: Service = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      duration: Number(form.duration),
      price: Number(form.price),
      staff: [],
    }
    setServices((prev) => [...prev, newService])
    setForm({ category: "Haircut", name: "", duration: "30", price: "60" })
    setShowForm(false)
  }

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {totalServices} service{totalServices !== 1 ? "s" : ""} across{" "}
            {totalCategories} categor{totalCategories !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Add service
        </Button>
      </div>

      {/* Add service form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-900">
            New service
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Service name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Service Name
              </label>
              <input
                type="text"
                placeholder="e.g. Classic Fade"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Duration (min)
              </label>
              <input
                type="number"
                min={5}
                value={form.duration}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration: e.target.value }))
                }
                className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Price (MAD)
              </label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSave}
              className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Save service
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="cursor-pointer rounded-lg border px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services grouped by category */}
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
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="absolute top-4 right-4 cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>

                    <p className="pr-6 text-sm font-bold text-gray-900">
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

                    {service.staff.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {service.staff.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border bg-gray-50 px-2.5 py-0.5 text-xs text-gray-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
