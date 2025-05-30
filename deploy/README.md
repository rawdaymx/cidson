# Instrucciones de Despliegue

Este repositorio contiene los archivos necesarios para desplegar la aplicación en producción.

## 1. Estructura del Proyecto

```
deploy/
├── Dockerfile           # Configuración para construir la imagen Docker
├── .dockerignore       # Archivos a ignorar en el build de Docker
├── .gitignore         # Archivos a ignorar en git
├── README.md          # Este archivo
└── dist/              # Archivos compilados (generados automáticamente)
    ├── .next/         # Archivos de Next.js compilados
    ├── public/        # Archivos estáticos
    └── package.json   # Dependencias y scripts
```

## 2. Variables de Entorno

### Variables Requeridas

Asegúrese de configurar las siguientes variables en su archivo `.env`:

1. `NEXT_PUBLIC_ENV`: Define el ambiente de ejecución. Valores posibles:

   - `production`: Para ambiente de producción
   - `test`: Para ambiente de pruebas
   - `development`: Para ambiente de desarrollo

2. URL de la API según el ambiente:
   - Para producción: `NEXT_PUBLIC_API_URL_PRODUCTION`
   - Para pruebas: `NEXT_PUBLIC_API_URL_TEST`
   - Para desarrollo: `NEXT_PUBLIC_API_URL_DEVELOPMENT`

> **Nota**: Solo necesitas configurar la URL que corresponda al ambiente seleccionado en `NEXT_PUBLIC_ENV`.
> Por ejemplo, si `NEXT_PUBLIC_ENV=production`, solo necesitas configurar `NEXT_PUBLIC_API_URL_PRODUCTION`.

### Configuración

1. Crear archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Editar el archivo `.env` con los valores correctos para tu ambiente

## 3. Requisitos Previos

- Docker instalado y funcionando
- Git para control de versiones
- Variables de entorno configuradas (ver sección 2)

## 4. Proceso de Despliegue Inicial

1. Clonar este repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DE_LA_CARPETA>
   ```

2. Construir la imagen Docker:

   ```bash
   docker build -t cidson-app .
   ```

3. Ejecutar el contenedor:
   ```bash
   docker run -p 3000:3000 --env-file .env cidson-app
   ```

## 5. Proceso de Actualización

Cuando se libere una nueva versión, siga estos pasos:

1. Actualizar los archivos:

   ```bash
   git pull
   ```

2. Reconstruir la imagen Docker:

   ```bash
   docker build -t cidson-app .
   ```

3. Detener el contenedor anterior (si está ejecutándose):

   ```bash
   docker stop $(docker ps -q --filter ancestor=cidson-app)
   ```

4. Iniciar el nuevo contenedor:
   ```bash
   docker run -p 3000:3000 --env-file .env cidson-app
   ```

## 6. Notas Importantes

- La aplicación se ejecuta en el puerto 3000 por defecto
- Los archivos en `dist/` son generados automáticamente y no deben modificarse manualmente
- Asegúrese de que todas las variables de entorno estén correctamente configuradas antes de iniciar el contenedor
- Este repositorio contiene solo los archivos compilados necesarios para el despliegue
- El código fuente se mantiene en un repositorio separado y privado

## 7. Soporte

Para actualizaciones o soporte, contacte al equipo de desarrollo.
