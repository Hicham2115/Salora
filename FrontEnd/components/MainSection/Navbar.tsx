"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { HouseIcon, InboxIcon, SearchIcon, ZapIcon } from "lucide-react"
import { useId } from "react"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

const navigationLinks = [
  { active: true, href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
]

export default function Component() {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-9999 border-b border-white/10 bg-[#0a0a0a] px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          className="flex-row items-center gap-2 py-1.5 font-jakarta text-foreground"
                          href={link.href}
                        >
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, _index) => {
              return (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    className="group/navlink relative flex-row items-center gap-2 py-1.5 font-jakarta font-medium text-foreground transition-colors duration-200 hover:bg-transparent hover:text-primary"
                    href={link.href}
                  >
                    <span>{link.label}</span>
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-200 group-hover/navlink:w-full" />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end gap-2">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button className="relative cursor-pointer p-5 font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#c99a3f] hover:shadow-lg active:translate-y-0 active:scale-95">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <div className="relative flex items-center gap-4 font-jakarta">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button
                  variant="outline"
                  className="cursor-pointer border border-white/20 bg-transparent p-5 font-semibold text-white transition-all duration-300 ease-out hover:border-primary hover:bg-transparent hover:text-white"
                >
                  Log in
                </Button>
              </SignInButton>

              <Link href="/sign-up">
                <Button className="relative cursor-pointer p-5 font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#c99a3f] hover:shadow-lg active:translate-y-0 active:scale-95">
                  Get started free →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
