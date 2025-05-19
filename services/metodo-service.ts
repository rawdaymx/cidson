import type { Metodo, MetodoResponse } from "@/types/metodo"
import { httpClient } from "@/services/http-client"

export class MetodoService {
  /**
   * Obtiene todos los métodos de una empresa con paginación
   * @param empresaId ID de la empresa
   * @param page Número de página
   * @param nombre Término de búsqueda por nombre (opcional)
   * @param estado Estado del método (opcional): 1 para activos, 0 para inactivos
   * @returns Respuesta con datos y metadatos de paginación
   */
  static async getAll(empresaId: number, page = 1, nombre?: string, estado?: number): Promise<MetodoResponse> {
    try {
      if (!empresaId) {
        // Si no hay empresaId, devolvemos un objeto vacío con la estructura esperada
        return {
          data: [],
          links: { first: "", last: "", prev: null, next: null },
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

      // Construir URL con parámetros - Corregida la ruta según la API real
      let url = `/api/metodos/${empresaId}?page=${page}`

      // Añadir filtros si están presentes
      if (nombre) {
        url += `&nombre=${encodeURIComponent(nombre)}`
      }

      // Añadir filtro de estado si está definido
      if (estado !== undefined) {
        url += `&estado=${estado}`
      }

      console.log(`Obteniendo métodos: ${url}`)
      const response = await httpClient.get<MetodoResponse>(url)

      // Asegurarnos de que la respuesta tenga la estructura esperada
      if (!response.data) {
        console.warn("La respuesta no contiene datos", response)
        response.data = []
      }

      return response
    } catch (error) {
      console.error("Error al obtener métodos:", error)
      throw error
    }
  }

  static async getById(id: number): Promise<Metodo | undefined> {
    try {
      // Cambiando la ruta de api/metodo/{id} a api/metodos/{id} para que coincida con el patrón de la API
      const response = await httpClient.get<{ data: Metodo }>(`/api/metodos/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener método con id ${id}:`, error)
      return undefined
    }
  }

  static async create(empresaId: number, metodo: { nombre: string; descripcion: string }): Promise<Metodo> {
    try {
      console.log(`Creando método para empresa ${empresaId}:`, metodo)
      const response = await httpClient.post<{ data: Metodo }>(`/api/metodos/store/${empresaId}`, metodo)
      return response.data
    } catch (error) {
      console.error("Error al crear método:", error)
      throw error
    }
  }

  static async update(id: number, metodo: Partial<Metodo>): Promise<Metodo | undefined> {
    try {
      // Usar la ruta correcta según el formato de la API proporcionada
      const response = await httpClient.put<{ data: Metodo }>(`/api/metodos/update/${id}`, {
        nombre: metodo.nombre,
        descripcion: metodo.descripcion,
      })
      return response.data
    } catch (error: any) {
      console.error(`Error al actualizar método con id ${id}:`, error)

      // Capturar el mensaje de error específico si está disponible
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  }

  static async toggleEstado(id: number): Promise<Metodo | undefined> {
    try {
      console.log(`Cambiando estado del método con id ${id}`)
      // La API usa DELETE para activar/inactivar métodos
      const response = await httpClient.delete<{ data: Metodo }>(`/api/metodos/destroy/${id}`)
      console.log("Respuesta de toggleEstado:", response)
      return response.data
    } catch (error) {
      console.error(`Error al cambiar estado del método con id ${id}:`, error)
      throw error
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      await httpClient.delete(`/api/metodo/${id}`)
      return true
    } catch (error) {
      console.error(`Error al eliminar método con id ${id}:`, error)
      return false
    }
  }
}
