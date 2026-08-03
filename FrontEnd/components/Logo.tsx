import { Scissors } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  iconSize = 19,
}: {
  className?: string
  iconSize?: number
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-md bg-primary p-1.5">
        <Scissors className="text-primary-foreground" size={iconSize} />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        Sal<span className="text-primary">ora</span>
      </span>
    </div>
  )
}
