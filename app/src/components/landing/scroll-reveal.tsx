"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
  duration?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 12,
  duration = 400,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1"
      el.style.transform = "none"
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true"
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      data-animate
      style={
        {
          "--animate-delay": `${delay}ms`,
          "--animate-duration": `${duration}ms`,
          "--slide-distance": `${distance}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
