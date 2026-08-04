"use client"

import { useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_SIZE_MB = 2

function errorMsg(error, fallback) {
  return error?.response?.data?.message || fallback
}

function imageUrl(path) {
  return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`
}

export default function PortfolioPage() {
  const queryClient = useQueryClient()
  const [hoveredId, setHoveredId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const fileInputRef = useRef(null)

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio_images_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio_images_data`
      )
      return res.data
    },
  })

  const items = data ?? []

  const createMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append("img", file)
      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create_portfolio_image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["portfolio_images_data"] })
      toast.success("Photo uploaded")
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to upload photo"))
    },
  })

  const renameMutation = useMutation({
    mutationFn: ({ id, name }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_portfolio_image`,
        { id, name }
      ),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["portfolio_images_data"] })
      setEditingId(null)
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to rename photo"))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/delete_portfolio_image`,
        { id }
      ),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["portfolio_images_data"] })
      setHoveredId(null)
      toast.success("Photo removed")
    },
    onError: (error) => {
      toast.error(errorMsg(error, "Failed to delete photo"))
    },
  })

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB.`)
      return
    }

    createMutation.mutate(file)
  }

  const handleEditStart = (item) => {
    setEditingId(item.id)
    setEditName(item.name)
  }

  const handleEditSave = () => {
    if (!editName.trim()) return
    renameMutation.mutate({ id: editingId, name: editName.trim() })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Show off your best work to attract new clients
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Upload photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading portfolio...
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Card background */}
              <div className="absolute inset-0 transition-colors duration-200">
                <img
                  src={imageUrl(item.image_path)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
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
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-red-600"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Label */}
              {editingId === item.id ? (
                <div className="absolute right-0 bottom-0 left-0 flex items-center gap-1.5 bg-black/85 px-3 py-2">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave()
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    className="flex-1 rounded border border-white/15 bg-white/10 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <button
                    onClick={handleEditSave}
                    className="cursor-pointer rounded bg-primary p-1 text-primary-foreground"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="cursor-pointer rounded bg-white/10 p-1 text-white"
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
                        : "text-white drop-shadow"
                    )}
                  >
                    {item.name}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Upload placeholder card */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-card transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
                <Plus
                  size={20}
                  className="text-muted-foreground group-hover:text-primary"
                />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-primary">
                Click to upload a photo
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
