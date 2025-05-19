import { API } from "@/config/api-config"

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

export class HttpClient {
  /**
   * Realiza una petición HTTP a la API
   * @param endpoint Endpoint de la API
   * @param options Opciones de la petición
   * @returns Respuesta de la API
   */
  static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API.BASE_URL}${endpoint}`
    console.log("Realizando petición a:", url)

    // Configuración por defecto
    const defaultOptions: RequestOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      requiresAuth: true,
    }

    // Combinar opciones
    const mergedOptions: RequestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    }

    // Agregar token de autenticación si es necesario
    if (mergedOptions.requiresAuth) {
      // Usar el token hardcodeado para pruebas
      const token = "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad"
      mergedOptions.headers = {
        ...mergedOptions.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      console.log("Opciones de la petición:", mergedOptions)
      // Realizamos la solicitud directamente con la URL y las opciones
      const response = await fetch(url, mergedOptions)

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        // Si el error es 401 (No autorizado), cerrar sesión
        if (response.status === 401) {
          console.error("Error de autenticación (401)")
          // AuthService.logout()
          // window.location.href = "/login"
        }

        // Intentar obtener el mensaje de error
        let errorMessage = `Error en la petición: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // Si no se puede parsear como JSON, usar el statusText
          errorMessage = response.statusText || errorMessage
        }

        throw new Error(errorMessage)
      }

      // Verificar si la respuesta es JSON o texto
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const jsonResponse = await response.json()
        console.log("Respuesta JSON:", jsonResponse)
        return jsonResponse
      } else {
        const text = await response.text()
        console.log("Respuesta texto:", text)
        try {
          // Intentar parsear como JSON por si acaso
          return JSON.parse(text)
        } catch {
          // Si no es JSON, devolver el texto
          return text as unknown as T
        }
      }
    } catch (error) {
      console.error("Error en la petición HTTP:", error)
      throw error
    }
  }

  /**
   * Realiza una petición GET
   * @param endpoint Endpoint de la API
   * @param options Opciones de la petición
   * @returns Respuesta de la API
   */
  static async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  /**
   * Realiza una petición POST
   * @param endpoint Endpoint de la API
   * @param data Datos a enviar
   * @param options Opciones de la petición
   * @returns Respuesta de la API
   */
  static async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * Realiza una petición PUT
   * @param endpoint Endpoint de la API
   * @param data Datos a enviar
   * @param options Opciones de la petición
   * @returns Respuesta de la API
   */
  static async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  /**
   * Realiza una petición DELETE
   * @param endpoint Endpoint de la API
   * @param options Opciones de la petición
   * @returns Respuesta de la API
   */
  static async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

// Exportamos una instancia del cliente HTTP para usar en los servicios
export const httpClient = HttpClient
