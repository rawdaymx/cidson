"use client"

import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Printer } from "lucide-react"

export default function DetalleCapturaChecklistPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Datos simulados para la demostración
  const captura = {
    id,
    nombre: `Checklist de limpieza ${id}`,
    fecha: "10/05/2023",
    estado: "Completado",
    porcentajeCompletado: 100,
    usuario: "Elena Cruz",
    elementos: [
      {
        id: "elem-1",
        descripcion: "Verificar que el piso esté limpio y sin residuos",
        obligatorio: true,
        completado: true,
        observaciones: "Todo en orden",
      },
      {
        id: "elem-2",
        descripcion: "Comprobar que las superficies estén desinfectadas",
        obligatorio: true,
        completado: true,
        observaciones: "Se utilizó desinfectante especial",
      },
      {
        id: "elem-3",
        descripcion: "Revisar que los materiales estén organizados",
        obligatorio: false,
        completado: true,
        observaciones: "",
      },
      {
        id: "elem-4",
        descripcion: "Verificar que no haya malos olores",
        obligatorio: true,
        completado: true,
        observaciones: "Sin problemas de olores",
      },
    ],
  }

  const handlePrint = () => {
    window.print()
  }

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
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold">{captura.nombre}</h1>
                  <Button onClick={handlePrint} className="bg-white text-[#303e65] hover:bg-gray-100 gap-2">
                    <Printer size={16} />
                    Imprimir
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información general</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="font-medium">{captura.fecha}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-300 mt-1">
                          {captura.estado}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Completado</p>
                        <p className="font-medium">{captura.porcentajeCompletado}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Responsable</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Usuario</p>
                        <p className="font-medium">{captura.usuario}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Elementos del checklist</h3>
                  <div className="space-y-4">
                    {captura.elementos.map((elemento) => (
                      <div key={elemento.id} className="border rounded-md p-4 bg-green-50 border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mt-0.5">
                            <Check size={14} />
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{elemento.descripcion}</p>
                                {elemento.obligatorio && <span className="text-xs text-red-500">* Obligatorio</span>}
                              </div>
                            </div>

                            {elemento.observaciones && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Observaciones:</p>
                                <p className="text-sm">{elemento.observaciones}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
