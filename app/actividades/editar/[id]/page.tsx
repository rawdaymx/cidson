"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { ActividadService } from "@/services/actividad-service"

export default function EditarActividadPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [formData, setFormData] = useState({
    nombre: "",
    estado: "Activa" as "Activa" | "Inactiva",
  })
  const [errors, setErrors] = useState({
    nombre: "",
    estado: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        setIsLoading(true)
        const actividad = await ActividadService.getById(id)

        if (actividad) {
          setFormData({
            nombre: actividad.nombre,
            estado: actividad.estado,
          })
        } else {
          router.push("/actividades")
        }
      } catch (error) {
        console.error("Error al cargar la actividad:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchActividad()
    }
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      estado: "",
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la actividad es requerido"
      isValid = false
    }

    if (!formData.estado) {
      newErrors.estado = "El estado es requerido"
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

      const actividad = await ActividadService.getById(id)

      if (actividad) {
        await ActividadService.update(id, {
          ...actividad,
          nombre: formData.nombre.trim(),
          estado: formData.estado,
        })
      }

      // Redirigir a la lista de actividades
      router.push("/actividades")
    } catch (error) {
      console.error("Error al actualizar la actividad:", error)
      setErrors({
        ...errors,
        nombre: "Ocurrió un error al actualizar la actividad. Por favor, intente nuevamente.",
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

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link href="/actividades" className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar registro</h1>
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
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.nombre ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div className="relative">
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 appearance-none focus:ring-2 focus:ring-[#303e65] ${
                    errors.estado ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <option value="Estado" disabled>
                    Estado
                  </option>
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {errors.estado && <p className="mt-1 text-sm text-red-500">{errors.estado}</p>}
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
