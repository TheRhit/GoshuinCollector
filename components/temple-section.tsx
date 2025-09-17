"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TempleGrid } from "@/components/temple-grid"
import { SakuraPetals } from "@/components/sakura-petals"

export function TempleSection() {
  const { t } = useTranslation()
  const [activeCountry, setActiveCountry] = useState<"japan" | "korea">("japan")

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleHashChange = () => {
      if (window.location.hash === "#korea-temples") {
        setActiveCountry("korea")
      } else if (window.location.hash === "#japan-temples") {
        setActiveCountry("japan")
      }
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Check initial hash
    handleHashChange()

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  // Scroll to the active section when it changes
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1)
      const element = document.getElementById(sectionId)
      if (element) {
        // A small timeout to ensure the element is visible after state update
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }
    }
  }, [activeCountry])

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8">
      <SakuraPetals density="light" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Country Toggle */}
        <div className="flex justify-center mb-16">
          <div className="glass rounded-2xl p-2 inline-flex">
            <button
              onClick={() => {
                setActiveCountry("japan")
                window.location.hash = "japan-temples"
              }}
              className={`flex items-center gap-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeCountry === "japan"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <img src="/flag-jp.svg" alt={t("temple_section_japan_flag_alt")} className="w-6 h-auto" />
              {t("temple_section_japan")}
            </button>
            <button
              onClick={() => {
                setActiveCountry("korea")
                window.location.hash = "korea-temples"
              }}
              className={`flex items-center gap-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeCountry === "korea"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <img src="/flag-kr.svg" alt={t("temple_section_korea_flag_alt")} className="w-6 h-auto" />
              {t("temple_section_korea")}
            </button>
          </div>
        </div>

        {activeCountry === "japan" && (
          <section id="japan-temples">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-primary">{t("temple_section_japan_title")}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                {t("temple_section_japan_subtitle")}
              </p>
            </div>
            <TempleGrid country="japan" />
          </section>
        )}

        {activeCountry === "korea" && (
          <section id="korea-temples">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-secondary">{t("temple_section_korea_title")}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                {t("temple_section_korea_subtitle")}
              </p>
            </div>
            <TempleGrid country="korea" />
          </section>
        )}
      </div>
    </div>
  )
}
