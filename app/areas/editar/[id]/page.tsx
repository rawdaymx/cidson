"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AreaService } from "@/services/area-service"

export default function EditarAreaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [formData, setFormData] = useState({
    nombre: "",
  })
  const [errors, setErrors] = useState({
    nombre: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchArea = async () => {
      try {
        setIsLoading(true)
        const area = await AreaService.getById(id)

        if (area) {
          setFormData({
            nombre: area.nombre,
          })
        } else {
          // Si no se encuentra el área, mostrar un mensaje y redirigir
          console.error("Área no encontrada")
          router.push("/areas")
        }
      } catch (error) {
        console.error("Error al cargar el área:", error)
        // Mostrar un mensaje de error al usuario
        setErrors({
          ...errors,
          nombre: "Error al cargar la información del área. Por favor, intente nuevamente.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchArea()
    }
  }, [id, router, errors])

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
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del área es requerido"
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

      // Actualizar el área enviando solo el nombre
      await AreaService.update(id, {
        nombre: formData.nombre.trim(),
      })

      // Redirigir a la lista de áreas
      const searchParams = new URLSearchParams(window.location.search)
      const empresaId = searchParams.get("empresaId")
      router.push(empresaId ? `/areas?empresaId=${empresaId}` : "/areas")
    } catch (error: any) {
      console.error("Error al actualizar el área:", error)

      // Verificar si el error es por nombre duplicado
      if (
        error.message &&
        (error.message.includes("nombre has already been taken") ||
          error.message.includes("ya existe") ||
          error.message.includes("ya ha sido tomado"))
      ) {
        setErrors({
          ...errors,
          nombre: "El nombre del área ya existe. Por favor, utilice otro nombre.",
        })
      } else {
        setErrors({
          ...errors,
          nombre: error.message || "Ocurrió un error al actualizar el área. Por favor, intente nuevamente.",
        })
      }
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
        <Link href="/areas" className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar registro</h1>
        <p className="text-gray-600 mb-8">Edita el área seleccionada.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre Del Área"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                  errors.nombre ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.nombre && (
                <div className="mt-2 flex items-start text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <p>{errors.nombre}</p>
                </div>
              )}
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
