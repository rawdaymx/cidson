import type { ChecklistItem, ChecklistFormData, ChecklistFilter } from "@/types/checklist"

// Simulación de datos para desarrollo
const MOCK_CHECKLISTS: ChecklistItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `checklist-${i + 1}`,
  nombre: `Checklist de limpieza ${i + 1}`,
  actividad: "Piso",
  areasAsociadas: ["05"],
  materialesAsociados: ["10"],
  estado: "activo" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

export async function getChecklists(
  page = 1,
  limit = 12,
  filters?: ChecklistFilter,
): Promise<{ data: ChecklistItem[]; total: number }> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredData = [...MOCK_CHECKLISTS]

  // Aplicar filtros si existen
  if (filters) {
    if (filters.estado) {
      filteredData = filteredData.filter((item) => item.estado === filters.estado)
    }
    if (filters.actividad) {
      filteredData = filteredData.filter((item) => item.actividad === filters.actividad)
    }
  }

  const total = filteredData.length
  const startIndex = (page - 1) * limit
  const paginatedData = filteredData.slice(startIndex, startIndex + limit)

  return {
    data: paginatedData,
    total,
  }
}

export async function getChecklistById(id: string): Promise<ChecklistItem | null> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 300))

  const checklist = MOCK_CHECKLISTS.find((item) => item.id === id)
  return checklist || null
}

// Si hay alguna conversión de tipos, asegúrate de que sea compatible con el nuevo tipo
export async function createChecklist(data: ChecklistFormData): Promise<ChecklistItem> {
  // Si antes convertías strings a arrays, ahora ya no es necesario
  const response = await fetch("/api/checklists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Error al crear el checklist")
  }

  return await response.json()
}

export async function updateChecklist(id: string, data: Partial<ChecklistFormData>): Promise<ChecklistItem | null> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = MOCK_CHECKLISTS.findIndex((item) => item.id === id)
  if (index === -1) return null

  MOCK_CHECKLISTS[index] = {
    ...MOCK_CHECKLISTS[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return MOCK_CHECKLISTS[index]
}

export async function deleteChecklist(id: string): Promise<boolean> {
  // Simulación de una llamada a API
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = MOCK_CHECKLISTS.findIndex((item) => item.id === id)
  if (index === -1) return false

  MOCK_CHECKLISTS.splice(index, 1)
  return true
}
