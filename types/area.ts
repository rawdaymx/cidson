export interface Area {
  id: number
  nombre: string
  estado: "Activa" | "Inactiva"
  fechaCreacion: string
  configuracion_id?: number
}

// Interfaz para la respuesta de la API
export interface AreaApiResponse {
  data: Array<{
    id: number
    configuracion_id: number
    nombre: string
    estado: boolean
    fecha_creacion: string
  }>
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

// Interfaz para un área individual de la API
export interface AreaItemApiResponse {
  data: {
    id: number
    configuracion_id: number
    nombre: string
    estado: boolean
    fecha_creacion: string
  }
}
