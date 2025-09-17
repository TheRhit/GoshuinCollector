"use client"
import { useEffect } from "react"

export function AccessibilityImprovements() {
  useEffect(() => {
    if (typeof document === "undefined") return

    // Add skip link for keyboard navigation
    const skipLink = document.createElement("a")
    skipLink.href = "#main-content"
    skipLink.textContent = "Saltar al contenido principal"
    skipLink.className =
      "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Improve focus management
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modals/menus
      if (e.key === "Escape") {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && activeElement.blur) {
          activeElement.blur()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink)
      }
    }
  }, [])

  return null
}
