import type { Area } from "@/types/area"
import type { Zona } from "@/types/zona"
import type { Actividad } from "@/types/actividad"
import type { Metodo } from "@/types/metodo"
import type { Material } from "@/types/material"

// Simulación de datos para desarrollo
const MOCK_AREAS: Area[] = [
  { id: "1", nombre: "LÍNEA 10" },
  { id: "2", nombre: "LÍNEA 20" },
  { id: "3", nombre: "LÍNEA 30" },
]

const MOCK_ZONAS: Zona[] = [
  { id: "1", nombre: "Despeletizadora", areaId: "1" },
  { id: "2", nombre: "Lavadora", areaId: "1" },
  { id: "3", nombre: "Llenadora", areaId: "1" },
  { id: "4", nombre: "Etiquetadora", areaId: "2" },
  { id: "5", nombre: "Empacadora", areaId: "2" },
]

const MOCK_ACTIVIDADES: Actividad[] = [
  { id: "1", nombre: "TRANSPORTADORES DE BOTELLA-BOTE VACÍA", zonaId: "1" },
  { id: "2", nombre: "LIMPIEZA DE EQUIPOS", zonaId: "1" },
  { id: "3", nombre: "MANTENIMIENTO PREVENTIVO", zonaId: "2" },
  { id: "4", nombre: "INSPECCIÓN DE CALIDAD", zonaId: "3" },
]

const MOCK_METODOS: Metodo[] = [
  { id: "1", nombre: "Limpieza Externa De Techos Y Cortinas", actividadId: "1" },
  { id: "2", nombre: "Limpieza Interna De Techos Y Cortinas", actividadId: "1" },
  { id: "3", nombre: "Limpieza De Superficies", actividadId: "2" },
  { id: "4", nombre: "Revisión De Componentes", actividadId: "3" },
]

const MOCK_MATERIALES: Material[] = [
  { id: "1", nombre: "Franela Húmeda", metodoId: "1" },
  { id: "2", nombre: "Desinfectante", metodoId: "1" },
  { id: "3", nombre: "Cepillo", metodoId: "2" },
  { id: "4", nombre: "Detergente", metodoId: "2" },
  { id: "5", nombre: "Escoba", metodoId: "3" },
]

export async function getAreas(): Promise<Area[]> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_AREAS
}

export async function getZonasByAreaId(areaId: string): Promise<Zona[]> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_ZONAS.filter((zona) => zona.areaId === areaId)
}

export async function getActividadesByZonaId(zonaId: string): Promise<Actividad[]> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_ACTIVIDADES.filter((actividad) => actividad.zonaId === zonaId)
}

export async function getMetodosByActividadId(actividadId: string): Promise<Metodo[]> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_METODOS.filter((metodo) => metodo.actividadId === actividadId)
}

export async function getMaterialesByMetodoId(metodoId: string): Promise<Material[]> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_MATERIALES.filter((material) => material.metodoId === metodoId)
}
