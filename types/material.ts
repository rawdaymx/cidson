export interface Material {
  id: number
  nombre: string
  descripcion?: string
  configuracion_id?: number
  estado: boolean | string
  fecha_creacion: string
}

export interface MaterialesResponse {
  data: Material[]
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
