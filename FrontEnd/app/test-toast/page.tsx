"use client"

import { toast } from "sonner"

export default function TestToastPage() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4 bg-black p-8">
      <button
        id="fire-success"
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold"
        onClick={() =>
          toast.success("Service added", {
            description: "dadad has been added.",
          })
        }
      >
        Fire success
      </button>
      <button
        id="fire-warning"
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold"
        onClick={() =>
          toast.warning("Check your input", {
            description: "Please check your inputs and try again.",
          })
        }
      >
        Fire warning
      </button>
      <button
        id="fire-error"
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold"
        onClick={() =>
          toast.error("Failed to add service", {
            description: "Something went wrong. Please try again.",
          })
        }
      >
        Fire error
      </button>
    </div>
  )
}
