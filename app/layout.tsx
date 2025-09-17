import type React from "react"
import type { Metadata } from "next"
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleMapsProvider } from "@/components/google-maps-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { LanguageUpdater } from "@/components/language-updater"
import { Suspense } from "react"
import "./globals.css"

const kouzan = localFont({
  src: "../public/fonts/KouzanGyoushoOTF.otf",
  variable: "--font-kouzan",
})

const notoSansJP = localFont({
  src: "../public/fonts/NotoSansJP-Variable.ttf",
  variable: "--font-noto-sans-jp",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Goshuin Collector",
  description: "Explora templos y palacios sagrados. Colecciona Goshuin en una experiencia digital inmersiva.",
  generator: "v0.app",
  keywords: ["templos", "japón", "corea del sur", "goshuin", "itinerario", "viaje"],
  openGraph: {
    title: "Goshuin Collector",
    description: "Explora templos y palacios sagrados. Colecciona Goshuin en una experiencia digital inmersiva.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${kouzan.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <I18nProvider>
            <LanguageUpdater />
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
              <GoogleMapsProvider>{children}</GoogleMapsProvider>
            </ThemeProvider>
            <Analytics />
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  )
}
