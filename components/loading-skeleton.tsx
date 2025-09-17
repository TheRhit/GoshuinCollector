"use client"
import { motion } from "framer-motion"

export function TempleCardSkeleton() {
  return (
    <div className="glass rounded-lg overflow-hidden border border-border/30">
      <div className="relative h-48 bg-muted animate-pulse">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="h-16 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
          <div className="h-8 bg-muted rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-strong rounded-3xl p-16 max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          <div className="h-16 bg-muted rounded animate-pulse mx-auto w-3/4" />
          <div className="h-6 bg-muted rounded animate-pulse mx-auto w-1/2" />
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-12 bg-muted rounded-2xl animate-pulse w-48 mx-auto" />
        </div>
      </div>
    </div>
  )
}
