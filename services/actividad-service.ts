import type { Actividad } from "@/types/actividad"

export class ActividadService {
  private static actividades: Actividad[] = [
    {
      id: 1,
      nombre: "Limpieza de oficinas",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      nombre: "Desinfección de áreas comunes",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      nombre: "Limpieza de ventanas",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      nombre: "Mantenimiento de pisos",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      nombre: "Limpieza de baños",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      nombre: "Recolección de residuos",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      nombre: "Limpieza de cocina",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      nombre: "Desinfección de equipos",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      nombre: "Limpieza de alfombras",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      nombre: "Pulido de superficies",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static getAll(): Promise<Actividad[]> {
    return Promise.resolve([...this.actividades])
  }

  static getById(id: number): Promise<Actividad | undefined> {
    const actividad = this.actividades.find((a) => a.id === id)
    return Promise.resolve(actividad)
  }

  static create(actividad: Omit<Actividad, "id">): Promise<Actividad> {
    const newId = Math.max(...this.actividades.map((a) => a.id)) + 1
    const newActividad = { ...actividad, id: newId }
    this.actividades.push(newActividad)
    return Promise.resolve(newActividad)
  }

  static update(id: number, actividad: Partial<Actividad>): Promise<Actividad | undefined> {
    const index = this.actividades.findIndex((a) => a.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedActividad = { ...this.actividades[index], ...actividad }
    this.actividades[index] = updatedActividad
    return Promise.resolve(updatedActividad)
  }

  static toggleEstado(id: number): Promise<Actividad | undefined> {
    const index = this.actividades.findIndex((a) => a.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const actividad = this.actividades[index]
    const nuevoEstado = actividad.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedActividad = { ...actividad, estado: nuevoEstado }
    this.actividades[index] = updatedActividad
    return Promise.resolve(updatedActividad)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.actividades.findIndex((a) => a.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.actividades.splice(index, 1)
    return Promise.resolve(true)
  }
}
