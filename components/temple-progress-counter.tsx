"use client"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Trophy, Target } from "lucide-react"

interface TempleProgressCounterProps {
  visitedCount: number
  totalCount: number
}

export function TempleProgressCounter({ visitedCount, totalCount }: TempleProgressCounterProps) {
  const { t } = useTranslation()
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [showMotivation, setShowMotivation] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const prevVisitedCount = useRef(visitedCount)

  const MOTIVATIONAL_PHRASES_KEYS = Array.from({ length: 10 }, (_, i) => `progress_motivational_phrase_${i + 1}`)

  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0
  const isNearCompletion = percentage >= 70
  const isComplete = visitedCount === totalCount

  useEffect(() => {
    if (visitedCount > 0 && visitedCount > prevVisitedCount.current) {
      const randomKey = MOTIVATIONAL_PHRASES_KEYS[Math.floor(Math.random() * MOTIVATIONAL_PHRASES_KEYS.length)]
      setCurrentPhrase(t(randomKey))
      setShowMotivation(true)
      const timer = setTimeout(() => setShowMotivation(false), 3000)
      prevVisitedCount.current = visitedCount
      return () => clearTimeout(timer)
    } else {
      prevVisitedCount.current = visitedCount
    }
  }, [visitedCount, t])

  return (
    <motion.div
      onTap={() => setIsMinimized(!isMinimized)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`fixed z-[999999] cursor-pointer bottom-4 right-4 ${
        isMinimized
          ? "w-20 h-20 rounded-full bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center"
          : "bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg max-w-xs"
      }`}
    >
      <AnimatePresence>
        {isMinimized ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div
              className={`text-xl font-bold ${
                isComplete ? "text-yellow-500" : "text-primary"
              }`}
            >
              {percentage}%
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isComplete ? (
                  <Trophy className="w-5 h-5 text-yellow-500" />
                ) : isNearCompletion ? (
                  <Target className="w-5 h-5 text-primary" />
                ) : (
                  <Sparkles className="w-5 h-5 text-accent" />
                )}

                <div className="text-sm">
                  <div className="font-semibold text-foreground">
                    {t("progress_temples_count", { visitedCount, totalCount })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("progress_percentage_completed", { percentage })}
                  </div>
                </div>
              </div>

              <Badge
                variant={isComplete ? "default" : "secondary"}
                className={
                  isComplete
                    ? "bg-yellow-500 text-yellow-50"
                    : "bg-primary text-primary-foreground"
                }
              >
                {isComplete ? t("progress_completed") : `${percentage}%`}
              </Badge>
            </div>

            {/* Barra de progreso */}
            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Frases motivacionales */}
            <AnimatePresence>
              {showMotivation && currentPhrase && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="mt-3 p-2 bg-primary/80 rounded-md border border-primary/40"
                >
                  <p className="text-xs text-white font-medium text-center">{currentPhrase}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
