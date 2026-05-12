"use client"

import { useState, useRef } from "react"
import { Plus, ImageIcon, Pencil, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PortfolioItem {
  id: number
  name: string
  imageUrl: string | null
}

const initialItems: PortfolioItem[] = [
  { id: 1, name: "Classic Fade", imageUrl: null },
  { id: 2, name: "Beard Sculpt", imageUrl: null },
  { id: 3, name: "Skin Fade", imageUrl: null },
  { id: 4, name: "Razor Finish", imageUrl: null },
  { id: 5, name: "Line Up", imageUrl: null },
  { id: 6, name: "Full Groom", imageUrl: null },
]

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const uploadRef = useRef<HTMLInputElement>(null)
  const addUploadRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => uploadRef.current?.click()
  const handleAddUploadClick = () => addUploadRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (id !== undefined) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, imageUrl: url } : item))
      )
    } else {
      const newItem: PortfolioItem = {
        id: Date.now(),
        name: "New photo",
        imageUrl: url,
      }
      setItems((prev) => [...prev, newItem])
    }
    e.target.value = ""
  }

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setHoveredId(null)
  }

  const handleEditStart = (item: PortfolioItem) => {
    setEditingId(item.id)
    setEditName(item.name)
  }

  const handleEditSave = () => {
    if (!editName.trim()) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, name: editName.trim() } : item
      )
    )
    setEditingId(null)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Show off your best work to attract new clients
          </p>
        </div>
        <button
          onClick={handleUploadClick}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Upload photo
        </button>
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Card background */}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-200",
                item.imageUrl ? "" : "bg-[#cdd9d3]"
              )}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Hover overlay */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55 transition-opacity duration-200",
                hoveredId === item.id ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditStart(item)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow transition-colors hover:bg-gray-100"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-red-600"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>

            {/* Label */}
            {editingId === item.id ? (
              <div className="absolute right-0 bottom-0 left-0 flex items-center gap-1.5 bg-white/90 px-3 py-2">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSave()
                    if (e.key === "Escape") setEditingId(null)
                  }}
                  className="flex-1 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleEditSave}
                  className="cursor-pointer rounded bg-primary p-1 text-white"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="cursor-pointer rounded bg-gray-200 p-1 text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="absolute right-0 bottom-0 left-0 flex items-end px-4 pb-4">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    hoveredId === item.id
                      ? "text-white"
                      : item.imageUrl
                        ? "text-white drop-shadow"
                        : "text-[#3a6352]"
                  )}
                >
                  {item.name}
                </span>
              </div>
            )}

            {/* Placeholder icon */}
            {!item.imageUrl && hoveredId !== item.id && (
              <div className="absolute inset-0 flex items-center justify-center pb-8">
                <ImageIcon size={36} className="text-[#3a6352]" strokeWidth={1.5} />
              </div>
            )}
          </div>
        ))}

        {/* Upload placeholder card */}
        <button
          onClick={handleAddUploadClick}
          className="group aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-green-50"
        >
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-primary/10">
              <Plus size={20} className="text-gray-500 group-hover:text-primary" />
            </div>
            <span className="text-sm text-gray-500 group-hover:text-primary">
              Click to upload a photo
            </span>
          </div>
        </button>
        <input
          ref={addUploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e)}
        />
      </div>
    </div>
  )
}
