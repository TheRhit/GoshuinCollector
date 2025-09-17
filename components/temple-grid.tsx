"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { createPortal } from "react-dom"
import dynamic from "next/dynamic"
import { TempleCard } from "@/components/temple-card"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Temple {
  id: string
  name: string
  location: string
  image: string
  hours: string
  entryCost: string
  goshuinCost: string
  nearestStation: string
  culturalTip: string
  coordinates: { lat: number; lng: number }
}

interface TempleGridProps {
  country: "japan" | "korea"
}

const TempleProgressCounter = dynamic(
  () => import("@/components/temple-progress-counter").then((mod) => mod.TempleProgressCounter),
  { ssr: false }
)

export function TempleGrid({ country }: TempleGridProps) {
  const { t, i18n } = useTranslation()
  const [temples, setTemples] = useState<Temple[]>([])
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [visitedTemples, setVisitedTemples] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getCities = (temples: Temple[]) => {
    const cities = new Set<string>()
    temples.forEach((temple) => {
      const city = temple.location.split(",").pop()?.trim() || temple.location
      cities.add(city)
    })
    return Array.from(cities).sort()
  }

  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    const loadTempleData = async () => {
      const lang = i18n.language || "es"
      try {
        const templeData = await import(`@/data/temples.${lang}.json`)
        const countryTemples = country === "japan" ? templeData.japan : templeData.korea
        setTemples(countryTemples)
        setFilteredTemples(countryTemples)
        setCities(getCities(countryTemples))
        setSelectedCity("all")
      } catch (error) {
        console.error("Could not load temple data for language:", lang, error)
        // Fallback to Spanish
        const templeData = await import(`@/data/temples.es.json`)
        const countryTemples = country === "japan" ? templeData.japan : templeData.korea
        setTemples(countryTemples)
        setFilteredTemples(countryTemples)
        setCities(getCities(countryTemples))
        setSelectedCity("all")
      }
    }

    loadTempleData()

    // Load visited temples from local storage
    const storedVisited = localStorage.getItem(`visitedTemples_${country}`)
    if (storedVisited) {
      setVisitedTemples(new Set(JSON.parse(storedVisited)))
    }
  }, [country, i18n.language])

  useEffect(() => {
    let filtered = temples

    if (selectedCity !== "all") {
      filtered = filtered.filter((temple) => {
        const city = temple.location.split(",").pop()?.trim() || temple.location
        return city === selectedCity
      })
    }

    setFilteredTemples(filtered)
  }, [temples, selectedCity])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCity])

  const toggleVisitStatus = (templeId: string) => {
    const newVisited = new Set(visitedTemples)
    if (newVisited.has(templeId)) {
      newVisited.delete(templeId)
    } else {
      newVisited.add(templeId)
    }
    setVisitedTemples(newVisited)
    localStorage.setItem(`visitedTemples_${country}`, JSON.stringify(Array.from(newVisited)))
  }

  const totalPages = Math.ceil(filteredTemples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTemples = filteredTemples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      {isMounted &&
        createPortal(
          <TempleProgressCounter visitedCount={visitedTemples.size} totalCount={temples.length} />,
          document.body
        )}

      <div className="space-y-4">
        {/* City Filter Tabs - Mobile Optimized */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedCity === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCity("all")}
            className="whitespace-nowrap glass hover:glass-strong"
          >
            <MapPin className="w-4 h-4 mr-1" />
            {t("temple_grid_all_button")}
          </Button>
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity(city)}
              className="whitespace-nowrap glass hover:glass-strong"
            >
              {city}
            </Button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4">{/* Sort Dropdown */}</div>

        {/* Results Counter and Pagination Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {filteredTemples.length}{" "}
            {country === "japan" ? t("temple_grid_temples") : t("temple_grid_palaces")}
            {selectedCity !== "all" && ` ${t("temple_grid_in_city")} ${selectedCity}`}
          </div>
          {totalPages > 1 && (
            <div>
              {t("temple_grid_page_info", { currentPage, totalPages })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {paginatedTemples.map((temple, index) => (
            <motion.div
              key={temple.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="break-inside-avoid mb-6"
            >
              <TempleCard
                temple={temple}
                index={index}
                isVisited={visitedTemples.has(temple.id)}
                onToggleVisit={toggleVisitStatus}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="glass hover:glass-strong"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t("temple_grid_previous_button")}
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0 glass hover:glass-strong"
                  >
                    {page}
                  </Button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="glass hover:glass-strong"
          >
            {t("temple_grid_next_button")}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* No results */}
      {filteredTemples.length === 0 && selectedCity !== "all" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="glass rounded-2xl p-8 max-w-md mx-auto">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("temple_grid_no_results_title")}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t("temple_grid_no_results_subtitle", {
                category: country === "japan" ? t("temple_grid_temples") : t("temple_grid_palaces"),
                city: selectedCity,
              })}
            </p>
            <Button
              onClick={() => setSelectedCity("all")}
              variant="outline"
              size="sm"
              className="glass hover:glass-strong"
            >
              {t("temple_grid_view_all_button")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
