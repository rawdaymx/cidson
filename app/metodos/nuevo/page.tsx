"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { MetodoService } from "@/services/metodo-service"

export default function NuevoMetodoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaId = searchParams.get("empresaId")

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })
  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      descripcion: "",
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del método es requerido"
      isValid = false
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción del método es requerida"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !empresaId) {
      return
    }

    try {
      setIsSubmitting(true)

      await MetodoService.create(Number(empresaId), {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      })

      // Redirigir a la lista de métodos
      router.push(`/metodos?empresaId=${empresaId}`)
    } catch (error) {
      console.error("Error al crear el método:", error)
      setErrors({
        ...errors,
        nombre: "Ocurrió un error al crear el método. Por favor, intente nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link
          href={`/metodos${empresaId ? `?empresaId=${empresaId}` : ""}`}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nuevo registro</h1>
        <p className="text-gray-600 mb-8">Crea y registra un nuevo método.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre Del Método"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.nombre ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción Del Método"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.descripcion ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
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
