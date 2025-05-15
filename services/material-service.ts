import type { Material } from "@/types/material"

export class MaterialService {
  private static materiales: Material[] = [
    {
      id: 1,
      nombre: "Detergente industrial",
      descripcion: "Detergente de alta potencia para limpieza industrial",
      estado: "Activa",
      fechaCreacion: "01/01/2023",
    },
    {
      id: 2,
      nombre: "Desinfectante multiusos",
      descripcion: "Desinfectante para todo tipo de superficies",
      estado: "Activa",
      fechaCreacion: "15/01/2023",
    },
    {
      id: 3,
      nombre: "Limpiador de vidrios",
      descripcion: "Producto especializado para limpieza de cristales y espejos",
      estado: "Activa",
      fechaCreacion: "20/01/2023",
    },
    {
      id: 4,
      nombre: "Cera para pisos",
      descripcion: "Cera protectora y abrillantadora para pisos",
      estado: "Activa",
      fechaCreacion: "25/01/2023",
    },
    {
      id: 5,
      nombre: "Jabón líquido",
      descripcion: "Jabón líquido para manos con propiedades antibacteriales",
      estado: "Activa",
      fechaCreacion: "01/02/2023",
    },
    {
      id: 6,
      nombre: "Limpiador de acero inoxidable",
      descripcion: "Producto especializado para superficies de acero inoxidable",
      estado: "Inactiva",
      fechaCreacion: "05/02/2023",
    },
    {
      id: 7,
      nombre: "Removedor de manchas",
      descripcion: "Producto para eliminar manchas difíciles en textiles",
      estado: "Inactiva",
      fechaCreacion: "10/02/2023",
    },
    {
      id: 8,
      nombre: "Limpiador de alfombras",
      descripcion: "Producto para limpieza profunda de alfombras",
      estado: "Inactiva",
      fechaCreacion: "15/02/2023",
    },
    {
      id: 9,
      nombre: "Desengrasante industrial",
      descripcion: "Desengrasante potente para uso industrial",
      estado: "Inactiva",
      fechaCreacion: "20/02/2023",
    },
    {
      id: 10,
      nombre: "Limpiador de baños",
      descripcion: "Producto especializado para limpieza de sanitarios",
      estado: "Inactiva",
      fechaCreacion: "25/02/2023",
    },
  ]

  static getAll(): Promise<Material[]> {
    return Promise.resolve([...this.materiales])
  }

  static getById(id: number): Promise<Material | undefined> {
    const material = this.materiales.find((m) => m.id === id)
    return Promise.resolve(material)
  }

  static create(material: Omit<Material, "id">): Promise<Material> {
    const newId = Math.max(...this.materiales.map((m) => m.id)) + 1
    const newMaterial = { ...material, id: newId }
    this.materiales.push(newMaterial)
    return Promise.resolve(newMaterial)
  }

  static update(id: number, material: Partial<Material>): Promise<Material | undefined> {
    const index = this.materiales.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const updatedMaterial = { ...this.materiales[index], ...material }
    this.materiales[index] = updatedMaterial
    return Promise.resolve(updatedMaterial)
  }

  static toggleEstado(id: number): Promise<Material | undefined> {
    const index = this.materiales.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(undefined)
    }

    const material = this.materiales[index]
    const nuevoEstado = material.estado === "Activa" ? "Inactiva" : "Activa"

    const updatedMaterial = { ...material, estado: nuevoEstado }
    this.materiales[index] = updatedMaterial
    return Promise.resolve(updatedMaterial)
  }

  static delete(id: number): Promise<boolean> {
    const index = this.materiales.findIndex((m) => m.id === id)
    if (index === -1) {
      return Promise.resolve(false)
    }

    this.materiales.splice(index, 1)
    return Promise.resolve(true)
  }
}
