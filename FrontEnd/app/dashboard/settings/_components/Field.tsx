"use client"

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}
