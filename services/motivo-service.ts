import type { Motivo } from "@/types/motivo"
import { HttpClient } from "./http-client"
import { API } from "@/config/api-config"

export interface MotivoApiResponse {
  id: number
  configuracion_id: number
  nombre: string
  estado: boolean
  fecha_creacion: string
  area_id?: number
}

export interface MotivosPagination {
  data: MotivoApiResponse[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export class MotivoService {
  static async getAll(configuracionId?: number, page = 1, filters = {}): Promise<MotivosPagination> {
    try {
      if (!configuracionId) {
        return this.getEmptyPaginationResponse()
      }

      // Preparar parámetros
      const params = {
        page,
        ...filters,
      }

      // Construir la URL correcta para la API
      const url = `${API.BASE_URL}/api/motivos/${configuracionId}`
      console.log("URL de la solicitud:", url)

      try {
        // Intentar hacer la solicitud
        const response = await HttpClient.get<MotivosPagination>(url, params)
        return this.processMotivosResponse(response)
      } catch (fetchError) {
        console.error("Error al hacer la solicitud HTTP:", fetchError)

        // Intentar con una URL alternativa sin el prefijo /api
        console.log("Intentando con URL alternativa...")
        const alternativeUrl = `${API.BASE_URL}/motivos/${configuracionId}`
        console.log("URL alternativa:", alternativeUrl)

        try {
          const alternativeResponse = await HttpClient.get<MotivosPagination>(alternativeUrl, params)
          return this.processMotivosResponse(alternativeResponse)
        } catch (alternativeError) {
          console.error("Error con URL alternativa:", alternativeError)
          return this.getEmptyPaginationResponse()
        }
      }
    } catch (error) {
      console.error("Error al obtener motivos:", error)
      return this.getEmptyPaginationResponse()
    }
  }

  private static getEmptyPaginationResponse(): MotivosPagination {
    return {
      data: [],
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
      links: {
        first: "",
        last: "",
        prev: null,
        next: null,
      },
    }
  }

  private static processMotivosResponse(response: MotivosPagination): MotivosPagination {
    if (response && response.data) {
      const transformedData = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            estado: item.estado ? "Activa" : "Inactiva",
            fechaCreacion: item.fecha_creacion,
            configuracion_id: item.configuracion_id,
            area_id: item.area_id,
          }))
        : []

      return {
        data: transformedData,
        meta: response.meta || {
          current_page: 1,
          from: 0,
          last_page: 1,
          links: [],
          path: "",
          per_page: transformedData.length,
          to: transformedData.length,
          total: transformedData.length,
        },
        links: response.links || {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      }
    } else {
      return this.getEmptyPaginationResponse()
    }
  }

  static async getById(id: number): Promise<Motivo | undefined> {
    try {
      // Intentar primero con la URL con prefijo /api
      const url = `${API.BASE_URL}/api/motivo/${id}`
      console.log("URL para obtener motivo por ID:", url)

      try {
        const response = await HttpClient.get<{ data: MotivoApiResponse }>(url)
        return this.transformMotivoResponse(response.data)
      } catch (fetchError) {
        console.error("Error al hacer la solicitud HTTP:", fetchError)

        // Intentar con una URL alternativa sin el prefijo /api
        const alternativeUrl = `${API.BASE_URL}/motivo/${id}`
        console.log("URL alternativa:", alternativeUrl)

        const alternativeResponse = await HttpClient.get<{ data: MotivoApiResponse }>(alternativeUrl)
        return this.transformMotivoResponse(alternativeResponse.data)
      }
    } catch (error) {
      console.error(`Error al obtener motivo con ID ${id}:`, error)
      return undefined
    }
  }

  private static transformMotivoResponse(data: MotivoApiResponse): Motivo {
    return {
      id: data.id,
      nombre: data.nombre,
      estado: data.estado ? "Activa" : "Inactiva",
      fechaCreacion: data.fecha_creacion,
      configuracion_id: data.configuracion_id,
      area_id: data.area_id,
    }
  }

  static async create(motivo: Omit<Motivo, "id" | "fechaCreacion">): Promise<Motivo> {
    try {
      // Usar la URL completa para evitar problemas de rutas relativas
      const url = `${API.BASE_URL}/api/motivos/store/${motivo.configuracion_id}`
      console.log("URL para crear motivo:", url)

      // Preparar los datos según el formato esperado por la API
      const apiMotivo: Record<string, any> = {
        nombre: motivo.nombre,
      }

      // Incluir area_id si está definido
      if (motivo.area_id) {
        apiMotivo.area_id = motivo.area_id
      }

      try {
        const response = await HttpClient.post<{ data: MotivoApiResponse }>(url, apiMotivo)
        return this.transformMotivoResponse(response.data)
      } catch (fetchError) {
        console.error("Error al hacer la solicitud HTTP:", fetchError)

        // Intentar con una URL alternativa sin el prefijo /api
        const alternativeUrl = `${API.BASE_URL}/motivos/store/${motivo.configuracion_id}`
        console.log("URL alternativa:", alternativeUrl)

        const alternativeResponse = await HttpClient.post<{ data: MotivoApiResponse }>(alternativeUrl, apiMotivo)
        return this.transformMotivoResponse(alternativeResponse.data)
      }
    } catch (error) {
      console.error("Error al crear motivo:", error)
      throw error
    }
  }

  static async update(id: number, motivo: Partial<Motivo>): Promise<Motivo | undefined> {
    try {
      // Usar la URL correcta para actualizar motivo según la API
      const url = `${API.BASE_URL}/api/motivos/update/${id}`
      console.log("URL para actualizar motivo:", url)

      const apiMotivo: Record<string, any> = {}

      if (motivo.nombre !== undefined) apiMotivo.nombre = motivo.nombre
      if (motivo.estado !== undefined) apiMotivo.estado = motivo.estado === "Activa" ? true : false
      if (motivo.configuracion_id !== undefined) apiMotivo.configuracion_id = motivo.configuracion_id
      if (motivo.area_id !== undefined) apiMotivo.area_id = motivo.area_id

      try {
        const response = await HttpClient.put<{ data: MotivoApiResponse }>(url, apiMotivo)
        return this.transformMotivoResponse(response.data)
      } catch (fetchError) {
        console.error("Error al hacer la solicitud HTTP:", fetchError)

        // Intentar con una URL alternativa sin el prefijo /api
        const alternativeUrl = `${API.BASE_URL}/motivos/update/${id}`
        console.log("URL alternativa:", alternativeUrl)

        const alternativeResponse = await HttpClient.put<{ data: MotivoApiResponse }>(alternativeUrl, apiMotivo)
        return this.transformMotivoResponse(alternativeResponse.data)
      }
    } catch (error) {
      console.error(`Error al actualizar motivo con ID ${id}:`, error)
      return undefined
    }
  }

  static async toggleEstado(id: number): Promise<Motivo | undefined> {
    try {
      // Usar la URL correcta con el formato /api/motivos/destroy/{id}
      const url = `${API.BASE_URL}/api/motivos/destroy/${id}`
      console.log("URL para cambiar estado del motivo:", url)

      try {
        // Usar método DELETE en lugar de PUT
        const response = await HttpClient.delete<{ data: MotivoApiResponse }>(url)
        return this.transformMotivoResponse(response.data)
      } catch (fetchError) {
        console.error("Error al hacer la solicitud HTTP:", fetchError)

        // Intentar con una URL alternativa sin el prefijo /api
        const alternativeUrl = `${API.BASE_URL}/motivos/destroy/${id}`
        console.log("URL alternativa:", alternativeUrl)

        const alternativeResponse = await HttpClient.delete<{ data: MotivoApiResponse }>(alternativeUrl)
        return this.transformMotivoResponse(alternativeResponse.data)
      }
    } catch (error) {
      console.error(`Error al cambiar estado del motivo con ID ${id}:`, error)
      return undefined
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      // Usar la URL completa para evitar problemas de rutas relativas
      const url = `${API.BASE_URL}/api/motivo/${id}`
      console.log("URL para eliminar motivo:", url)

      try {
        await HttpClient.delete(url)
        return true
      } catch (fetchError) {
        console.error("Error al hacer la solicitud HTTP:", fetchError)

        // Intentar con una URL alternativa sin el prefijo /api
        const alternativeUrl = `${API.BASE_URL}/motivo/${id}`
        console.log("URL alternativa:", alternativeUrl)

        await HttpClient.delete(alternativeUrl)
        return true
      }
    } catch (error) {
      console.error(`Error al eliminar motivo con ID ${id}:`, error)
      return false
    }
  }
}
