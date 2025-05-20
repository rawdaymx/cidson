"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { MotivoService } from "@/services/motivo-service"
import type { Motivo } from "@/types/motivo"

export default function EditarMotivoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = Number(params.id)
  const configuracionId = searchParams.get("configuracionId")

  const [formData, setFormData] = useState({
    nombre: "",
  })
  const [errors, setErrors] = useState({
    nombre: "",
    general: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [motivo, setMotivo] = useState<Motivo | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Función para obtener el motivo del localStorage
    const getMotivo = () => {
      try {
        // Intentar obtener el motivo del localStorage
        const motivoData = localStorage.getItem("motivo_editar")

        if (motivoData) {
          const parsedMotivo = JSON.parse(motivoData) as Motivo

          // Verificar que el ID coincida con el de la URL
          if (parsedMotivo.id === id) {
            setMotivo(parsedMotivo)
            setFormData({
              nombre: parsedMotivo.nombre,
            })

            // Limpiar el localStorage después de usarlo
            localStorage.removeItem("motivo_editar")

            setIsLoading(false)
            return true
          }
        }
        return false
      } catch (error) {
        console.error("Error al obtener el motivo del localStorage:", error)
        return false
      }
    }

    // Función para cargar el motivo desde la API como respaldo
    const fetchMotivoFromAPI = async () => {
      try {
        setIsLoading(true)
        const motivo = await MotivoService.getById(id)

        if (motivo) {
          setMotivo(motivo)
          setFormData({
            nombre: motivo.nombre,
          })
        } else {
          setLoadError("No se pudo encontrar el motivo solicitado")
          setTimeout(() => {
            router.push("/motivos")
          }, 3000)
        }
      } catch (error) {
        console.error("Error al cargar el motivo:", error)
        setLoadError("Error al cargar la información del motivo")
        setTimeout(() => {
          router.push("/motivos")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    // Primero intentar obtener del localStorage, si falla, usar la API
    const motivoFound = getMotivo()
    if (!motivoFound) {
      fetchMotivoFromAPI()
    }
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error al cambiar el valor
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = {
      nombre: "",
      general: "",
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del motivo es requerido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({
        nombre: "",
        general: "",
      })

      if (motivo) {
        // Actualizar solo el nombre según la API
        await MotivoService.update(id, {
          nombre: formData.nombre.trim(),
        })
      }

      // Redirigir a la lista de motivos con el parámetro de configuración si existe
      if (configuracionId) {
        router.push(`/motivos?configuracionId=${configuracionId}`)
      } else {
        router.push("/motivos")
      }
    } catch (error) {
      console.error("Error al actualizar el motivo:", error)
      setErrors({
        ...errors,
        general: "Ocurrió un error al actualizar el motivo. Por favor, intente nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <p className="text-gray-500 mb-4">Redirigiendo a la lista de motivos...</p>
          <Link
            href={configuracionId ? `/motivos?configuracionId=${configuracionId}` : "/motivos"}
            className="inline-flex items-center text-[#303e65]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link
          href={configuracionId ? `/motivos?configuracionId=${configuracionId}` : "/motivos"}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar registro</h1>
        <p className="text-gray-600 mb-8">Edita el motivo de justificación seleccionado.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre Del Motivo"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.nombre ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
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
