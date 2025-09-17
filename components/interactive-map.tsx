"use client"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Layers, AlertCircle } from "lucide-react"
import { SakuraPetals } from "@/components/sakura-petals"
import { useGoogleMaps } from "@/components/google-maps-provider"

interface Temple {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  entryCost: string
  goshuinCost: string
}

export function InteractiveMap() {
  const { t, i18n } = useTranslation()
  const [selectedCountry, setSelectedCountry] = useState<"japan" | "korea" | "all">("all")
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 36.2048, lng: 138.2529 })
  const [templeData, setTempleData] = useState<{ japan: Temple[]; korea: Temple[] }>({ japan: [], korea: [] })

  const { isLoaded: isScriptLoaded, loadError } = useGoogleMaps()

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any | null>(null)
  const markers = useRef<{ [key: string]: any }>({})
  const activeInfoWindow = useRef<any | null>(null)

  useEffect(() => {
    const loadTempleData = async () => {
      const lang = i18n.language || "es"
      try {
        const data = await import(`@/data/temples.${lang}.json`)
        setTempleData(data)
      } catch (error) {
        console.error("Could not load temple data for language:", lang, error)
        // Fallback to Spanish
        const data = await import(`@/data/temples.es.json`)
        setTempleData(data)
      }
    }

    loadTempleData()
  }, [i18n.language])

  const allTemples = templeData ? [...templeData.japan, ...templeData.korea] : []
  const filteredTemples =
    selectedCountry === "all"
      ? allTemples
      : selectedCountry === "japan"
      ? templeData.japan
      : templeData.korea

  useEffect(() => {
    if (selectedCountry === "japan") {
      setMapCenter({ lat: 36.2048, lng: 138.2529 })
    } else if (selectedCountry === "korea") {
      setMapCenter({ lat: 37.5665, lng: 126.978 })
    } else {
      setMapCenter({ lat: 36.2048, lng: 138.2529 })
    }
  }, [selectedCountry])

  const japaneseMapStyle = [
    {
      featureType: "water",
      stylers: [{ color: "#f0f8ff" }], // Agua azul muy suave
    },
    {
      featureType: "landscape",
      stylers: [{ color: "#faf7f2" }], // Fondo crema como papel washi
    },
    {
      featureType: "road",
      stylers: [{ color: "#f5f1eb" }], // Caminos en tono crema
    },
    {
      featureType: "road.highway",
      stylers: [{ color: "#e8ddd4" }], // Autopistas más oscuras
    },
    {
      featureType: "poi.park",
      stylers: [{ color: "#e8f5e8" }], // Parques en verde muy suave
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8b4513" }], // Texto de POI en marrón
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d4a574" }], // Texto administrativo en dorado suave
    },
  ]

  const initMap = () => {
    if (window.google && mapRef.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: selectedCountry === "all" ? 5 : 8,
        styles: japaneseMapStyle,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
      })
    }
  }

  useEffect(() => {
    if (isScriptLoaded) {
      initMap()
    }
  }, [isScriptLoaded])

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(mapCenter)
      mapInstance.current.setZoom(selectedCountry === "all" ? 5 : 8)
    }
  }, [mapCenter, selectedCountry])

  const createSakuraIcon = () => {
    return {
      url: "/img/cherry-map.webp",
      scaledSize: new window.google.maps.Size(32, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(16, 16),
    }
  }

  useEffect(() => {
    if (mapInstance.current) {
      // Clear existing markers
      Object.values(markers.current).forEach((marker) => marker.setMap(null))
      markers.current = {}

      // Add new markers
      filteredTemples.forEach((temple) => {
        const marker = new window.google.maps.Marker({
          position: temple.coordinates,
          map: mapInstance.current,
          title: temple.name,
          icon: createSakuraIcon(),
          animation: window.google.maps.Animation.DROP,
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="
              background: linear-gradient(135deg, oklch(0.98 0.01 30), oklch(0.95 0.01 30));
              border-radius: 12px;
              padding: 16px;
              border: 2px solid oklch(0.75 0.12 15);
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 280px;
            ">
              <div style="
                background: linear-gradient(45deg, oklch(0.75 0.12 15), oklch(0.8 0.08 60));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 8px;
                line-height: 1.3;
              ">${temple.name}</div>
              <div style="
                color: oklch(0.45 0.02 20);
                font-size: 14px;
                margin-bottom: 12px;
                line-height: 1.4;
              ">${temple.location}</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span style="
                  background: oklch(0.75 0.12 15 / 0.1);
                  color: oklch(0.45 0.08 25);
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 12px;
                  border: 1px solid oklch(0.75 0.12 15 / 0.3);
                ">${temple.entryCost}</span>
                ${
                  temple.goshuinCost !== t("map_goshuin_not_applicable")
                    ? `
                <span style="
                  background: oklch(0.45 0.08 25 / 0.1);
                  color: oklch(0.75 0.12 15);
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 12px;
                  border: 1px solid oklch(0.45 0.08 25 / 0.3);
                ">${temple.goshuinCost}</span>
                `
                    : ""
                }
              </div>
            </div>
          `,
        })

        marker.addListener("click", () => {
          activeInfoWindow.current?.close()
          infoWindow.open(mapInstance.current, marker)
          activeInfoWindow.current = infoWindow
          setSelectedTemple(temple)
        })

        markers.current[temple.id] = marker
      })
    }
  }, [filteredTemples, mapInstance.current])

  const handleTempleSelect = (temple: Temple) => {
    setSelectedTemple(temple)
    if (mapInstance.current && markers.current[temple.id]) {
      const marker = markers.current[temple.id]
      mapInstance.current.panTo(temple.coordinates)
      // Trigger click to open info window
      new window.google.maps.event.trigger(marker, "click")
    }
  }

  const openInGoogleMaps = (temple: Temple) => {
    if (typeof window === "undefined") return

    const url = `https://www.google.com/maps/search/?api=1&query=${temple.coordinates.lat},${temple.coordinates.lng}`
    window.open(url, "_blank")
  }

  const getDirections = (temple: Temple) => {
    if (typeof window === "undefined") return

    const url = `https://www.google.com/maps/dir/?api=1&destination=${temple.coordinates.lat},${temple.coordinates.lng}`
    window.open(url, "_blank")
  }

  if (loadError) {
    return (
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <SakuraPetals density="light" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">{t("map_interactive_map_title")}</span>
            </h2>
          </div>
          <Card className="glass border border-border/30 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("map_error_title")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("map_error_subtitle")}
            </p>
            <p className="text-sm text-muted-foreground">{t("map_error_message", { error: loadError })}</p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <SakuraPetals density="light" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{t("map_interactive_map_title")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t("map_interactive_map_subtitle")}
          </p>
        </div>

        {/* Controls */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedCountry === "all" ? "default" : "outline"}
                onClick={() => setSelectedCountry("all")}
                className={selectedCountry === "all" ? "" : "glass hover:glass-strong bg-transparent"}
              >
                <Layers className="w-4 h-4 mr-2" />
                {t("map_all_button")}
              </Button>
              <Button
                variant={selectedCountry === "japan" ? "default" : "outline"}
                onClick={() => setSelectedCountry("japan")}
                className={`flex items-center gap-x-2 ${selectedCountry === "japan" ? "" : "glass hover:glass-strong bg-transparent"}`}
              >
                <img src="/flag-jp.svg" alt={t("map_japan_flag_alt")} className="w-5 h-auto" />
                {t("map_japan_button")}
              </Button>
              <Button
                variant={selectedCountry === "korea" ? "default" : "outline"}
                onClick={() => setSelectedCountry("korea")}
                className={`flex items-center gap-x-2 ${selectedCountry === "korea" ? "" : "glass hover:glass-strong bg-transparent"}`}
              >
                <img src="/flag-kr.svg" alt={t("map_korea_flag_alt")} className="w-5 h-auto" />
                {t("map_korea_button")}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">{t("map_showing_locations", { count: filteredTemples.length })}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="glass border border-border/30 overflow-hidden p-0">
              <CardContent className="p-0">
                {!isScriptLoaded ? (
                  <div className="h-96 lg:h-[600px] flex items-center justify-center bg-muted/20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">{t("map_loading")}</p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="relative h-96 lg:h-[600px]" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Temple List */}
          <div className="space-y-4">
            <Card className="glass border border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {t("map_locations_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTemples.map((temple) => (
                  <div
                    key={temple.id}
                    className={`glass rounded-lg p-3 cursor-pointer transition-all duration-300 hover:glass-strong ${
                      selectedTemple?.id === temple.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleTempleSelect(temple)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-balance leading-tight">{temple.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{temple.location}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {temple.entryCost}
                          </Badge>
                          {temple.goshuinCost !== t("map_goshuin_not_applicable") && (
                            <Badge variant="outline" className="text-xs">
                              {temple.goshuinCost}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          openInGoogleMaps(temple)
                        }}
                        className="ml-2 flex-shrink-0"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Selected Temple Details */}
            {selectedTemple && (
              <Card className="glass border border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedTemple.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("map_selected_temple_location")}</p>
                    <p className="text-sm font-medium">{selectedTemple.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t("map_selected_temple_entry")}</p>
                      <Badge variant="outline" className="text-xs">
                        {selectedTemple.entryCost}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t("map_selected_temple_goshuin")}</p>
                      <Badge variant="outline" className="text-xs">
                        {selectedTemple.goshuinCost}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => openInGoogleMaps(selectedTemple)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {t("map_view_in_maps_button")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(selectedTemple)}
                      className="flex-1 glass hover:glass-strong bg-transparent"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {t("map_directions_button")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Statistics */}
        {templeData.japan.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <Card className="glass border border-border/30 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-2">{templeData.japan.length}</div>
                <div className="text-sm text-muted-foreground">{t("map_stat_temples_japan")}</div>
              </CardContent>
            </Card>
            <Card className="glass border border-border/30 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-secondary mb-2">{templeData.korea.length}</div>
                <div className="text-sm text-muted-foreground">{t("map_stat_palaces_korea")}</div>
              </CardContent>
            </Card>
          <Card className="glass border border-border/30 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-accent mb-2">4</div>
              <div className="text-sm text-muted-foreground">{t("map_stat_main_cities")}</div>
            </CardContent>
          </Card>
          <Card className="glass border border-border/30 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {allTemples.length}
              </div>
              <div className="text-sm text-muted-foreground">{t("map_stat_total_sites")}</div>
            </CardContent>
          </Card>
        </div>
        )}
      </div>
    </section>
  )
}
