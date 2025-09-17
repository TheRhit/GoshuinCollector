# Dockerfile para la aplicación Next.js (Corregido)

# --- Etapa Base ---
# Instala pnpm y establece el entorno base.
FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# --- Etapa de Compilación (Builder) ---
# Instala TODAS las dependencias (incluyendo devDependencies) y compila la aplicación.
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- Etapa de Ejecución (Runner) ---
# Crea la imagen final y ligera para producción.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Crear un usuario y grupo no root para mayor seguridad.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar los artefactos de compilación y los archivos de manifiesto desde la etapa 'builder'.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instalar solo las dependencias de producción para mantener la imagen final pequeña.
RUN pnpm install --frozen-lockfile --prod

# Cambiar al usuario no root.
USER nextjs

# Exponer el puerto en el que se ejecuta la aplicación.
EXPOSE 3000

# Comando para iniciar la aplicación.
CMD ["pnpm", "start"]
