export interface Actividad {
  id: number
  nombre: string
  configuracion_id: number
  estado: boolean
  created_at?: string // Este campo puede estar presente pero no es el que queremos mostrar
  fecha_creacion: string // Este es el campo correcto que viene de la API
}

export interface ActividadResponse {
  data: Actividad[]
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
