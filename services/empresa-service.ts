import type { Empresa } from "@/types/empresa"
import { API } from "@/config/api-config"

// Interfaz para la respuesta paginada de la API
interface PaginatedResponse<T> {
  data: T[]
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

// Interfaz para la respuesta de una sola empresa de la API
interface EmpresaApiResponse {
  data: {
    id: number
    configuracion_id: number
    nombre: string
    razon_social: string
    estado: boolean
  }
}

// Interfaz para los datos de la API (snake_case)
interface EmpresaApiData {
  id?: number
  nombre: string
  razon_social: string
  estado?: boolean
}

// Interfaz para los parámetros de búsqueda
export interface EmpresaSearchParams {
  nombre?: string
  estado?: string | number
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
}

// Interfaz para los datos de creación/actualización de empresa
export interface EmpresaCreateData {
  nombre: string
  razon_social: string
}

// Interfaz para los datos de actualización de empresa
export interface EmpresaUpdateData {
  nombre: string
  razon_social: string
}

export class EmpresaService {
  // Método para obtener todas las empresas con posibilidad de filtrado
  static async getAll(params?: EmpresaSearchParams): Promise<{
    empresas: Empresa[]
    pagination: PaginatedResponse<any>["meta"]
  }> {
    try {
      // Construir la URL con los parámetros de búsqueda
      let url = `${API.BASE_URL}${API.ENDPOINTS.EMPRESAS}`

      if (params) {
        const queryParams = new URLSearchParams()

        if (params.nombre) queryParams.append("nombre", params.nombre)
        if (params.estado !== undefined) queryParams.append("estado", params.estado.toString())
        if (params.fecha_inicio) queryParams.append("fecha_inicio", params.fecha_inicio)
        if (params.fecha_fin) queryParams.append("fecha_fin", params.fecha_fin)
        if (params.page) queryParams.append("page", params.page.toString())

        const queryString = queryParams.toString()
        if (queryString) {
          url += `?${queryString}`
        }
      }

      // Obtener el token de autorización
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("No se encontró token de autorización")
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al obtener empresas: ${response.statusText}`)
      }

      const data: PaginatedResponse<any> = await response.json()

      // Mapear los datos de la API al formato que espera la aplicación
      const empresas = data.data.map((empresa) => ({
        id: empresa.id,
        nombre: empresa.nombre,
        razonSocial: empresa.razon_social, // Mapear razon_social de la API a razonSocial en nuestro modelo
        fechaRegistro: new Date().toLocaleDateString(), // La API no devuelve fecha de registro, usar fecha actual
        estado: empresa.estado ? "Activo" : "Inactivo",
      }))

      return {
        empresas,
        pagination: data.meta,
      }
    } catch (error) {
      console.error("Error al obtener empresas:", error)
      // En caso de error, devolver un array vacío y paginación básica
      return {
        empresas: [],
        pagination: {
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

  // Método para crear una nueva empresa
  static async create(empresaData: EmpresaCreateData): Promise<Empresa> {
    try {
      const url = `${API.BASE_URL}${API.ENDPOINTS.EMPRESAS}`

      // Obtener el token de autorización
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("No se encontró token de autorización")
      }

      // Preparar los datos para la API (ya están en el formato correcto)
      const apiData: EmpresaApiData = {
        nombre: empresaData.nombre,
        razon_social: empresaData.razon_social,
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error al crear empresa: ${response.statusText}`)
      }

      const responseData: EmpresaApiResponse = await response.json()

      // Mapear la respuesta al formato que espera la aplicación
      const nuevaEmpresa: Empresa = {
        id: responseData.data.id,
        nombre: responseData.data.nombre,
        razonSocial: responseData.data.razon_social, // Mapear razon_social de la API a razonSocial en nuestro modelo
        fechaRegistro: new Date().toLocaleDateString(), // La API no devuelve fecha de registro, usar fecha actual
        estado: responseData.data.estado ? "Activo" : "Inactivo",
      }

      return nuevaEmpresa
    } catch (error) {
      console.error("Error al crear empresa:", error)
      throw error
    }
  }

  // Método para obtener una empresa por ID
  static async getById(id: number): Promise<Empresa | undefined> {
    try {
      const url = `${API.BASE_URL}${API.ENDPOINTS.EMPRESAS}/${id}`

      // Obtener el token de autorización
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("No se encontró token de autorización")
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return undefined
        }
        throw new Error(`Error al obtener empresa: ${response.statusText}`)
      }

      const responseData: EmpresaApiResponse = await response.json()

      // Mapear la respuesta al formato que espera la aplicación
      const empresa: Empresa = {
        id: responseData.data.id,
        nombre: responseData.data.nombre,
        razonSocial: responseData.data.razon_social, // Mapear razon_social de la API a razonSocial en nuestro modelo
        fechaRegistro: new Date().toLocaleDateString(), // La API no devuelve fecha de registro, usar fecha actual
        estado: responseData.data.estado ? "Activo" : "Inactivo",
      }

      return empresa
    } catch (error) {
      console.error("Error al obtener empresa por ID:", error)
      return undefined
    }
  }

  // Método para actualizar una empresa
  static async update(id: number, empresaData: EmpresaUpdateData): Promise<Empresa | undefined> {
    try {
      const url = `${API.BASE_URL}${API.ENDPOINTS.EMPRESAS}/${id}`

      // Obtener el token de autorización
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("No se encontró token de autorización")
      }

      // Preparar los datos para la API (ya están en el formato correcto)
      const apiData: EmpresaApiData = {
        nombre: empresaData.nombre,
        razon_social: empresaData.razon_social,
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return undefined
        }
        const errorData = await response.json()
        throw new Error(errorData.message || `Error al actualizar empresa: ${response.statusText}`)
      }

      const responseData: EmpresaApiResponse = await response.json()

      // Mapear la respuesta al formato que espera la aplicación
      const empresaActualizada: Empresa = {
        id: responseData.data.id,
        nombre: responseData.data.nombre,
        razonSocial: responseData.data.razon_social, // Mapear razon_social de la API a razonSocial en nuestro modelo
        fechaRegistro: new Date().toLocaleDateString(), // La API no devuelve fecha de registro, usar fecha actual
        estado: responseData.data.estado ? "Activo" : "Inactivo",
      }

      return empresaActualizada
    } catch (error) {
      console.error("Error al actualizar empresa:", error)
      throw error
    }
  }

  // Método para activar/inactivar una empresa
  static async toggleActive(id: number): Promise<Empresa | undefined> {
    try {
      const url = `${API.BASE_URL}${API.ENDPOINTS.EMPRESAS}/${id}`

      // Obtener el token de autorización
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("No se encontró token de autorización")
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return undefined
        }
        throw new Error(`Error al cambiar estado de empresa: ${response.statusText}`)
      }

      const responseData: EmpresaApiResponse = await response.json()

      // Mapear la respuesta al formato que espera la aplicación
      const empresaActualizada: Empresa = {
        id: responseData.data.id,
        nombre: responseData.data.nombre,
        razonSocial: responseData.data.razon_social, // Mapear razon_social de la API a razonSocial en nuestro modelo
        fechaRegistro: new Date().toLocaleDateString(), // La API no devuelve fecha de registro, usar fecha actual
        estado: responseData.data.estado ? "Activo" : "Inactivo",
      }

      return empresaActualizada
    } catch (error) {
      console.error("Error al cambiar estado de empresa:", error)
      throw error
    }
  }
}
