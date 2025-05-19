"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { MetodoService } from "@/services/metodo-service"

export default function EditarMetodoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = Number(params.id)
  const empresaId = searchParams.get("empresaId")
  const metodoDataParam = searchParams.get("data")

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })
  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Intentar cargar los datos desde los parámetros de URL
    if (metodoDataParam) {
      try {
        const metodoData = JSON.parse(decodeURIComponent(metodoDataParam))
        setFormData({
          nombre: metodoData.nombre || "",
          descripcion: metodoData.descripcion || "",
        })
        setIsLoading(false)
        return
      } catch (error) {
        console.error("Error al parsear los datos del método:", error)
        // Si hay un error al parsear, continuamos con la carga desde la API
      }
    }

    // Si no hay datos en la URL o hubo un error al parsearlos, intentamos cargar desde la API
    const fetchMetodo = async () => {
      try {
        setIsLoading(true)
        const metodo = await MetodoService.getById(id)

        if (metodo) {
          setFormData({
            nombre: metodo.nombre,
            descripcion: metodo.descripcion,
          })
        } else {
          router.push(`/metodos${empresaId ? `?empresaId=${empresaId}` : ""}`)
        }
      } catch (error) {
        console.error("Error al cargar el método:", error)
        // En caso de error, redirigimos a la lista de métodos
        router.push(`/metodos${empresaId ? `?empresaId=${empresaId}` : ""}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (id && !metodoDataParam) {
      fetchMetodo()
    }
  }, [id, metodoDataParam, empresaId, router])

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

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      await MetodoService.update(id, {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      })

      // Redirigir a la lista de métodos
      router.push(`/metodos${empresaId ? `?empresaId=${empresaId}` : ""}`)
    } catch (error: any) {
      console.error("Error al actualizar el método:", error)

      // Verificar si el error es de nombre duplicado
      if (error?.message?.includes("The nombre has already been taken")) {
        setErrors({
          ...errors,
          nombre: "El nombre del método ya existe. Por favor, utilice otro nombre.",
        })
      } else {
        // Para otros errores, mostrar un mensaje genérico
        setErrors({
          ...errors,
          descripcion: "Ocurrió un error al actualizar el método. Por favor, intente nuevamente.",
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
        <Link
          href={`/metodos${empresaId ? `?empresaId=${empresaId}` : ""}`}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar registro</h1>
        <p className="text-gray-600 mb-8">Edita el método seleccionado.</p>

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
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción Del Método"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
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
