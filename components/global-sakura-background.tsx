"use client"
import { SakuraPetals } from "@/components/sakura-petals"

export function GlobalSakuraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <SakuraPetals density="light" className="opacity-20" />
    </div>
  )
}
