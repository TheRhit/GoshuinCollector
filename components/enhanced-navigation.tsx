"use client"
"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SakuraPetals } from "@/components/sakura-petals"
import type { ComponentPropsWithoutRef } from "react"

const JapanFlag = (props: ComponentPropsWithoutRef<"img">) => {
  const { t } = useTranslation()
  return <img src="/flag-jp.svg" alt={t("nav_japan_flag_alt")} {...props} />
}

const KoreaFlag = (props: ComponentPropsWithoutRef<"img">) => {
  const { t } = useTranslation()
  return <img src="/flag-kr.svg" alt={t("nav_korea_flag_alt")} {...props} />
}

const ToriiIcon = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 8h18v1.5H3V8z" fill="currentColor" />
    <path d="M2 6h20v1H2V6z" fill="currentColor" />
    <rect x="5" y="9" width="1.5" height="11" fill="currentColor" />
    <rect x="17.5" y="9" width="1.5" height="11" fill="currentColor" />
    <path d="M4.5 12h2v1h-2v-1z" fill="currentColor" />
    <path d="M17.5 12h2v1h-2v-1z" fill="currentColor" />
  </svg>
)

export function EnhancedNavigation() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ["hero", "japan-temples", "korea-temples", "interactive-map"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined") return

    // Update the hash, which will be picked up by the TempleSection component
    window.location.hash = sectionId
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { id: "hero", label: t("nav_home"), icon: Home },
    { id: "japan-temples", label: t("nav_japan"), icon: JapanFlag },
    { id: "korea-temples", label: t("nav_korea"), icon: KoreaFlag },
    { id: "interactive-map", label: t("nav_map"), icon: MapPin },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`relative fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-strong shadow-lg" : "bg-transparent"
      }`}
    >
      {isScrolled && <SakuraPetals density="light" className="opacity-20" />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection("hero")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <ToriiIcon className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-kouzan font-bold text-primary tracking-wide">
                {isMounted ? t("nav_title") : "Goshuin Collector"}
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      onClick={() => scrollToSection(item.id)}
                      className={`relative hover:glass transition-all duration-300 ${
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2 object-contain" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="glass hover:glass-strong transition-all duration-300"
                  aria-label={t("nav_toggle_menu_aria")}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 glass-strong rounded-lg mt-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full justify-start hover:glass transition-all duration-300 ${
                          isActive ? "text-primary bg-primary/10" : ""
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2 object-contain" />
                        {item.label}
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary"
        style={{
          width:
            typeof window !== "undefined" && typeof document !== "undefined"
              ? `${((window.pageYOffset || 0) / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
              : "0%",
        }}
        initial={{ width: 0 }}
      />
    </motion.nav>
  )
}
