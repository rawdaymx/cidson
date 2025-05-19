export interface Empresa {
  id: number
  nombre: string
  razonSocial: string
  fechaRegistro: string
  fecha_creacion?: string // Añadir el campo fecha_creacion como opcional
  estado: string
  configuracion_id: number
}
