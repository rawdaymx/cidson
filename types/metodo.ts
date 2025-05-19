export interface Metodo {
  id: number
  configuracion_id: number
  nombre: string
  descripcion: string
  estado: boolean
  fecha_creacion: string
}

export interface MetodoResponse {
  data: Metodo[]
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
