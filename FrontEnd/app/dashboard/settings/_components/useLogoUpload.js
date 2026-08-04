"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

const MAX_SIZE_MB = 2

export function useLogoUpload() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const inputRef = useRef(null)

  const openFileDialog = () => inputRef.current?.click()

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleChange = (e) => {
    const selected = e.target.files?.[0]
    e.target.value = ""
    if (!selected) return

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB.`)
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  return {
    file,
    previewUrl,
    openFileDialog,
    removeFile,
    inputProps: { ref: inputRef, type: "file", accept: "image/*", onChange: handleChange },
  }
}
