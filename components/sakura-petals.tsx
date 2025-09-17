"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SakuraPetalsProps {
  density?: "light" | "medium" | "heavy"
  className?: string
}

export function SakuraPetals({ density = "medium", className = "" }: SakuraPetalsProps) {
  const [petals, setPetals] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; type: "petal" | "streak" }>
  >([])
  const [isMounted, setIsMounted] = useState(false)

  const petalCount = {
    light: 8,
    medium: 15,
    heavy: 25,
  }[density]

  useEffect(() => {
    setIsMounted(true)
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 4,
      type: "petal" as const,
    }))

    const newStreaks = Array.from({ length: Math.floor(petalCount / 3) }, (_, i) => ({
      id: i + petalCount,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0, // not used
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 6,
      type: "streak" as const,
    }))

    setPetals([...newPetals, ...newStreaks])
  }, [petalCount])

  if (!isMounted) {
    return null
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 ${className}`}>
      {petals.map((petal) => {
        if (petal.type === "petal") {
          return (
            <motion.div
              key={petal.id}
              className="absolute"
              style={{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
              }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 0.3, 0.8, 0.3, 0],
                scale: [0.3, 0.8, petal.size, 0.8, 0.3],
                x: [0, Math.sin(petal.id) * 50, Math.sin(petal.id + 1) * 30],
                y: [0, 20, 40],
              }}
              transition={{
                duration: petal.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: petal.delay,
                ease: "easeInOut",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12,2 C10,6 6,10 10,12 C6,14 10,18 12,22 C14,18 18,14 14,12 C18,10 14,6 12,2Z"
                  fill="oklch(0.75 0.25 340)"
                  opacity="0.8"
                />
                <circle cx="12" cy="12" r="2.5" fill="oklch(0.9 0.1 50)" opacity="0.9" />
              </svg>
            </motion.div>
          )
        }
        if (petal.type === "streak") {
          return (
            <motion.div
              key={petal.id}
              className="absolute"
              style={{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                y: [50, -50, -150],
                x: [0, Math.sin(petal.id) * 50, Math.cos(petal.id) * 30],
                rotate: [0, 180, 360],
                opacity: [0, 0.2, 0.6, 0.2, 0],
              }}
              transition={{
                duration: petal.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: petal.delay,
                ease: "easeOut",
              }}
            >
              <div className="w-2 h-6 rounded-full opacity-20" style={{ backgroundColor: "oklch(0.8 0.2 340)" }} />
            </motion.div>
          )
        }
        return null
      })}
    </div>
  )
}
