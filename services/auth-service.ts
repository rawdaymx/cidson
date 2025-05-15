import { API } from "@/config/api-config"
import { setCookie, deleteCookie, getCookie } from "cookies-next"

// Interfaces para tipar las respuestas y solicitudes
interface LoginRequest {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  success: boolean
  error?: string
}

export class AuthService {
  /**
   * Realiza la autenticación del usuario contra la API
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Objeto con el token y estado de la operación
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Construimos la URL completa para el login
      const url = `${API.BASE_URL}${API.ENDPOINTS.LOGIN}`

      // Log para depuración
      console.log(`Intentando login en: ${url}`)

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer 123", // Token inicial requerido por la API
        },
        body: JSON.stringify({ email, password }),
      }

      // Realizamos la solicitud directamente con la URL y las opciones
      const response = await fetch(url, options)

      // Log para depuración
      console.log(`Respuesta del servidor: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        // Manejar diferentes códigos de estado con mensajes en español
        if (response.status === 401) {
          return {
            token: "",
            success: false,
            error: "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.",
          }
        } else if (response.status === 429) {
          return {
            token: "",
            success: false,
            error: "Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.",
          }
        } else if (response.status === 404) {
          return {
            token: "",
            success: false,
            error: `No se pudo conectar con el servidor de autenticación (${url}). Por favor, contacta al administrador.`,
          }
        } else {
          return {
            token: "",
            success: false,
            error: `Error al iniciar sesión (${response.status}). Por favor, intenta de nuevo más tarde.`,
          }
        }
      }

      // La API devuelve directamente el token como string
      const token = await response.text()

      // Guardar el token en una cookie para usarlo en futuras peticiones
      // La cookie estará disponible tanto en el cliente como en el servidor
      setCookie("auth_token", token, {
        maxAge: 30 * 24 * 60 * 60, // 30 días
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      // También lo guardamos en localStorage para acceso fácil desde el cliente
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
      }

      return {
        token,
        success: true,
      }
    } catch (error) {
      console.error("Error en el servicio de autenticación:", error)
      return {
        token: "",
        success: false,
        error: "Error de conexión con el servidor. Por favor, verifica tu conexión a internet.",
      }
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si hay un token almacenado
   */
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!this.getToken()
  }

  /**
   * Obtiene el token de autenticación
   * @returns El token almacenado o una cadena vacía
   */
  static getToken(): string {
    // Intentar obtener token de localStorage primero
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("auth_token")
      if (localToken) return localToken
    }

    // Si no hay token en localStorage, intentar obtenerlo de cookies
    const cookieToken = getCookie("auth_token")
    return cookieToken?.toString() || ""
  }

  /**
   * Cierra la sesión del usuario
   */
  static logout(): void {
    if (typeof window === "undefined") return

    // Eliminar el token de localStorage
    localStorage.removeItem("auth_token")

    // Eliminar la cookie
    deleteCookie("auth_token", { path: "/" })

    // No hacemos la redirección aquí para mantener la separación de responsabilidades
    // La redirección se maneja en el componente que llama a este método
  }
}
