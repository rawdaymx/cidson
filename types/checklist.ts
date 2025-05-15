export interface ChecklistItem {
  id: string
  nombre: string
  area: string
  fechaInicio: string
  fechaFin: string
  mostrarMetodos: boolean
  mostrarMateriales: boolean
  zonas: ZonaChecklist[]
  createdAt: string
  updatedAt: string
}

export interface ZonaChecklist {
  id: string
  nombre: string
  actividades: ActividadChecklist[]
}

export interface ActividadChecklist {
  id: string
  nombre: string
  metodos: MetodoChecklist[]
}

export interface MetodoChecklist {
  id: string
  nombre: string
  materiales: MaterialChecklist[]
  turnos: TurnoChecklist[]
}

export interface MaterialChecklist {
  id: string
  nombre: string
}

export interface TurnoChecklist {
  id: string
  numero: number
  dias: string[] // 'lunes', 'martes', etc.
}

export interface ChecklistFormData {
  nombre?: string
  area: string
  fechaInicio: string
  fechaFin: string
  mostrarMetodos: boolean
  mostrarMateriales: boolean
  zonas: ZonaChecklist[]
}

export interface ChecklistFilter {
  estado?: string
  area?: string
}

export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo"
