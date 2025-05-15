"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getChecklistById } from "@/services/checklist-service"
import type { ChecklistItem } from "@/types/checklist"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

export default function DetalleChecklistPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [checklist, setChecklist] = useState<ChecklistItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadChecklist = async () => {
      try {
        const data = await getChecklistById(id)
        if (data) {
          setChecklist(data)
        } else {
          setError("Checklist no encontrado")
        }
      } catch (error) {
        console.error("Error al cargar el checklist:", error)
        setError("Error al cargar los datos del checklist")
      } finally {
        setLoading(false)
      }
    }

    loadChecklist()
  }, [id])

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
              onClick={() => router.push("/checklist")}
            >
              <ArrowLeft size={16} />
              Volver a la lista
            </Button>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Cargando datos del checklist...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
            ) : checklist ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#303e65] text-white p-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{checklist.nombre}</h1>
                    <Link href={`/checklist/editar/${checklist.id}`}>
                      <Button className="bg-yellow-400 text-[#303e65] hover:bg-yellow-500">
                        <Edit size={16} className="mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Información general</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Actividad</p>
                          <p className="font-medium">{checklist.actividad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Estado</p>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-300 mt-1">
                            {checklist.estado.charAt(0).toUpperCase() + checklist.estado.slice(1)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fecha de creación</p>
                          <p className="font-medium">
                            {new Date(checklist.createdAt).toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Última actualización</p>
                          <p className="font-medium">
                            {new Date(checklist.updatedAt).toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Asociaciones</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Áreas asociadas</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {checklist.areasAsociadas.map((area) => (
                              <Badge key={area} variant="outline" className="bg-blue-50">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Materiales asociados</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {checklist.materialesAsociados.map((material) => (
                              <Badge key={material} variant="outline" className="bg-purple-50">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Elementos del checklist</h3>
                    <div className="bg-gray-50 p-4 rounded-md text-center">
                      <p className="text-gray-500">Este checklist no tiene elementos configurados.</p>
                      <Button
                        className="mt-2 bg-[#303e65] hover:bg-[#253252]"
                        onClick={() => router.push(`/checklist/editar/${checklist.id}`)}
                      >
                        Configurar elementos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
