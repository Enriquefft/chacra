"use client"

import { useEffect, useRef, useState } from "react"

interface StatCounterProps {
  end: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}

export function StatCounter({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
}: StatCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const start = performance.now()

          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(
              decimals > 0
                ? Math.round(eased * end * 10 ** decimals) / 10 ** decimals
                : Math.round(eased * end)
            )
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, decimals])

  const formatted =
    decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
