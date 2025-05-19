import type { Actividad, ActividadResponse } from "@/types/actividad"
import { API } from "@/config/api-config"

// Token fijo para pruebas (el proporcionado en el ejemplo)
const TOKEN_FIJO = "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad"

export class ActividadService {
  static async getAll(
    configuracionId: number,
    filters: { nombre?: string; estado?: number; page?: number } = {},
  ): Promise<ActividadResponse> {
    try {
      // Construir la URL exactamente como en el ejemplo
      let url = `${API.BASE_URL}/api/actividades/${configuracionId}`

      // Añadir parámetros de consulta si existen
      const queryParams = new URLSearchParams()

      if (filters.nombre) {
        queryParams.append("nombre", filters.nombre)
      }

      if (filters.estado !== undefined) {
        queryParams.append("estado", filters.estado.toString())
      }

      if (filters.page) {
        queryParams.append("page", filters.page.toString())
      }

      const queryString = queryParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }

      console.log("Fetching actividades from:", url)

      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN_FIJO}`,
        },
      }

      console.log("Request options:", JSON.stringify(options))

      const response = await fetch(url, options)

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Error al obtener actividades: ${response.status} - ${errorText}`)
      }

      const data: ActividadResponse = await response.json()
      console.log("Actividades recibidas:", JSON.stringify(data))
      return data
    } catch (error) {
      console.error("Error en ActividadService.getAll:", error)
      // Devolver una respuesta vacía en caso de error
      return {
        data: [],
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
        meta: {
          current_page: 1,
          from: 0,
          last_page: 1,
          links: [],
          path: "",
          per_page: 10,
          to: 0,
          total: 0,
        },
      }
    }
  }

  // Modificar el método getById para obtener la actividad del listado cuando falle el endpoint directo

  static async getById(id: number, configuracionId?: number): Promise<Actividad | undefined> {
    try {
      console.log(`Intentando obtener actividad con ID ${id} directamente...`)
      const response = await fetch(`${API.BASE_URL}/api/actividades/detalle/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN_FIJO}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.data
      }

      // Si hay un error 404, intentar obtener la actividad del listado
      console.log(`Error 404 al obtener actividad con ID ${id}, intentando obtener del listado...`)

      // Usar el configuracionId proporcionado o el valor por defecto
      const configId = configuracionId || 8 // Valor por defecto basado en el ejemplo de respuesta
      console.log(`Usando configuracionId: ${configId} para buscar la actividad en el listado`)

      const actividadesResponse = await this.getAll(configId)

      // Buscar la actividad con el ID especificado
      const actividad = actividadesResponse.data.find((act) => act.id === id)

      if (actividad) {
        console.log(`Actividad con ID ${id} encontrada en el listado:`, actividad)
        return actividad
      }

      console.error(`No se encontró la actividad con ID ${id} en el listado`)
      return undefined
    } catch (error) {
      console.error("Error en ActividadService.getById:", error)
      return undefined
    }
  }

  // En el método create, modificar el bloque catch para manejar específicamente el error de nombre duplicado
  static async create(configuracionId: number, nombre: string): Promise<Actividad | undefined> {
    try {
      console.log(`Creando actividad para configuración ${configuracionId} con nombre: ${nombre}`)

      const url = `${API.BASE_URL}/api/actividades/store/${configuracionId}`
      console.log("URL de creación:", url)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN_FIJO}`,
        },
        body: JSON.stringify({ nombre }),
      })

      console.log("Respuesta status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)

        // Verificar si es un error de nombre duplicado
        if (response.status === 422) {
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.errors?.nombre?.includes("The nombre has already been taken.")) {
              throw new Error("NOMBRE_DUPLICADO")
            }
          } catch (parseError) {
            // Si hay un error al parsear, continuar con el error original
          }
        }

        throw new Error(`Error al crear actividad: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Actividad creada:", data)
      return data.data
    } catch (error) {
      console.error("Error en ActividadService.create:", error)
      throw error // Re-lanzar el error para manejarlo en el componente
    }
  }

  static async update(id: number, actividad: Partial<Actividad>): Promise<Actividad | undefined> {
    try {
      console.log(`Actualizando actividad con ID ${id}:`, actividad)

      const url = `${API.BASE_URL}/api/actividades/update/${id}`
      console.log("URL de actualización:", url)

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN_FIJO}`,
        },
        body: JSON.stringify(actividad),
      })

      console.log("Respuesta status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Error al actualizar actividad: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Actividad actualizada:", data)
      return data.data
    } catch (error) {
      console.error("Error en ActividadService.update:", error)
      return undefined
    }
  }

  static async toggleEstado(id: number): Promise<Actividad | undefined> {
    try {
      console.log(`Cambiando estado de actividad con ID ${id}`)

      const url = `${API.BASE_URL}/api/actividades/destroy/${id}`
      console.log("URL de toggle estado:", url)

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN_FIJO}`,
        },
      })

      console.log("Respuesta status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Error al cambiar estado de actividad: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Actividad con estado cambiado:", data)
      return data.data
    } catch (error) {
      console.error("Error en ActividadService.toggleEstado:", error)
      return undefined
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API.BASE_URL}/api/actividades/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN_FIJO}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar actividad: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error en ActividadService.delete:", error)
      return false
    }
  }
}
