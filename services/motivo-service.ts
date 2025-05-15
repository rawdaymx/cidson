import type { Motivo } from "@/types/motivo"

export class MotivoService {
  private static motivos: Motivo[] = [
    {
      id: 1,
      nombre: "Limpieza preventiva",
      area: "Producción",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      nombre: "Mantenimiento programado",
      area: "Mantenimiento",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      nombre: "Limpieza correctiva",
      area: "Almacén",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      nombre: "Inspección de calidad",
      area: "Calidad",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      nombre: "Limpieza profunda",
      area: "Producción",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      nombre: "Desinfección general",
      area: "Sanitización",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      nombre: "Mantenimiento correctivo",
      area: "Mantenimiento",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      nombre: "Limpieza de emergencia",
      area: "Producción",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      nombre: "Auditoría interna",
      area: "Calidad",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      nombre: "Preparación para visita",
      area: "Administración",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static getAll(): Promise<Motivo[]> {
    return Promise.resolve([...this.motivos])
  }

  static getById(id: number): Promise<Motivo | undefined> {
    const motivo = this.motivos.find((m) => m.id === id)
    return Promise.resolve(motivo)
  }

  static create(motivo: Omit<Motivo, "id">): Promise<Motivo> {
    const newId = Math.max(...this.motivos.map((m) => m.id)) + 1
    const newMotivo = { ...motivo, id: newId }
    this.motivos.push(newMotivo)
    return Promise.resolve(newMotivo)
  }

  static update(id: number, motivo: Partial<Motivo>): Promise<Motivo | undefined> {
    const index = this.motivos.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedMotivo = { ...this.motivos[index], ...motivo }
    this.motivos[index] = updatedMotivo
    return Promise.resolve(updatedMotivo)
  }

  static toggleEstado(id: number): Promise<Motivo | undefined> {
    const index = this.motivos.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const motivo = this.motivos[index]
    const nuevoEstado = motivo.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedMotivo = { ...motivo, estado: nuevoEstado }
    this.motivos[index] = updatedMotivo
    return Promise.resolve(updatedMotivo)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.motivos.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.motivos.splice(index, 1)
    return Promise.resolve(true)
  }
}
