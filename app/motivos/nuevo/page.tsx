"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MotivoService } from "@/services/motivo-service"

export default function NuevoMotivoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const configuracionId = searchParams.get("configuracionId")

  const [nombre, setNombre] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("El nombre del motivo es obligatorio")
      return
    }

    if (!configuracionId) {
      setError("No se ha especificado la configuración")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Enviando datos para crear motivo:", {
        nombre,
        configuracion_id: Number(configuracionId),
      })

      await MotivoService.create({
        nombre,
        estado: "Activa",
        configuracion_id: Number(configuracionId),
      })

      // Redirigir a la lista de motivos
      router.push(`/motivos?configuracionId=${configuracionId}`)
    } catch (error: any) {
      console.error("Error al crear motivo:", error)
      setError(error.message || "Error al crear el motivo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <div className="p-6">
        <Link
          href={`/motivos${configuracionId ? `?configuracionId=${configuracionId}` : ""}`}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Regresar
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">Nuevo registro</h1>
        <p className="text-gray-600 mb-8">Crea y registra nuevos motivos.</p>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 bg-[#f4f6fb] border-0 rounded-md focus:ring-2 focus:ring-[#303e65]"
                placeholder="Nombre del Motivo"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center bg-[#f5d433] text-[#303e65] font-medium px-4 py-2 rounded-full hover:bg-[#f7dc5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5d433] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#303e65] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
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
