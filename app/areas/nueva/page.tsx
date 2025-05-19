"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { AreaService } from "@/services/area-service"

export default function NuevaAreaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaId = searchParams.get("empresaId")

  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("El nombre del área es requerido")
      return
    }

    try {
      setIsSubmitting(true)

      if (empresaId) {
        try {
          // Usar el método create existente con el formato correcto
          await AreaService.create({
            nombre: nombre.trim(),
            configuracion_id: Number(empresaId),
          })

          // Redirigir a la lista de áreas si es exitoso
          router.push(`/areas?empresaId=${empresaId}`)
        } catch (apiError: any) {
          console.error("Error específico de API:", apiError)

          // Verificar si es un error de nombre duplicado
          if (
            apiError &&
            ((typeof apiError === "string" &&
              (apiError.includes("already been taken") || apiError.includes("ya existe"))) ||
              (typeof apiError === "object" &&
                apiError.message &&
                (apiError.message.includes("already been taken") || apiError.message.includes("ya existe"))))
          ) {
            setError("El nombre del área ya existe. Por favor, utilice otro nombre.")
          } else {
            // Mensaje de error genérico para otros casos
            setError("No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.")
          }
        }
      } else {
        // Usar el método local
        const today = new Date()
        const day = String(today.getDate()).padStart(2, "0")
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const year = today.getFullYear()
        const fechaCreacion = `${day}/${month}/${year}`

        await AreaService.create({
          nombre: nombre.trim(),
          estado: "Activa",
          fechaCreacion,
        })

        // Redirigir a la lista de áreas
        router.push("/areas")
      }
    } catch (error) {
      console.error("Error general al crear área:", error)
      setError("El nombre del área ya existe. Por favor, utilice otro nombre.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para manejar el modo de desarrollo/prueba cuando la API no está disponible
  const handleFallbackSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Crear área localmente (simulación)
      const today = new Date()
      const day = String(today.getDate()).padStart(2, "0")
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()
      const fechaCreacion = `${day}/${month}/${year}`

      await AreaService.create({
        nombre: nombre.trim(),
        configuracion_id: empresaId ? Number(empresaId) : 0,
      })

      // Redirigir a la lista de áreas
      if (empresaId) {
        router.push(`/areas?empresaId=${empresaId}`)
      } else {
        router.push("/areas")
      }
    } catch (error) {
      console.error("Error en modo fallback:", error)
      setError("El nombre del área ya existe. Por favor, utilice otro nombre.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link
          href={empresaId ? `/areas?empresaId=${empresaId}` : "/areas"}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nuevo registro</h1>
        <p className="text-gray-600 mb-8">Crea y registra nuevas áreas.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre del Área"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value)
                    if (e.target.value.trim()) setError("")
                  }}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    error ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {error && (
                  <div className="mt-2 flex items-start text-sm text-red-500">
                    <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
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

            {/* Botón alternativo para modo de desarrollo/prueba */}
            {error && error.includes("No se pudo conectar") && (
              <div className="mt-4 text-center">
                <button type="button" onClick={handleFallbackSubmit} className="text-sm text-blue-600 hover:underline">
                  Continuar en modo local (solo para desarrollo)
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
