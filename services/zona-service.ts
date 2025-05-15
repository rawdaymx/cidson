import type { Zona } from "@/types/zona"

export class ZonaService {
  private static zonas: Zona[] = [
    {
      id: 1,
      nombre: "Zona Norte",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      nombre: "Zona Sur",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      nombre: "Zona Este",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      nombre: "Zona Oeste",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      nombre: "Zona Central",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      nombre: "Zona Metropolitana",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      nombre: "Zona Costera",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      nombre: "Zona Industrial",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      nombre: "Zona Residencial",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      nombre: "Zona Comercial",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static getAll(): Promise<Zona[]> {
    return Promise.resolve([...this.zonas])
  }

  static getById(id: number): Promise<Zona | undefined> {
    const zona = this.zonas.find((z) => z.id === id)
    return Promise.resolve(zona)
  }

  static create(zona: Omit<Zona, "id">): Promise<Zona> {
    const newId = Math.max(...this.zonas.map((z) => z.id)) + 1
    const newZona = { ...zona, id: newId }
    this.zonas.push(newZona)
    return Promise.resolve(newZona)
  }

  static update(id: number, zona: Partial<Zona>): Promise<Zona | undefined> {
    const index = this.zonas.findIndex((z) => z.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedZona = { ...this.zonas[index], ...zona }
    this.zonas[index] = updatedZona
    return Promise.resolve(updatedZona)
  }

  static toggleEstado(id: number): Promise<Zona | undefined> {
    const index = this.zonas.findIndex((z) => z.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const zona = this.zonas[index]
    const nuevoEstado = zona.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedZona = { ...zona, estado: nuevoEstado }
    this.zonas[index] = updatedZona
    return Promise.resolve(updatedZona)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.zonas.findIndex((z) => z.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.zonas.splice(index, 1)
    return Promise.resolve(true)
  }
}
