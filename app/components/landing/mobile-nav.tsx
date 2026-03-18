"use client"

import { useState } from "react"
import { HamburgerMenu } from "@solar-icons/react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/landing/logo"

const links = [
  { label: "Problema", href: "#problema" },
  { label: "Solucion", href: "#solucion" },
  { label: "Cooperativas", href: "#cooperativas" },
  { label: "Financieras", href: "#financieras" },
  { label: "Precios", href: "#precios" },
]

export function MobileNav({ calLink }: { calLink: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <HamburgerMenu weight="Linear" size={20} />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>
            <Logo className="h-6" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Button size="lg" className="w-full" asChild>
            <a href={calLink} target="_blank" rel="noopener noreferrer">Agendar Demo</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
