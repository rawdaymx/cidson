import type { Material, MaterialesResponse } from "@/types/material"

export class MaterialService {
  private static API_URL = "https://cidson.int.qaenv.dev/api"
  private static TOKEN = "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad"

  static async getAll(
    configuracionId = 9,
    page = 1,
    filters: { estado?: number; nombre?: string } = {},
  ): Promise<MaterialesResponse> {
    try {
      // Construir la URL base
      let url = `${this.API_URL}/materiales/${configuracionId}?page=${page}`

      // Añadir filtros si se proporcionan
      if (filters.estado !== undefined) {
        url += `&estado=${filters.estado}`
      }

      if (filters.nombre) {
        url += `&nombre=${encodeURIComponent(filters.nombre)}`
      }

      // Realizar la solicitud
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al obtener materiales: ${response.status}`)
      }

      const data: MaterialesResponse = await response.json()
      return data
    } catch (error) {
      console.error("Error al obtener materiales:", error)
      throw error
    }
  }

  static async getById(id: number): Promise<Material | undefined> {
    try {
      const url = `${this.API_URL}/materiales/detalle/${id}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al obtener material: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error al obtener material:", error)
      throw error
    }
  }

  static async create(material: Omit<Material, "id">, configuracionId = 9): Promise<Material> {
    try {
      const url = `${this.API_URL}/materiales/store/${configuracionId}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
        body: JSON.stringify({
          nombre: material.nombre,
          descripcion: material.descripcion || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al crear material: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error al crear material:", error)
      throw error
    }
  }

  static async update(id: number, material: Partial<Material>): Promise<Material | undefined> {
    try {
      // Actualizar la URL para usar el endpoint correcto
      const url = `${this.API_URL}/materiales/update/${id}`

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
        body: JSON.stringify(material),
      })

      if (!response.ok) {
        throw new Error(`Error al actualizar material: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error al actualizar material:", error)
      throw error
    }
  }

  // Modificar el método toggleEstado para usar el endpoint destroy tanto para activar como para desactivar
  static async toggleEstado(id: number): Promise<Material | undefined> {
    try {
      // Usar el mismo endpoint que delete pero con método DELETE
      const url = `${this.API_URL}/materiales/destroy/${id}`

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cambiar estado del material: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error al cambiar estado del material:", error)
      throw error
    }
  }

  static async delete(id: number): Promise<Material | undefined> {
    try {
      // Actualizado a usar el endpoint destroy
      const url = `${this.API_URL}/materiales/destroy/${id}`

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar/desactivar material: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error al eliminar/desactivar material:", error)
      throw error
    }
  }
}
