"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Home, Search, Heart, User } from "lucide-react"
import { ThemeToggle } from "@/components/ui/themeToggle"

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    title: "Games",
    href: "/mygames",
    icon: Search,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="relative flex items-center px-2 py-2">
        <NavigationMenu className="flex-1 max-w-none">
          <NavigationMenuList className="flex w-full justify-around max-w-md mx-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <NavigationMenuItem key={item.href} className={cn("flex-1", index < navItems.length - 1 && "border-r border-border")}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none md:flex-row md:gap-2 md:text-sm",
                        isActive
                          ? "bg-accent/20 text-foreground scale-95"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 md:h-4 md:w-4" />
                      <span className="text-center">{item.title}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="absolute right-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
