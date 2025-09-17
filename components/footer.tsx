import { Button } from "@/components/ui/button"
import { Heart, Github, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="glass-strong border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Goshuin Collector</h3>
            <p className="text-muted-foreground text-pretty">
              Tu guía digital para explorar la espiritualidad y cultura de Asia Oriental.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Explorar</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground">
                Templos de Japón
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground">
                Palacios de Corea
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground">
                Guía de Goshuin
              </Button>
            </div>
          </div>

          {/* Social & CTA */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Conecta</h4>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="glass hover:glass-strong">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass hover:glass-strong">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass hover:glass-strong">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Empieza tu Colección de Goshuin
            </Button>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Itinerario de Templos. Creado con <Heart className="inline w-4 h-4 text-red-500" /> para la cultura
            asiática.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Diseñado para preservar y compartir tradiciones milenarias.
          </p>
        </div>
      </div>
    </footer>
  )
}
