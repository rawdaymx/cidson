import type { Metodo } from "@/types/metodo"

export class MetodoService {
  private static metodos: Metodo[] = [
    {
      id: 1,
      descripcion: "Limpieza en seco",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      descripcion: "Limpieza con vapor",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      descripcion: "Limpieza con productos químicos",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      descripcion: "Limpieza con ultrasonido",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      descripcion: "Limpieza con presión de agua",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      descripcion: "Limpieza con espuma",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      descripcion: "Limpieza con microondas",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      descripcion: "Limpieza con ozono",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      descripcion: "Limpieza con láser",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      descripcion: "Limpieza criogénica",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static getAll(): Promise<Metodo[]> {
    return Promise.resolve([...this.metodos])
  }

  static getById(id: number): Promise<Metodo | undefined> {
    const metodo = this.metodos.find((m) => m.id === id)
    return Promise.resolve(metodo)
  }

  static create(metodo: Omit<Metodo, "id">): Promise<Metodo> {
    const newId = Math.max(...this.metodos.map((m) => m.id)) + 1
    const newMetodo = { ...metodo, id: newId }
    this.metodos.push(newMetodo)
    return Promise.resolve(newMetodo)
  }

  static update(id: number, metodo: Partial<Metodo>): Promise<Metodo | undefined> {
    const index = this.metodos.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedMetodo = { ...this.metodos[index], ...metodo }
    this.metodos[index] = updatedMetodo
    return Promise.resolve(updatedMetodo)
  }

  static toggleEstado(id: number): Promise<Metodo | undefined> {
    const index = this.metodos.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const metodo = this.metodos[index]
    const nuevoEstado = metodo.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedMetodo = { ...metodo, estado: nuevoEstado }
    this.metodos[index] = updatedMetodo
    return Promise.resolve(updatedMetodo)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.metodos.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.metodos.splice(index, 1)
    return Promise.resolve(true)
  }
}
