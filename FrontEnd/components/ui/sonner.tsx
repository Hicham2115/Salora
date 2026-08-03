"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!items-start !gap-3 !rounded-xl !border !p-4 !shadow-lg",
          title: "!text-sm !font-semibold",
          description: "!mt-0.5 !text-sm",
          actionButton: "!rounded-md !px-3 !py-1.5 !text-xs !font-semibold",
          cancelButton: "!rounded-md !px-3 !py-1.5 !text-xs !font-semibold",
          success:
            "!bg-green-50 !border-green-300 !text-green-800 [&_[data-icon]]:!text-green-600 [&_[data-description]]:!text-green-700",
          error:
            "!bg-red-50 !border-red-300 !text-red-800 [&_[data-icon]]:!text-red-600 [&_[data-description]]:!text-red-700 [&_[data-button]]:!bg-red-600 [&_[data-button]]:!text-white [&_[data-button]]:hover:!bg-red-700",
          warning:
            "!bg-amber-50 !border-amber-300 !text-amber-800 [&_[data-icon]]:!text-amber-600 [&_[data-description]]:!text-amber-700",
          info:
            "!bg-blue-50 !border-blue-300 !text-blue-800 [&_[data-icon]]:!text-blue-600 [&_[data-description]]:!text-blue-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
