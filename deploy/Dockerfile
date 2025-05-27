# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar package.json y package-lock.json
COPY dist/package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --production --legacy-peer-deps

# Copiar el resto de los archivos
COPY dist/ ./

# Exponer puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"] 