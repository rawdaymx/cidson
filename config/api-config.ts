/**
 * Determina la URL base de la API según el entorno actual
 */
export const getBaseUrl = (): string => {
  const env = process.env.NEXT_PUBLIC_ENV || "development";

  switch (env) {
    case "production":
      return (
        process.env.NEXT_PUBLIC_API_URL_PRODUCTION ||
        "https://cidson.api.production.com"
      );
    case "test":
      return (
        process.env.NEXT_PUBLIC_API_URL_TEST || "https://cidson.int.qaenv.dev"
      );
    case "development":
    default:
      // En desarrollo, usamos la URL de pruebas por defecto si no hay una URL específica configurada
      return (
        process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT ||
        "https://cidson.int.qaenv.dev"
      );
  }
};

/**
 * Obtiene la URL base de la API
 */
export const getApiUrl = (): string => {
  // Aseguramos que la URL base termine sin barra diagonal
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  return baseUrl;
};

/**
 * Obtiene el token de autenticación
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    // Primero intentar obtener el token del localStorage
    const token = localStorage.getItem("auth_token");
    if (token) return token;

    // Si no hay token en localStorage, intentar obtenerlo de sessionStorage
    const sessionToken = sessionStorage.getItem("auth_token");
    if (sessionToken) return sessionToken;
  }
  return null;
}

/**
 * Guarda el token de autenticación
 */
export function setAuthToken(token: string, rememberMe: boolean = false): void {
  if (typeof window !== "undefined") {
    if (rememberMe) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }
  }
}

/**
 * Elimina el token de autenticación
 */
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }
}

/**
 * Verifica si hay un token de autenticación
 */
export function hasAuthToken(): boolean {
  if (typeof window !== "undefined") {
    return !!(
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  }
  return false;
}

/**
 * Configuración de la API
 */
export const API = {
  /**
   * URL base de la API
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://cidson.int.qaenv.dev",

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
};
