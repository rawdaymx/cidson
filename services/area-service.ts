import type { Area } from "@/types/area"

export class AreaService {
  private static areas: Area[] = [
    {
      id: 1,
      nombre: "Área de Producción",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      nombre: "Área de Almacén",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      nombre: "Área de Oficinas",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      nombre: "Área de Comedor",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      nombre: "Área de Recepción",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      nombre: "Área de Estacionamiento",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      nombre: "Área de Descanso",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      nombre: "Área de Reuniones",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      nombre: "Área de Capacitación",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      nombre: "Área de Mantenimiento",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static getAll(): Promise<Area[]> {
    return Promise.resolve([...this.areas])
  }

  static getById(id: number): Promise<Area | undefined> {
    const area = this.areas.find((a) => a.id === id)
    return Promise.resolve(area)
  }

  static create(area: Omit<Area, "id">): Promise<Area> {
    const newId = Math.max(...this.areas.map((a) => a.id)) + 1
    const newArea = { ...area, id: newId }
    this.areas.push(newArea)
    return Promise.resolve(newArea)
  }

  static update(id: number, area: Partial<Area>): Promise<Area | undefined> {
    const index = this.areas.findIndex((a) => a.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedArea = { ...this.areas[index], ...area }
    this.areas[index] = updatedArea
    return Promise.resolve(updatedArea)
  }

  static toggleEstado(id: number): Promise<Area | undefined> {
    const index = this.areas.findIndex((a) => a.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const area = this.areas[index]
    const nuevoEstado = area.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedArea = { ...area, estado: nuevoEstado }
    this.areas[index] = updatedArea
    return Promise.resolve(updatedArea)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.areas.findIndex((a) => a.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.areas.splice(index, 1)
    return Promise.resolve(true)
  }
}
