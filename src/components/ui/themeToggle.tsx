"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useMounted } from "@/hooks/use-mounted"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useMounted()

  const toggleMenu = () => {
    if (resolvedTheme === 'light') setTheme('dark')
    if (resolvedTheme === 'dark') setTheme('light')
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleMenu}>
      {resolvedTheme === 'dark' && <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />}
      {resolvedTheme === 'light' && <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}