/**
 * Determina la URL base de la API según el entorno actual
 */
const getBaseUrl = (): string => {
  const env = process.env.NEXT_PUBLIC_ENV || "development"

  switch (env) {
    case "production":
      return process.env.NEXT_PUBLIC_API_URL_PRODUCTION || "https://cidson.api.production.com"
    case "test":
      return process.env.NEXT_PUBLIC_API_URL_TEST || "https://cidson.int.qaenv.dev"
    case "development":
    default:
      // En desarrollo, usamos la URL de pruebas por defecto si no hay una URL específica configurada
      return process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT || "https://cidson.int.qaenv.dev"
  }
}

/**
 * Configuración de la API
 */
export const API = {
  /**
   * URL base de la API
   */
  BASE_URL: getBaseUrl(),

  /**
   * Endpoints de la API
   */
  ENDPOINTS: {
    /**
     * Endpoint de login
     */
    LOGIN: "/api/login",

    /**
     * Endpoint de empresas
     */
    EMPRESAS: "/api/empresas",

    /**
     * Endpoint de actividades
     */
    ACTIVIDADES: "/api/actividades",

    /**
     * Endpoint de zonas
     */
    ZONAS: "/api/zonas",

    /**
     * Endpoint de áreas
     */
    AREAS: "/api/areas",

    /**
     * Endpoint de métodos
     */
    METODOS: "/api/metodos",

    /**
     * Endpoint de materiales
     */
    MATERIALES: "/api/materiales",

    /**
     * Endpoint de motivos
     */
    MOTIVOS: "/api/motivos",

    /**
     * Endpoint de checklists
     */
    CHECKLISTS: "/api/checklists",
  },
}
