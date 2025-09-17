"use client"
import { useState, useMemo, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Train, Lightbulb, MapPin, ExternalLink, Calendar, Coins, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SakuraPetals } from "@/components/sakura-petals"
import { useGoogleMaps } from "@/components/google-maps-provider"

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

interface TempleCardProps {
  temple: Temple
  index: number
  isVisited: boolean
  onToggleVisit: (templeId: string) => void
}

const GOSHUIN_KANJI = [
  {
    name: "参拝印",
    paths: [
      "M-25 -15 L25 -15 M-25 -10 L25 -10 M0 -20 L0 10 M-15 -5 L15 -5 M-20 5 L20 5 M-10 -15 L-10 -5 M10 -15 L10 -5",
      "M-30 -10 L30 -10 M-20 -20 L-20 20 M20 -20 L20 20 M-10 -5 L10 -5 M-10 5 L10 5 M-10 15 L10 15 M-25 0 L-15 0 M15 0 L25 0",
      "M-20 -15 L20 -15 M0 -20 L0 20 M-15 -5 L15 -5 M-15 5 L15 5 M-15 15 L15 15 M-25 -10 L-15 -10 M15 -10 L25 -10",
    ],
  },
  {
    name: "御朱印",
    paths: [
      "M-20 -15 Q-15 -18 -10 -15 Q-5 -12 0 -15 Q5 -18 10 -15 Q15 -12 20 -15 M-10 -20 L-10 20 M10 -20 L10 20 M-15 0 Q0 -3 15 0",
      "M-25 -10 L25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 L20 0 M-10 10 L10 10 M-8 -12 L8 -12 M-8 8 L8 8 M-12 2 L12 2",
      "M-12 -8 L12 -8 M0 -12 L0 12 M-8 -2 L8 -2 M-8 2 L8 2",
    ],
  },
  {
    name: "神社印",
    paths: [
      "M-20 -15 Q-10 -18 0 -15 Q10 -18 20 -15 M-10 -20 L-10 20 M10 -10 L10 20 M-15 0 Q0 -2 15 0 M0 5 Q10 3 20 5",
      "M-25 -10 L25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 L20 0 M-10 10 L10 10 M-22 -5 L-18 -5 M18 -5 L22 -5 M-5 -8 L5 -8",
      "M-10 -6 L10 -6 M0 -10 L0 10 M-6 0 L6 0",
    ],
  },
  {
    name: "寺院印",
    paths: [
      "M-25 -15 L20 -15 M-10 -20 L-10 20 M10 -15 L10 15 M-15 -5 L15 -5 M-10 15 L10 15 M-25 -8 L-20 -8 M20 -8 L25 -8 M-8 -12 L8 -12",
      "M-25 -10 L25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 Q0 -2 20 0 M0 10 L20 10 M-30 -5 L-25 -5 M25 -5 L30 -5 M-10 5 L-5 5 M5 5 L10 5",
      "M-10 -6 L10 -6 M0 -10 L0 10 M-6 0 L6 0",
    ],
  },
  {
    name: "巡礼印",
    paths: [
      "M-25 -10 Q-15 -12 -5 -10 Q5 -8 15 -10 Q20 -12 25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 Q0 -2 20 0 M0 5 Q8 3 15 5",
      "M-20 -15 L20 -15 M-10 -15 L-10 15 M10 -15 L10 15 M-15 0 L15 0 M-25 -8 L-15 -8 M15 -8 L25 -8 M-5 8 L5 8",
      "M-8 -6 Q0 -8 8 -6 Q10 0 8 6 Q0 8 -8 6 Q-10 0 -8 -6 M0 -10 L0 10",
    ],
  },
  {
    name: "祈願印",
    paths: [
      "M-25 -15 L25 -15 M-10 -20 L-10 20 M10 -15 L10 15 M-15 -5 Q0 -7 15 -5 M0 5 Q10 3 20 5 M-25 -10 L-20 -10 M-5 10 L5 10",
      "M-25 -10 L25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 Q0 -2 20 0 M-5 10 Q5 8 15 10 M-30 -5 L-25 -5 M25 -5 L30 -5",
      "M-8 -4 Q-12 -8 -6 -10 Q0 -8 6 -10 Q12 -8 8 -4 Q4 0 0 8 Q-4 0 -8 -4",
    ],
  },
  {
    name: "霊場印",
    paths: [
      "M-25 -15 Q-20 -18 -15 -15 Q-10 -12 -5 -15 Q0 -18 5 -15 Q10 -12 15 -15 Q20 -18 25 -15 M-15 -20 L-15 20 M15 -20 L15 20 M-20 -5 Q0 -7 20 -5 M-10 5 Q0 3 10 5 M0 15 Q10 13 20 15",
      "M-20 -10 L20 -10 M-10 -15 L-10 15 M10 -15 L10 15 M-15 0 L15 0 M0 10 L15 10 M-25 -5 L-20 -5 M20 -5 L25 -5 M-5 5 L5 5",
      "M-10 -8 L0 -12 L10 -8 L8 8 L-8 8 Z M0 -6 L0 6",
    ],
  },
  {
    name: "功徳印",
    paths: [
      "M-25 -15 L25 -15 M-10 -20 L-10 20 M10 -15 L10 15 M-15 0 L15 0 M0 10 L15 10 M-25 -8 L-20 -8 M20 -8 L25 -8 M-5 -5 L5 -5 M-5 5 L5 5",
      "M-25 -10 L25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 Q0 -2 20 0 M-5 5 Q5 3 15 5 M0 15 Q5 13 10 15 M-30 -5 L-25 -5 M25 -5 L30 -5",
      "M-8 -6 Q-4 -8 0 -6 Q4 -8 8 -6 Q6 -2 4 2 Q2 6 0 4 Q-2 6 -4 2 Q-6 -2 -8 -6 M0 -4 L0 2",
    ],
  },
  {
    name: "満願印",
    paths: [
      "M-25 -15 Q-20 -17 -15 -15 Q-10 -13 -5 -15 Q0 -17 5 -15 Q10 -13 15 -15 Q20 -17 25 -15 M-15 -20 L-15 20 M15 -20 L15 20 M-20 -5 Q0 -7 20 -5 M-10 5 Q0 3 10 5 M-5 15 Q5 13 15 15",
      "M-25 -10 L25 -10 M-15 -15 L-15 15 M15 -15 L15 15 M-20 0 Q0 -2 20 0 M-5 10 Q5 8 15 10 M-30 -5 L-25 -5 M25 -5 L30 -5 M-12 12 L12 12",
      "M0 -10 L0 10 M-7 -7 L7 7 M-7 7 L7 -7 M-10 0 L10 0 M-8 -6 Q0 -8 8 -6 Q6 0 8 6 Q0 8 -8 6 Q-6 0 -8 -6",
    ],
  },
]

const japaneseMapStyle = [
  {
    featureType: "water",
    stylers: [{ color: "#f0f8ff" }],
  },
  {
    featureType: "landscape",
    stylers: [{ color: "#faf7f2" }],
  },
  {
    featureType: "road",
    stylers: [{ color: "#f5f1eb" }],
  },
  {
    featureType: "road.highway",
    stylers: [{ color: "#e8ddd4" }],
  },
  {
    featureType: "poi.park",
    stylers: [{ color: "#e8f5e8" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8b4513" }],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4a574" }],
  },
]

export function TempleCard({ temple, index, isVisited, onToggleVisit }: TempleCardProps) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const { isLoaded: isScriptLoaded, loadError } = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any | null>(null)

  const selectedKanji = useMemo(() => {
    const seed = temple.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return GOSHUIN_KANJI[seed % GOSHUIN_KANJI.length]
  }, [temple.id])

  const openGoogleMaps = () => {
    if (typeof window === "undefined") return

    const url = `https://www.google.com/maps/search/?api=1&query=${temple.coordinates.lat},${temple.coordinates.lng}`
    window.open(url, "_blank")
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const createSakuraIcon = () => {
    if (typeof window.google === "undefined") return null
    return {
      url: "/img/cherry-map.webp",
      scaledSize: new window.google.maps.Size(32, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(16, 16),
    }
  }

  useEffect(() => {
    if (showMap && isScriptLoaded && mapRef.current && !mapInstance.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: temple.coordinates,
        zoom: 16,
        styles: japaneseMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
      })
      mapInstance.current = map

      const icon = createSakuraIcon()
      if (icon) {
        new window.google.maps.Marker({
          position: temple.coordinates,
          map: map,
          title: temple.name,
          icon: icon,
          animation: window.google.maps.Animation.DROP,
        })
      }
    }
  }, [showMap, isScriptLoaded, temple.coordinates, temple.name])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.25, 0, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <SakuraPetals density="medium" className="z-0" />

      <Card
        className={cn(
          "glass hover:glass-strong transition-all duration-500 border border-border/30 overflow-hidden group h-full relative z-10 p-0",
          isVisited && "bg-accent/10 dark:bg-accent/10 border-accent/30",
        )}
      >
        <div className="relative overflow-hidden">
          <AnimatePresence>
            {isVisited && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: -15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  rotate: 15,
                  transition: { duration: 0.4 },
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 200,
                  duration: 1.2,
                }}
                className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 100,
                    delay: 0.2,
                  }}
                >
                  {/* Efecto de tinta expandiéndose */}
                  <motion.div
                    className="absolute inset-0 bg-red-600/20 rounded-full blur-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 2, 1.5] }}
                    transition={{ duration: 1.5, times: [0, 0.6, 1] }}
                    style={{ width: "240px", height: "240px", left: "-20px", top: "-20px" }}
                  />

                  {/* Sello principal */}
                  <div className="relative w-48 h-48 bg-gradient-to-br from-red-700 via-red-600 to-red-800 rounded-lg shadow-2xl border-4 border-red-900/50 flex items-center justify-center transform rotate-3">
                    {/* Textura del sello */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-transparent rounded-lg" />

                    {/* Kanji del sello */}
                    <svg
                      viewBox="-40 -25 80 50"
                      className="w-32 h-32 text-white drop-shadow-lg"
                      style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))" }}
                    >
                      {selectedKanji.paths.map((path, pathIndex) => (
                        <motion.path
                          key={pathIndex}
                          d={path}
                          stroke="currentColor"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.5 + pathIndex * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </svg>

                    {/* Brillo del sello */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-lg"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Partículas flotantes */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-red-500 rounded-full"
                      style={{
                        left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 60}%`,
                        top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 60}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.8, 0],
                        y: [0, -20, -40],
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.8 + i * 0.1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-48 overflow-hidden">
            <Image src={temple.image || "/placeholder.svg"} alt={temple.name} fill className="object-cover" />

            <div className="absolute top-3 right-3 z-20">
              <Badge variant="secondary" className="text-xs bg-primary/90 text-white border-primary/30 shadow-lg">
                {temple.location.split(",").pop()?.trim() || temple.location}
              </Badge>
            </div>

            <motion.div
              className="absolute bottom-4 left-4 right-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              style={{
                background: "rgba(219, 145, 159, 0.15)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <h3
                className="text-xl font-bold text-balance leading-tight"
                style={{
                  color: "rgb(255, 255, 255)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)",
                }}
              >
                {temple.name}
              </h3>
              <p
                className="text-sm mt-1"
                style={{
                  color: "rgb(255, 255, 255)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                }}
              >
                {temple.location}
              </p>
            </motion.div>
          </div>

          <CardContent className="p-6 space-y-4">
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">{t("temple_card_hours")}</span>
              </div>
              <div className="text-sm font-semibold text-foreground text-right">{temple.hours}</div>

              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span className="text-foreground font-medium">{t("temple_card_entry")}</span>
              </div>
              <div className="text-sm font-semibold text-foreground text-right">{temple.entryCost}</div>

              <div className="flex items-center space-x-2 text-sm">
                <Coins className="w-4 h-4 text-accent" />
                <span className="text-foreground font-medium">{t("temple_card_goshuin")}</span>
              </div>
              <div className="text-sm font-semibold text-foreground text-right">{temple.goshuinCost}</div>
            </motion.div>

            <motion.div
              className="bg-card/90 rounded-lg p-3 border border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-2">
                <Train className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-foreground/70 font-medium mb-1">{t("temple_card_nearest_station")}</p>
                  <p className="text-sm font-semibold text-foreground text-pretty">{temple.nearestStation}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-primary/20 rounded-lg p-3 border border-primary/30"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-foreground font-medium mb-1">{t("temple_card_cultural_tip")}</p>
                  <p className="text-sm text-foreground font-medium text-pretty leading-relaxed">
                    {temple.culturalTip}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex space-x-2 pt-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={toggleMap}
                  variant="outline"
                  size="sm"
                  className="w-full glass hover:glass-strong transition-all duration-300 bg-transparent hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {showMap ? t("temple_card_hide_map") : t("temple_card_show_location")}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={openGoogleMaps}
                  size="sm"
                  className="bg-primary hover:bg-accent text-primary-foreground transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("temple_card_open_maps")}
                </Button>
              </motion.div>
            </div>

            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 rounded-lg overflow-hidden glass border border-border/30"
                >
                  {isScriptLoaded && !loadError ? (
                    <div
                      ref={mapRef}
                      style={{ width: "100%", height: "200px" }}
                      className="rounded-lg"
                      data-testid="map-container"
                    />
                  ) : (
                    <div
                      style={{ width: "100%", height: "200px" }}
                      className="flex items-center justify-center bg-muted/20"
                    >
                      <p className="text-muted-foreground text-sm">
                        {loadError
                          ? t("temple_card_map_load_error")
                          : t("temple_card_map_loading")}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex items-center justify-between pt-2 border-t border-border/30 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              onClick={() => onToggleVisit(temple.id)}
            >
              <div className="flex items-center space-x-2">
                {isVisited ? (
                  <CheckCircle className="w-4 h-4 text-accent" />
                ) : (
                  <Calendar className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
                )}
                <span className="text-xs text-muted-foreground dark:text-slate-400">
                  {t("temple_card_visit_status")}
                </span>
              </div>
              <Badge
                variant={isVisited ? "default" : "outline"}
                className={cn("text-xs transition-colors", isVisited && "bg-accent text-accent-foreground")}
              >
                {isVisited ? t("temple_card_visited") : t("temple_card_pending")}
              </Badge>
            </motion.div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}
