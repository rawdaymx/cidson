#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando preparación para despliegue...${NC}"

# Verificar que estamos en la raíz del proyecto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
    exit 1
fi

# Detectar el gestor de paquetes disponible
PACKAGE_MANAGER=""
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
else
    echo -e "${RED}❌ Error: No se encontró ningún gestor de paquetes (pnpm, yarn o npm)${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Usando $PACKAGE_MANAGER como gestor de paquetes${NC}"

# Crear carpeta dist si no existe
echo -e "${BLUE}📁 Creando estructura de carpetas...${NC}"
mkdir -p deploy/dist

# Limpiar carpeta dist
echo -e "${BLUE}🧹 Limpiando carpetas anteriores...${NC}"
rm -rf deploy/dist/*

# Instalar dependencias si node_modules no existe
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Instalando dependencias...${NC}"
    if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
        pnpm install
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
        yarn install
    else
        npm install
    fi
fi

# Construir la aplicación
echo -e "${BLUE}🛠️  Construyendo la aplicación...${NC}"
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm run build
elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn build
else
    npm run build
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: La construcción falló${NC}"
    exit 1
fi

# Copiar archivos necesarios
echo -e "${BLUE}📋 Copiando archivos compilados...${NC}"

# Copiar package.json y ajustar para producción
echo "📦 Preparando package.json para producción..."
cp package.json deploy/dist/
cp package-lock.json deploy/dist/ 2>/dev/null || true
cp pnpm-lock.yaml deploy/dist/ 2>/dev/null || true
cp yarn.lock deploy/dist/ 2>/dev/null || true

# Copiar archivos de Next.js
echo "📂 Copiando archivos de Next.js..."
cp -r .next deploy/dist/
cp -r public deploy/dist/ 2>/dev/null || true

# Verificar archivos críticos
if [ ! -d "deploy/dist/.next" ]; then
    echo -e "${RED}❌ Error: No se encontró la carpeta .next en dist${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Preparación completada con éxito!${NC}"
echo -e "${BLUE}📝 Los archivos están listos en la carpeta deploy/dist/${NC}"
echo -e "${BLUE}💡 Ahora puedes proceder con el build de Docker:${NC}"
echo -e "${YELLOW}   cd deploy && docker build -t cidson-app .${NC}" 