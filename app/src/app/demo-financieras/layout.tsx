import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo — Scoring crediticio para el agro | Chacra",
  description:
    "Explora cómo Chacra convierte transacciones agrícolas en perfiles de crédito verificados. Portafolio de productores, trust score e integridad de datos.",
  openGraph: {
    title: "Demo — Scoring crediticio para el agro | Chacra",
    description:
      "Perfiles de crédito verificados para productores rurales. Datos reales, scoring automático, cero fricción.",
    type: "website",
    locale: "es_PE",
    siteName: "Chacra",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DemoFinancierasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
