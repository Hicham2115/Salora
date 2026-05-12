"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Calendar,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Star,
  Users,
  BriefcaseBusiness,
  ExternalLink,
  LogOut,
} from "lucide-react"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import NoImage from "@/app/assets/noimage.png"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useClerk } from "@clerk/nextjs"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

const items = [
  {
    title: "Overview",
    url: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Clients",
    url: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Reviews",
    url: "/dashboard/reviews",
    icon: Star,
  },
  {
    title: "Portfolio",
    url: "/dashboard/portfolio",
    icon: Home,
  },
  {
    title: "Booking Page",
    url: "/dashboard/booking",
    icon: ExternalLink,
  },
]

export function AppSidebar() {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()
  const { signOut } = useClerk()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
      setShowLogoutDialog(false)
    }
  }

  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent className="px-3">
        <SidebarGroup>
          {/* LOGO + PROFILE */}
          <SidebarGroupLabel className="h-auto w-full p-0">
            <div className="mt-8 flex w-full flex-col gap-5">
              {/* LOGO */}
              <div className="flex items-center gap-3 transition-opacity">
                <div className="rounded-md bg-primary p-1 text-white shadow-sm">
                  <SidebarTrigger className="cursor-pointer hover:bg-primary hover:text-white hover:opacity-80" />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold tracking-tight text-black">
                      SALORA
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Salon Dashboard
                    </span>
                  </div>
                  <LogOut
                    onClick={() => setShowLogoutDialog(true)}
                    className="cursor-pointer text-gray-600 transition-transform duration-200"
                    size={20}
                  />{" "}
                </div>
              </div>

              <Separator />

              {/* USER */}
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                {!isLoaded ? (
                  <div className="h-11.25 w-11.25 animate-pulse rounded-full bg-muted" />
                ) : (
                  <Image
                    src={user?.imageUrl || NoImage}
                    alt="Profile"
                    width={45}
                    height={45}
                    className="rounded-full border object-cover"
                  />
                )}

                <div className="flex flex-col gap-1 overflow-hidden">
                  {!isLoaded ? (
                    <>
                      <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                    </>
                  ) : (
                    <>
                      <span className="truncate text-sm font-semibold text-black">
                        {user?.fullName || "Guest User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SidebarGroupLabel>

          {/* MENU */}
          <SidebarGroupContent className="">
            <div className="flex flex-col justify-between gap-20">
              <SidebarMenu className="mt-8 gap-2">
                {items.map((item) => {
                  const isActive = pathname === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-6 text-sm font-medium transition-all",
                            isActive
                              ? "bg-primary text-white shadow-sm hover:bg-primary! hover:text-white"
                              : "hover:bg-primary"
                          )}
                        >
                          <item.icon size={18} />

                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
              <div className="flex flex-col gap-4">
                <Separator />
                <Link
                  href="/dashboard/settings"
                  className={cn(
                    "mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    pathname === "/dashboard/settings"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-muted"
                  )}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                  {!isLoaded ? (
                    <div className="h-11.25 w-11.25 animate-pulse rounded-full bg-muted" />
                  ) : (
                    <Image
                      src={user?.imageUrl || NoImage}
                      alt="Profile"
                      width={45}
                      height={45}
                      className="rounded-full border object-cover"
                    />
                  )}

                  <div className="flex flex-col gap-1 overflow-hidden">
                    {!isLoaded ? (
                      <>
                        <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                      </>
                    ) : (
                      <>
                        <span className="truncate text-sm font-semibold text-black">
                          {user?.fullName || "Guest User"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.primaryEmailAddress?.emailAddress}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          Owner
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="cursor-pointer rounded-md border px-4 py-2 text-sm">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
