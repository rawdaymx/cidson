export interface Zona {
  id: number
  nombre: string
  estado: string
  fechaCreacion: string
  configuracion_id?: number
  fecha_creacion?: string
}

export interface ZonaAPIResponse {
  id: number
  configuracion_id: number
  nombre: string
  estado: boolean
  fecha_creacion: string
}

export interface ZonasPaginatedResponse {
  data: ZonaAPIResponse[]
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
