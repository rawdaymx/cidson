"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createChecklist } from "@/services/checklist-service"
import type { ChecklistFormData } from "@/types/checklist"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function NuevoChecklistModal() {
  const router = useRouter()
  const [formData, setFormData] = useState<ChecklistFormData>({
    nombre: "",
    actividad: "Piso",
    areasAsociadas: "05",
    materialesAsociados: "10",
    estado: "activo",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createChecklist(formData)
      router.push("/checklist")
    } catch (error) {
      console.error("Error al crear el checklist:", error)
      setError("Ocurrió un error al crear el checklist. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Nuevo Checklist</h2>
        <Button variant="ghost" size="icon" onClick={() => router.push("/checklist")}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del checklist</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="actividad">Actividad</Label>
            <select
              id="actividad"
              name="actividad"
              value={formData.actividad}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Piso">Piso</option>
              <option value="Pared">Pared</option>
              <option value="Techo">Techo</option>
              <option value="Muebles">Muebles</option>
            </select>
          </div>

          <div>
            <Label htmlFor="areasAsociadas">Áreas asociadas</Label>
            <select
              id="areasAsociadas"
              name="areasAsociadas"
              value={formData.areasAsociadas}
              onChange={(e) => setFormData({ ...formData, areasAsociadas: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="05">05</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>

          <div>
            <Label htmlFor="materialesAsociados">Materiales asociados</Label>
            <select
              id="materialesAsociados"
              name="materialesAsociados"
              value={formData.materialesAsociados}
              onChange={(e) => setFormData({ ...formData, materialesAsociados: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => router.push("/checklist")}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-[#303e65] hover:bg-[#253252]" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
