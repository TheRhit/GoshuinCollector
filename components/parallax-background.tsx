"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import type React from "react"

import { useRef } from "react"

interface ParallaxBackgroundProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function ParallaxBackground({ children, className = "", speed = 0.5 }: ParallaxBackgroundProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  )
}
