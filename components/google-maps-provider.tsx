"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: string | null
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
})

export const useGoogleMaps = () => useContext(GoogleMapsContext)

let isGoogleMapsLoaded = false
let isGoogleMapsLoading = false
let loadPromise: Promise<void> | null = null

const loadGoogleMapsScript = (): Promise<void> => {
  if (loadPromise) {
    return loadPromise
  }

  if (isGoogleMapsLoaded) {
    return Promise.resolve()
  }

  if (isGoogleMapsLoading) {
    loadPromise = new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (isGoogleMapsLoaded) {
          resolve()
        } else if (!isGoogleMapsLoading) {
          reject(new Error("Failed to load Google Maps"))
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
    })
    return loadPromise
  }

  isGoogleMapsLoading = true

  loadPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      isGoogleMapsLoaded = true
      isGoogleMapsLoading = false
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDg5NnweduasQ0F4pTMZqh09PG0yGpSzjQ&libraries=marker`
    script.async = true
    script.defer = true

    script.onload = () => {
      isGoogleMapsLoaded = true
      isGoogleMapsLoading = false
      resolve()
    }

    script.onerror = () => {
      isGoogleMapsLoading = false
      reject(new Error("Failed to load Google Maps API"))
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

interface GoogleMapsProviderProps {
  children: ReactNode
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsLoaded)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (isGoogleMapsLoaded) {
      setIsLoaded(true)
      return
    }

    loadGoogleMapsScript()
      .then(() => {
        setIsLoaded(true)
        setLoadError(null)
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error)
        setLoadError(error.message)
      })
  }, [])

  return <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>{children}</GoogleMapsContext.Provider>
}
