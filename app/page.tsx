import { HeroSection } from "@/components/hero-section"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { TempleSection } from "@/components/temple-section"
import { InteractiveMap } from "@/components/interactive-map"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { BackToTop } from "@/components/back-to-top"
import { ErrorBoundary } from "@/components/error-boundary"
import { AccessibilityImprovements } from "@/components/accessibility-improvements"
import { GlobalSakuraBackground } from "@/components/global-sakura-background"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <AccessibilityImprovements />
      <GlobalSakuraBackground />
      <main id="main-content" className="min-h-screen relative z-10">
        <EnhancedNavigation />
        <HeroSection />
        <TempleSection />
        <div id="interactive-map">
          <InteractiveMap />
        </div>
        <EnhancedFooter />
        <BackToTop />
      </main>
    </ErrorBoundary>
  )
}
