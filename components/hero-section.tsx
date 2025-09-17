"use client"
import templeData from "@/data/temples.json"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { ParallaxBackground } from "@/components/parallax-background"
import { FloatingElements } from "@/components/floating-elements"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "react-i18next"

export function HeroSection() {
  const { t } = useTranslation()
  const japanTemples = templeData.japan.length
  const koreaTemples = templeData.korea.length
  const totalTemples = japanTemples + koreaTemples
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToTemples = () => {
    if (typeof window === "undefined") return
    window.location.hash = "japan-temples"
  }

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground className="absolute inset-0 -z-10">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

          {/* Dynamic gradient that follows mouse */}
          <motion.div
            className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                oklch(0.65 0.2 200 / 0.3) 0%, 
                oklch(0.7 0.22 120 / 0.2) 25%, 
                transparent 50%)`,
            }}
          />

          {/* Floating Elements */}
          <FloatingElements />
        </motion.div>
      </ParallaxBackground>

      {/* Sakura Flowers Overlay */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="animate-pulse">
            {/* Top left cluster */}
            <g transform="translate(150, 120)">
              <path
                d="M0,-12 C-5,-8 -12,0 -8,5 C-4,10 4,10 8,5 C12,0 5,-8 0,-12Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 50)" opacity="1" />
            </g>
            <g transform="translate(170, 100) rotate(45)">
              <path
                d="M0,-10 C-4,-6 -10,0 -6,4 C-3,7 3,7 6,4 C10,0 4,-6 0,-10Z"
                fill="oklch(0.8 0.2 340)"
                opacity="0.8"
              />
              <circle cx="0" cy="0" r="2.5" fill="oklch(0.9 0.1 50)" opacity="0.9" />
            </g>
            <g transform="translate(130, 140) rotate(-30)">
              <path
                d="M0,-8 C-3,-5 -8,0 -5,3 C-2,6 2,6 5,3 C8,0 3,-5 0,-8Z"
                fill="oklch(0.85 0.15 340)"
                opacity="0.7"
              />
              <circle cx="0" cy="0" r="2" fill="oklch(0.9 0.1 50)" opacity="0.8" />
            </g>

            {/* Top right cluster */}
            <g transform="translate(1050, 80) rotate(60)">
              <path
                d="M0,-11 C-5,-7 -11,0 -7,5 C-3,8 3,8 7,5 C11,0 5,-7 0,-11Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 50)" opacity="1" />
            </g>
            <g transform="translate(1080, 110) rotate(-15)">
              <path
                d="M0,-14 C-6,-9 -14,0 -9,6 C-4,11 4,11 9,6 C14,0 6,-9 0,-14Z"
                fill="oklch(0.8 0.2 340)"
                opacity="1"
              />
              <circle cx="0" cy="0" r="4" fill="oklch(0.9 0.1 50)" opacity="1" />
            </g>
            <g transform="translate(1020, 130) rotate(90)">
              <path
                d="M0,-7 C-3,-4 -7,0 -4,3 C-2,5 2,5 4,3 C7,0 3,-4 0,-7Z"
                fill="oklch(0.85 0.15 340)"
                opacity="0.7"
              />
              <circle cx="0" cy="0" r="2" fill="oklch(0.9 0.1 50)" opacity="0.8" />
            </g>

            {/* Middle left */}
            <g transform="translate(80, 300) rotate(120)">
              <path
                d="M0,-10 C-4,-6 -10,0 -6,4 C-3,7 3,7 6,4 C10,0 4,-6 0,-10Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.8"
              />
              <circle cx="0" cy="0" r="2.5" fill="oklch(0.9 0.1 50)" opacity="0.9" />
            </g>
            <g transform="translate(110, 280) rotate(-45)">
              <path
                d="M0,-12 C-5,-8 -12,0 -8,5 C-4,10 4,10 8,5 C12,0 5,-8 0,-12Z"
                fill="oklch(0.8 0.2 340)"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 50)" opacity="1" />
            </g>

            {/* Middle right */}
            <g transform="translate(1100, 350) rotate(30)">
              <path
                d="M0,-11 C-5,-7 -11,0 -7,5 C-3,8 3,8 7,5 C11,0 5,-7 0,-11Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 50)" opacity="1" />
            </g>

            {/* Bottom clusters */}
            <g transform="translate(200, 650) rotate(-60)">
              <path
                d="M0,-12 C-5,-8 -12,0 -8,5 C-4,10 4,10 8,5 C12,0 5,-8 0,-12Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.8"
              />
              <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 50)" opacity="0.9" />
            </g>
            <g transform="translate(950, 600) rotate(75)">
              <path
                d="M0,-11 C-5,-7 -11,0 -7,5 C-3,8 3,8 7,5 C11,0 5,-7 0,-11Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 50)" opacity="1" />
            </g>

            <g transform="translate(400, 180) rotate(25)">
              <path d="M0,-9 C-4,-6 -9,0 -6,4 C-3,7 3,7 6,4 C9,0 4,-6 0,-9Z" fill="oklch(0.8 0.2 340)" opacity="0.7" />
              <circle cx="0" cy="0" r="2" fill="oklch(0.9 0.1 50)" opacity="0.8" />
            </g>
            <g transform="translate(600, 320) rotate(-70)">
              <path
                d="M0,-8 C-3,-5 -8,0 -5,3 C-2,6 2,6 5,3 C8,0 3,-5 0,-8Z"
                fill="oklch(0.85 0.15 340)"
                opacity="0.6"
              />
              <circle cx="0" cy="0" r="2" fill="oklch(0.9 0.1 50)" opacity="0.7" />
            </g>
            <g transform="translate(750, 150) rotate(110)">
              <path
                d="M0,-10 C-4,-6 -10,0 -6,4 C-3,7 3,7 6,4 C10,0 4,-6 0,-10Z"
                fill="oklch(0.75 0.25 340)"
                opacity="0.8"
              />
              <circle cx="0" cy="0" r="2.5" fill="oklch(0.9 0.1 50)" opacity="0.9" />
            </g>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main glassmorphism card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
          className="glass-strong rounded-3xl p-8 md:p-12 lg:p-16 backdrop-blur-xl border border-border/30 shadow-2xl"
        >
          {/* Language Selector */}
          <AnimatedSection delay={0.2} direction="down">
            <LanguageSelector />
          </AnimatedSection>

          {/* Main title */}
          <AnimatedSection delay={0.4}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              <span className="text-primary">{t("hero_title_1")}</span>
              <span className="text-primary">{t("hero_title_2")}</span>
              <span className="text-primary">{t("hero_title_3")}</span>
              <br />
              <span className="text-foreground/90">{t("hero_title_4")}</span>
            </h1>
          </AnimatedSection>

          {/* Subtitle */}
          <AnimatedSection delay={0.6}>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("hero_subtitle")}
            </p>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.8}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { number: japanTemples.toString(), label: t("hero_stat_1_label"), color: "text-primary" },
                { number: koreaTemples.toString(), label: t("hero_stat_2_label"), color: "text-primary" },
                { number: totalTemples.toString(), label: t("hero_stat_3_label"), color: "text-accent" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass rounded-2xl p-6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className={`text-3xl font-bold ${stat.color} mb-2`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* CTA Button */}
          <AnimatedSection delay={1.2}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToTemples}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("hero_cta_button")}
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ChevronDown className="ml-2 w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </AnimatedSection>

          {/* Cultural note */}
          <AnimatedSection delay={1.4}>
            <p className="text-sm text-muted-foreground mt-6 italic">
              {t("hero_cultural_note")}
            </p>
          </AnimatedSection>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="glass rounded-full p-2">
          <ChevronDown className="w-6 h-6 text-primary" />
        </div>
      </motion.div>
    </section>
  )
}
