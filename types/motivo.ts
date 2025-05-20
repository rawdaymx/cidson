export interface Motivo {
  id: number
  nombre: string
  estado: "Activa" | "Inactiva"
  fechaCreacion: string
  configuracion_id: number
  area_id?: number
}

export interface MotivoApiResponse {
  id: number
  configuracion_id: number
  nombre: string
  estado: boolean
  fecha_creacion: string
}

export interface MotivosPagination {
  data: Motivo[]
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
