# 🏯 Goshuin Collector

### Itinerario de Templos: Japón & Corea del Sur

Una aplicación web futurista para explorar templos y palacios sagrados de Japón y Corea del Sur, diseñada para coleccionistas de Goshuin y entusiastas de la cultura asiática.

## ✨ Características Principales

- **Catálogo Extenso**: Explora un total de **47 sitios sagrados**, incluyendo **40 templos en Japón** y **7 palacios y templos en Corea del Sur**.
- **Diseño Inmersivo y Moderno**:
    - **UI Futurista**: Interfaz con efectos de **Glassmorphism**, transparencias y gradientes dinámicos.
    - **Animaciones Fluidas**: Experiencia de usuario mejorada con **Framer Motion**, incluyendo efectos parallax y animaciones al hacer scroll.
    - **Modo Oscuro/Claro**: Transiciones suaves para una cómoda visualización en cualquier momento del día.
- **Funcionalidades Avanzadas**:
    - **Mapa Interactivo**: Visualiza todos los templos en un mapa, con filtros por país para planificar tu ruta.
    - **Búsqueda y Filtros**: Encuentra templos fácilmente por nombre o país.
    - **Información Detallada**: Cada templo incluye horarios, costos, precio del Goshuin, estación de metro más cercana, tips culturales y ubicación en Google Maps.
- **Optimizado para Todos los Dispositivos**: Diseño **responsive** que asegura una experiencia de usuario consistente en móviles, tabletas y escritorio.

## 🚀 Stack Tecnológico

- **Framework**: **Next.js 14** (con App Router)
- **Lenguaje**: **TypeScript**
- **UI y Estilos**:
    - **Tailwind CSS v4**: Para un diseño rápido y personalizable.
    - **shadcn/ui**: Componentes de UI reutilizables y accesibles.
    - **Framer Motion**: Para animaciones fluidas y complejas.
    - **Lucide React**: Biblioteca de iconos open-source.
- **Visualización de Datos**:
    - **Recharts**: Para la creación de gráficos y estadísticas.
- **Package Manager**: **pnpm** (recomendado).

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- pnpm

### Configuración Local

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/TheRhit/goshuin-collector-web-app.git
cd goshuin-collector-web-app
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
pnpm install
\`\`\`

3. **Ejecutar en desarrollo**
\`\`\`bash
pnpm run dev
\`\`\`

4. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
.
├── app/                  # Rutas principales de la aplicación (App Router)
│   ├── page.tsx          # Página de inicio
│   └── layout.tsx        # Layout principal
├── components/           # Componentes de React
│   ├── ui/               # Componentes de shadcn/ui
│   ├── temple-grid.tsx   # Grid que muestra los templos
│   └── hero-section.tsx  # Sección principal de la página
├── data/
│   └── temples.json      # Datos de los templos y palacios (JSON)
├── lib/
│   └── utils.ts          # Funciones de utilidad
├── public/               # Recursos estáticos (imágenes, fuentes, etc.)
│   └── img/              # Imágenes de los templos
├── next.config.mjs       # Configuración de Next.js
└── package.json          # Dependencias y scripts
\`\`\`

## 🎯 Uso

### Navegación Principal
- **Hero Section**: Introducción con efectos glassmorphism
- **Explorar Templos**: Alternar entre Japón y Corea del Sur
- **Búsqueda**: Filtrar templos por nombre o ubicación
- **Mapa Interactivo**: Ver todos los templos en un mapa

### Información de Templos
Cada templo incluye:
- 📸 **Imagen ilustrativa**
- ⏰ **Horarios de apertura**
- 💰 **Costo de entrada**
- 🎫 **Precio del Goshuin**
- 🚇 **Estación más cercana**
- 💡 **Tip cultural**
- 🗺️ **Ubicación en Google Maps**

### Características Interactivas
- **Hover effects** en las tarjetas
- **Animaciones de scroll** al aparecer elementos
- **Transiciones suaves** entre secciones
- **Feedback visual** en todas las interacciones

## 🎨 Personalización

### Tokens de Color
Los colores están definidos en `app/globals.css`:
\`\`\`css
--primary: 180 100% 50%;      /* Cyan vibrante */
--secondary: 120 100% 50%;    /* Verde neón */
--accent: 240 100% 50%;       /* Azul eléctrico */
\`\`\`

### Animaciones
Las animaciones se configuran en los componentes individuales usando Framer Motion con:
- **Fade in** al hacer scroll
- **Hover effects** suaves
- **Parallax** en el hero
- **Microinteracciones** en botones

## 🌐 Datos de los Templos

La aplicación incluye una cuidada selección de **40 templos en Japón** y **7 palacios y templos en Corea del Sur**. La información detallada de cada sitio, incluyendo coordenadas, horarios, costos y tips culturales, se encuentra centralizada en el archivo `data/temples.json`.

Este enfoque permite una fácil actualización y mantenimiento de los datos sin necesidad de modificar el código fuente de los componentes.

## 🚀 Despliegue

### Vercel (Recomendado)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Otros Proveedores
\`\`\`bash
npm run build
npm start
\`\`\`

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- A la comunidad de **Next.js**, **Tailwind CSS** y **Framer Motion** por sus increíbles herramientas.
- A los creadores de **shadcn/ui** y **Lucide React** por sus componentes y iconos de alta calidad.
- A todos los templos y palacios de Japón y Corea del Sur por preservar su invaluable herencia cultural.

---

**Desarrollado con ❤️ para los amantes de la cultura asiática y coleccionistas de Goshuin**
