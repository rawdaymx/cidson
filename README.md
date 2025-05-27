## Despliegue

Para preparar los archivos para despliegue:

1. Asegúrate de estar en la raíz del proyecto
2. Ejecuta el script de preparación:
   ```bash
   ./scripts/prepare-deploy.sh
   ```
3. Los archivos compilados se copiarán automáticamente a la carpeta `deploy/dist/`
4. Haz commit y push de la carpeta `deploy/` al repositorio de despliegue

### Notas de despliegue

- Los archivos fuente permanecen seguros y no se comparten
- Solo se proporcionan los archivos compilados necesarios
- La carpeta `deploy/` contiene todo lo necesario para que el equipo de despliegue pueda ejecutar la aplicación
