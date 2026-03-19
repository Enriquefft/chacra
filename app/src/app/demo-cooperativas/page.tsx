import type { Metadata } from "next"
import { DemoCooperativasSections } from "./sections"

export const metadata: Metadata = {
  title: "Demo — Cooperativa Valle Verde | Chacra",
  description:
    "Dashboard de trazabilidad y scoring para Cooperativa Agraria Valle Verde. 12 productores, 3,247 kg, todo en una pantalla.",
  openGraph: {
    title: "Demo — Cooperativa Valle Verde | Chacra",
    description:
      "Dashboard cooperativa: trazabilidad, scoring crediticio, y alertas de integridad en tiempo real.",
    type: "website",
    locale: "es_PE",
    siteName: "Chacra",
  },
}

export default function DemoCooperativasPage() {
  return <DemoCooperativasSections />
}
