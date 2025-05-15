"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check } from "lucide-react"

interface ChecklistElemento {
  id: string
  descripcion: string
  obligatorio: boolean
  completado: boolean
  observaciones: string
}

export default function NuevaCapturaChecklistPage() {
  const router = useRouter()

  const [selectedChecklist, setSelectedChecklist] = useState("")
  const [elementos, setElementos] = useState<ChecklistElemento[]>([
    {
      id: "elem-1",
      descripcion: "Verificar que el piso esté limpio y sin residuos",
      obligatorio: true,
      completado: false,
      observaciones: "",
    },
    {
      id: "elem-2",
      descripcion: "Comprobar que las superficies estén desinfectadas",
      obligatorio: true,
      completado: false,
      observaciones: "",
    },
    {
      id: "elem-3",
      descripcion: "Revisar que los materiales estén organizados",
      obligatorio: false,
      completado: false,
      observaciones: "",
    },
    {
      id: "elem-4",
      descripcion: "Verificar que no haya malos olores",
      obligatorio: true,
      completado: false,
      observaciones: "",
    },
  ])

  const [loading, setLoading] = useState(false)

  const handleChecklistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChecklist(e.target.value)
  }

  const toggleElemento = (id: string) => {
    setElementos(elementos.map((elem) => (elem.id === id ? { ...elem, completado: !elem.completado } : elem)))
  }

  const updateObservaciones = (id: string, observaciones: string) => {
    setElementos(elementos.map((elem) => (elem.id === id ? { ...elem, observaciones } : elem)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push("/captura-checklist")
  }

  const completedCount = elementos.filter((elem) => elem.completado).length
  const totalCount = elementos.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              className="mb-4 flex items-center gap-2 text-[#303e65]"
              onClick={() => router.push("/captura-checklist")}
            >
              <ArrowLeft size={16} />
              Volver
            </Button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#303e65] text-white p-6">
                <h1 className="text-xl font-bold">Nueva captura de checklist</h1>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="checklist">Seleccionar checklist</Label>
                    <select
                      id="checklist"
                      value={selectedChecklist}
                      onChange={handleChecklistChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="checklist-1">Checklist de limpieza 1</option>
                      <option value="checklist-2">Checklist de limpieza 2</option>
                      <option value="checklist-3">Checklist de limpieza 3</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Elementos del checklist</Label>
                      <div className="text-sm">
                        Completado: <span className="font-medium">{completionPercentage}%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {elementos.map((elemento) => (
                        <div
                          key={elemento.id}
                          className={`border rounded-md p-4 ${
                            elemento.completado ? "bg-green-50 border-green-200" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleElemento(elemento.id)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                                elemento.completado ? "bg-green-500 text-white" : "bg-white border border-gray-300"
                              }`}
                            >
                              {elemento.completado && <Check size={14} />}
                            </button>

                            <div className="flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p
                                    className={`font-medium ${elemento.completado ? "line-through text-gray-500" : ""}`}
                                  >
                                    {elemento.descripcion}
                                  </p>
                                  {elemento.obligatorio && <span className="text-xs text-red-500">* Obligatorio</span>}
                                </div>
                              </div>

                              <div className="mt-3">
                                <Label htmlFor={`obs-${elemento.id}`} className="text-sm">
                                  Observaciones
                                </Label>
                                <Input
                                  id={`obs-${elemento.id}`}
                                  value={elemento.observaciones}
                                  onChange={(e) => updateObservaciones(elemento.id, e.target.value)}
                                  placeholder="Agregar observaciones (opcional)"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => router.push("/captura-checklist")}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#303e65] hover:bg-[#253252]"
                    disabled={loading || completedCount === 0}
                  >
                    {loading ? "Guardando..." : "Guardar captura"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
