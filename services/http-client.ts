import { getAuthToken } from "@/config/api-config"

export class HttpClient {
  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    const token = getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    // Verificar si la respuesta es exitosa (código 2xx)
    if (!response.ok) {
      const contentType = response.headers.get("content-type") || ""

      // Leer el cuerpo de la respuesta una sola vez
      let responseBody: string
      try {
        responseBody = await response.text()
      } catch (e) {
        throw new Error(`Error HTTP: ${response.status}, ${response.statusText}`)
      }

      // Si la respuesta es HTML, extraer un mensaje más útil
      if (contentType.includes("text/html")) {
        console.error("Respuesta HTML recibida:", responseBody.substring(0, 200) + "...")
        throw new Error(`El servidor devolvió HTML en lugar de JSON. Código: ${response.status}`)
      }

      // Intentar parsear como JSON
      try {
        const errorData = JSON.parse(responseBody)
        const errorMessage = errorData.message || errorData.error || `Error HTTP: ${response.status}`
        throw new Error(errorMessage)
      } catch (e) {
        // Si no se puede parsear como JSON, usar el texto
        throw new Error(`Error HTTP: ${response.status}, ${responseBody || response.statusText}`)
      }
    }

    // Verificar si la respuesta está vacía
    const contentLength = response.headers.get("content-length")
    if (contentLength === "0") {
      return {} as T
    }

    // Verificar el tipo de contenido
    const contentType = response.headers.get("content-type") || ""

    // Leer el cuerpo de la respuesta una sola vez
    let responseBody: string
    try {
      responseBody = await response.text()
    } catch (e) {
      throw new Error("Error al leer la respuesta del servidor")
    }

    if (!contentType.includes("application/json")) {
      console.warn(`Respuesta no es JSON: ${contentType}`)

      // Si parece HTML, lanzar un error específico
      if (responseBody.trim().startsWith("<!DOCTYPE") || responseBody.trim().startsWith("<html")) {
        console.error("Respuesta HTML recibida:", responseBody.substring(0, 200) + "...")
        throw new Error("El servidor devolvió HTML en lugar de JSON")
      }

      // Intentar parsear como JSON de todos modos
      try {
        return JSON.parse(responseBody) as T
      } catch (e) {
        console.error("No se pudo parsear la respuesta como JSON:", responseBody.substring(0, 200) + "...")
        throw new Error("Respuesta no válida: no es JSON")
      }
    }

    // Parsear la respuesta como JSON
    try {
      return JSON.parse(responseBody) as T
    } catch (e) {
      console.error("Error al parsear JSON:", e)
      console.error("Contenido de la respuesta:", responseBody.substring(0, 200) + "...")
      throw new Error("Error al parsear la respuesta JSON")
    }
  }

  static async get<T>(url: string, params = {}): Promise<T> {
    try {
      // Asegurarse de que la URL sea absoluta
      const fullUrl = this.ensureAbsoluteUrl(url)

      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })

      const queryString = queryParams.toString()
      const requestUrl = queryString ? `${fullUrl}?${queryString}` : fullUrl

      console.log("GET:", requestUrl)
      console.log("Headers:", this.getHeaders())

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: this.getHeaders(),
        mode: "cors",
        credentials: "same-origin",
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      console.error(`Error en solicitud GET a ${url}:`, error)
      throw error
    }
  }

  static async post<T>(url: string, data: any): Promise<T> {
    try {
      // Asegurarse de que la URL sea absoluta
      const fullUrl = this.ensureAbsoluteUrl(url)

      console.log("POST:", fullUrl)
      console.log("Datos:", data)

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        mode: "cors",
        credentials: "same-origin",
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      console.error(`Error en solicitud POST a ${url}:`, error)
      throw error
    }
  }

  static async put<T>(url: string, data: any): Promise<T> {
    try {
      // Asegurarse de que la URL sea absoluta
      const fullUrl = this.ensureAbsoluteUrl(url)

      console.log("PUT:", fullUrl)
      console.log("Datos:", data)

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        mode: "cors",
        credentials: "same-origin",
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      console.error(`Error en solicitud PUT a ${url}:`, error)
      throw error
    }
  }

  static async delete<T = void>(url: string): Promise<T> {
    try {
      // Asegurarse de que la URL sea absoluta
      const fullUrl = this.ensureAbsoluteUrl(url)

      console.log("DELETE:", fullUrl)

      const response = await fetch(fullUrl, {
        method: "DELETE",
        headers: this.getHeaders(),
        mode: "cors",
        credentials: "same-origin",
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      console.error(`Error en solicitud DELETE a ${url}:`, error)
      throw error
    }
  }

  // Asegura que la URL sea absoluta
  private static ensureAbsoluteUrl(url: string): string {
    try {
      // Si la URL ya es absoluta, devolverla tal cual
      new URL(url)
      return url
    } catch (e) {
      // Si la URL es relativa, construir la URL absoluta
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cidson.int.qaenv.dev"

      // Eliminar barras diagonales duplicadas
      const cleanBaseUrl = baseUrl.replace(/\/+$/, "")
      const cleanPath = url.replace(/^\/+/, "")

      return `${cleanBaseUrl}/${cleanPath}`
    }
  }
}
