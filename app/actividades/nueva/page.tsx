"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { ActividadService } from "@/services/actividad-service"

export default function NuevaActividadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaId = searchParams.get("empresaId")
  const configuracionIdParam = searchParams.get("configuracionId")
  const returnToParam = searchParams.get("returnTo")

  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [configuracionId, setConfiguracionId] = useState<number | null>(
    configuracionIdParam ? Number(configuracionIdParam) : null,
  )

  useEffect(() => {
    if (!configuracionIdParam && !empresaId) {
      setError("No se proporcionó ID de empresa o configuración")
    }
  }, [configuracionIdParam, empresaId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("El nombre de la actividad es requerido")
      return
    }

    if (!configuracionId) {
      setError("No se proporcionó ID de configuración")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Usar el nuevo método del servicio para crear la actividad
      const actividad = await ActividadService.create(configuracionId, nombre.trim())

      if (actividad) {
        console.log("Actividad creada exitosamente:", actividad)

        // Redirigir a la página de actividades
        const params = new URLSearchParams()
        if (empresaId) params.append("empresaId", empresaId)
        if (configuracionId) params.append("configuracionId", configuracionId.toString())
        if (returnToParam) params.append("returnTo", returnToParam)

        router.push(`/actividades?${params.toString()}`)
      } else {
        setError("Error al crear la actividad")
      }
    } catch (error) {
      console.error("Error al crear actividad:", error)
      setError("Ocurrió un error al crear la actividad. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Modificar la función handleVolver para que redirija a /actividades
  const handleVolver = () => {
    // Construir la URL para volver a la lista de actividades con los parámetros relevantes
    const params = new URLSearchParams()
    if (empresaId) params.append("empresaId", empresaId)
    if (configuracionId) params.append("configuracionId", configuracionId?.toString() || "")
    if (returnToParam) params.append("returnTo", returnToParam)

    router.push(`/actividades?${params.toString()}`)
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <button onClick={handleVolver} className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nuevo registro</h1>
        <p className="text-gray-600 mb-8">Crea y registra nuevas actividades.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre De La Actividad"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value)
                    if (e.target.value.trim()) setError("")
                  }}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    error ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center bg-[#f5d433] text-[#303e65] font-medium px-6 py-2.5 rounded-full hover:bg-[#f0ca20] transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#303e65] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
