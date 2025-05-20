import type { Area, AreaApiResponse, AreaItemApiResponse } from "@/types/area"
import { HttpClient } from "@/services/http-client"
import { API } from "@/config/api-config"

export class AreaService {
  // Método para obtener todas las áreas de una configuración (empresa) con paginación
  static async getAll(configuracionId?: number, page = 1, search = ""): Promise<Area[]> {
    try {
      if (!configuracionId) {
        return []
      }

      // Construir URL con parámetros de paginación y búsqueda
      const url = `${API.ENDPOINTS.AREAS}/${configuracionId}`
      const params: Record<string, any> = { page }
      if (search) {
        params.search = search
      }

      console.log(`Obteniendo áreas para configuración ${configuracionId}`)
      const response = await HttpClient.get<AreaApiResponse>(url, params)

      if (!response || !response.data) {
        console.log("No se encontraron áreas o respuesta vacía")
        return []
      }

      // Transformar los datos de la API al formato local
      const areas = response.data.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        estado: item.estado ? "Activa" : "Inactiva",
        fechaCreacion: item.fecha_creacion || item.created_at, // Manejar ambos formatos
        configuracion_id: item.configuracion_id,
      }))

      console.log(`Se encontraron ${areas.length} áreas`)
      return areas
    } catch (error) {
      console.error("Error al obtener áreas:", error)
      throw error
    }
  }

  // Resto de métodos del servicio...
  static async getById(id: number): Promise<Area | undefined> {
    try {
      const url = `${API.ENDPOINTS.AREAS}/show/${id}`
      const response = await HttpClient.get<AreaItemApiResponse>(url)

      if (!response || !response.data) {
        return undefined
      }

      return {
        id: response.data.id,
        nombre: response.data.nombre,
        estado: response.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: response.data.fecha_creacion || response.data.created_at,
        configuracion_id: response.data.configuracion_id,
      }
    } catch (error) {
      console.error("Error al obtener área por ID:", error)
      return undefined
    }
  }

  static async create(areaData: { nombre: string; configuracion_id: number }): Promise<Area> {
    try {
      const url = `${API.ENDPOINTS.AREAS}/store/${areaData.configuracion_id}`
      const response = await HttpClient.post<AreaItemApiResponse>(url, { nombre: areaData.nombre })

      if (!response || !response.data) {
        throw new Error("Error al crear área")
      }

      return {
        id: response.data.id,
        nombre: response.data.nombre,
        estado: response.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: response.data.fecha_creacion || response.data.created_at,
        configuracion_id: response.data.configuracion_id,
      }
    } catch (error: any) {
      console.error("Error al crear área:", error)

      // Si el error tiene un mensaje específico relacionado con nombre duplicado
      if (error.response && error.response.data) {
        if (
          error.response.data.message &&
          (error.response.data.message.includes("already been taken") ||
            error.response.data.message.includes("ya existe"))
        ) {
          throw new Error("El nombre del área ya existe. Por favor, utilice otro nombre.")
        } else if (error.response.data.errors && error.response.data.errors.nombre) {
          // Si hay errores específicos para el campo nombre
          throw new Error(error.response.data.errors.nombre[0])
        } else if (error.response.data.message) {
          throw new Error(error.response.data.message)
        }
      }

      // Si el error tiene un mensaje específico en el objeto error
      if (error.message && (error.message.includes("already been taken") || error.message.includes("ya existe"))) {
        throw new Error("El nombre del área ya existe. Por favor, utilice otro nombre.")
      }

      // Propagar el error original si no se puede determinar un mensaje específico
      throw error
    }
  }

  static async update(id: number, areaData: { nombre: string; estado?: "Activa" | "Inactiva" }): Promise<Area> {
    try {
      const url = `${API.ENDPOINTS.AREAS}/update/${id}`
      const response = await HttpClient.put<AreaItemApiResponse>(url, { nombre: areaData.nombre })

      if (!response || !response.data) {
        throw new Error("Error al actualizar área")
      }

      return {
        id: response.data.id,
        nombre: response.data.nombre,
        estado: response.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: response.data.fecha_creacion || response.data.created_at,
        configuracion_id: response.data.configuracion_id,
      }
    } catch (error: any) {
      console.error("Error al actualizar área:", error)

      // Capturar y propagar el mensaje específico de error
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          // Si hay un mensaje general
          throw new Error(error.response.data.message)
        } else if (error.response.data.errors && error.response.data.errors.nombre) {
          // Si hay errores específicos para el campo nombre
          throw new Error(error.response.data.errors.nombre[0])
        }
      }

      // Si el error tiene un mensaje específico en el objeto error
      if (error.message && error.message.includes("nombre has already been taken")) {
        throw new Error("El nombre del área ya existe. Por favor, utilice otro nombre.")
      }

      // Error genérico si no se puede determinar el mensaje específico
      throw new Error("Error al actualizar el área. Por favor, intente nuevamente.")
    }
  }

  // Actualizar el método toggleEstado para usar el endpoint destroy
  static async toggleEstado(id: number): Promise<Area> {
    try {
      // Primero obtenemos el área actual para saber su estado
      const currentArea = await this.getById(id)

      if (!currentArea) {
        throw new Error("No se pudo encontrar el área")
      }

      // Usamos el endpoint destroy para inactivar el área
      await HttpClient.delete(`${API.ENDPOINTS.AREAS}/destroy/${id}`)

      // Como no tenemos la respuesta directa, construimos el objeto con el estado cambiado
      return {
        ...currentArea,
        estado: currentArea.estado === "Activa" ? "Inactiva" : "Activa",
      }
    } catch (error) {
      console.error("Error al cambiar estado del área:", error)
      throw error
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      await HttpClient.delete(`${API.ENDPOINTS.AREAS}/delete/${id}`)
      return true
    } catch (error) {
      console.error("Error al eliminar área:", error)
      return false
    }
  }
}
