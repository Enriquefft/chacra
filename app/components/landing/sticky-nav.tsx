"use client"

import { useEffect, useState, type ReactNode } from "react"

export function StickyNav({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? "border-border/50 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {children}
    </nav>
  )
}
