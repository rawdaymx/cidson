import type { Zona } from "@/types/zona"
import { getApiUrl, getAuthToken } from "@/config/api-config"

export class ZonaService {
  private static zonas: Zona[] = [
    {
      id: 1,
      nombre: "Zona Norte",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      nombre: "Zona Sur",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      nombre: "Zona Este",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      nombre: "Zona Oeste",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      nombre: "Zona Central",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      nombre: "Zona Metropolitana",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      nombre: "Zona Costera",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      nombre: "Zona Industrial",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      nombre: "Zona Residencial",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      nombre: "Zona Comercial",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static async getAll(
    configuracionId?: number,
    page = 1,
    filters: { nombre?: string; estado?: number } = {},
  ): Promise<{ zonas: Zona[]; pagination: any }> {
    try {
      if (!configuracionId) {
        // Si no hay configuracionId, devolver datos mock
        return {
          zonas: [...this.zonas],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            total: this.zonas.length,
          },
        }
      }

      // Obtener API URL y token de autenticación
      const apiUrl = getApiUrl()
      const token =
        getAuthToken() || localStorage.getItem("token") || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad"

      // Validar que tenemos una URL base válida
      if (!apiUrl) {
        console.error("URL de API no definida")
        throw new Error("URL de API no definida")
      }

      // Construir URL con parámetros de consulta
      let url = `${apiUrl}/api/zonas/${configuracionId}?page=${page}`

      // Añadir filtros si existen
      if (filters.nombre) {
        url += `&nombre=${encodeURIComponent(filters.nombre)}`
      }

      if (filters.estado !== undefined) {
        url += `&estado=${filters.estado}`
      }

      console.log("Fetching zonas from:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error HTTP: ${response.status} - ${errorText}`)
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result = await response.json()

      // Transformar los datos para mantener compatibilidad con la interfaz existente
      const zonas = result.data.map((zona: any) => ({
        id: zona.id,
        nombre: zona.nombre,
        estado: zona.estado ? "Activa" : "Inactiva",
        fechaCreacion: zona.fecha_creacion,
      }))

      const pagination = {
        currentPage: result.meta.current_page,
        totalPages: result.meta.last_page,
        total: result.meta.total,
        links: result.meta.links,
      }

      return { zonas, pagination }
    } catch (error) {
      console.error("Error al obtener zonas:", error)

      // En caso de error, devolver datos mock para evitar que la UI se rompa
      console.warn("Usando datos mock debido a un error en la API")
      return {
        zonas: [...this.zonas],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: this.zonas.length,
        },
      }
    }
  }

  static getById(id: number): Promise<Zona | undefined> {
    const zona = this.zonas.find((z) => z.id === id)
    return Promise.resolve(zona)
  }

  static create(zona: Omit<Zona, "id">): Promise<Zona> {
    const newId = Math.max(...this.zonas.map((z) => z.id)) + 1
    const newZona = { ...zona, id: newId }
    this.zonas.push(newZona)
    return Promise.resolve(newZona)
  }

  static update(id: number, zona: Partial<Zona>): Promise<Zona | undefined> {
    const index = this.zonas.findIndex((z) => z.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedZona = { ...this.zonas[index], ...zona }
    this.zonas[index] = updatedZona
    return Promise.resolve(updatedZona)
  }

  static toggleEstado(id: number): Promise<Zona | undefined> {
    const index = this.zonas.findIndex((z) => z.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const zona = this.zonas[index]
    const nuevoEstado = zona.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedZona = { ...zona, estado: nuevoEstado }
    this.zonas[index] = updatedZona
    return Promise.resolve(updatedZona)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.zonas.findIndex((z) => z.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.zonas.splice(index, 1)
    return Promise.resolve(true)
  }
}
