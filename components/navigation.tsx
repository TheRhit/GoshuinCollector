"use client"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (typeof document === "undefined") return

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-strong" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">Templos</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("hero")}
                className="hover:glass transition-all duration-300"
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("japan-temples")}
                className="hover:glass transition-all duration-300"
              >
                Japón
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("korea-temples")}
                className="hover:glass transition-all duration-300"
              >
                Corea del Sur
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="glass hover:glass-strong transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-strong rounded-lg mt-2">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("hero")}
                className="w-full justify-start hover:glass transition-all duration-300"
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("japan-temples")}
                className="w-full justify-start hover:glass transition-all duration-300"
              >
                Japón
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("korea-temples")}
                className="w-full justify-start hover:glass transition-all duration-300"
              >
                Corea del Sur
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
