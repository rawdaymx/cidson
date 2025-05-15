"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
// Importar el servicio
import { EmpresaService, type EmpresaCreateData } from "@/services/empresa-service"

export default function NuevaEmpresaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener la fecha actual en formato yyyy-MM-dd para el input de tipo date
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    nombre: "",
    razonSocial: "",
    fechaRegistro: today,
  })

  const [errors, setErrors] = useState({
    nombre: "",
    razonSocial: "",
  })

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = {
      nombre: "",
      razonSocial: "",
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la empresa es requerido"
      isValid = false
    }

    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = "La razón social es requerida"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Crear nueva empresa a través de la API
      const empresaData: EmpresaCreateData = {
        nombre: formData.nombre,
        razon_social: formData.razonSocial,
      }

      await EmpresaService.create(empresaData)

      // Redirigir a la lista de empresas
      router.push("/empresas")
    } catch (err) {
      console.error("Error al guardar la empresa:", err)
      setError(err instanceof Error ? err.message : "Error al guardar la empresa. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link href="/empresas" className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nuevo registro</h1>
        <p className="text-gray-600 mb-8">Crea y registra una nueva empresa.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre De La Empresa"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.nombre ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
              </div>

              {/* Cambiar el select por un input de texto para la razón social */}
              <div>
                <input
                  type="text"
                  id="razonSocial"
                  name="razonSocial"
                  placeholder="Razón Social"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.razonSocial ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.razonSocial && <p className="mt-1 text-sm text-red-500">{errors.razonSocial}</p>}
              </div>

              {/* Mostrar la fecha actual como texto, no como input editable */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Fecha De Registro</div>
                <div className="w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 flex items-center text-gray-700">
                  {new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="flex items-center justify-center bg-[#f5d433] text-[#303e65] font-medium px-6 py-2.5 rounded-full hover:bg-[#f0ca20] transition-colors disabled:opacity-70"
                disabled={isSubmitting}
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
