"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { EmpresaService } from "@/services/empresa-service"

export default function EditarEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [formData, setFormData] = useState({
    nombre: "",
    razonSocial: "",
    fechaRegistro: "",
  })

  const [errors, setErrors] = useState({
    nombre: "",
    razonSocial: "",
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const empresa = await EmpresaService.getById(id)

        if (empresa) {
          setFormData({
            nombre: empresa.nombre,
            razonSocial: empresa.razonSocial,
            fechaRegistro: new Date().toLocaleDateString(), // Usar la fecha actual
          })
        } else {
          setError("No se encontró la empresa solicitada")
          setTimeout(() => {
            router.push("/empresas")
          }, 3000)
        }
      } catch (error) {
        console.error("Error al cargar la empresa:", error)
        setError("Error al cargar la información de la empresa")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchEmpresa()
    }
  }, [id, router])

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

    try {
      setIsSubmitting(true)
      setError(null)

      // Preparar los datos para la API
      const empresaData = {
        nombre: formData.nombre,
        razon_social: formData.razonSocial,
      }

      // Actualizar la empresa usando el servicio
      try {
        const empresaActualizada = await EmpresaService.update(id, empresaData)

        if (!empresaActualizada) {
          throw new Error("No se pudo actualizar la empresa")
        }

        // Redirigir a la lista de empresas
        router.push("/empresas")
      } catch (error: any) {
        // Verificar si es un error de validación
        if (error.validationErrors) {
          // Mapear los errores de validación al estado de errores
          const newErrors = { ...errors }

          if (error.validationErrors.nombre) {
            newErrors.nombre = error.validationErrors.nombre[0].replace(
              "The nombre has already been taken.",
              "Este nombre de empresa ya está en uso.",
            )
          }

          if (error.validationErrors.razon_social) {
            newErrors.razonSocial = error.validationErrors.razon_social[0].replace(
              "The razon social has already been taken.",
              "Esta razón social ya está en uso.",
            )
          }

          setErrors(newErrors)
        } else {
          // Si no es un error de validación, establecer el error general
          setError(error.message || "Error al actualizar la empresa")
        }
      }
    } catch (error: any) {
      console.error("Error al actualizar la empresa:", error)
      setError(error.message || "Error al actualizar la empresa")
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/empresas"
              className="inline-flex items-center justify-center bg-[#303e65] text-white font-medium px-6 py-2.5 rounded-full hover:bg-[#273655] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver a Empresas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link href="/empresas" className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar</h1>
        <p className="text-gray-600 mb-8">Edita la empresa correspondiente</p>

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
                  disabled={isSubmitting}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.nombre ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div>
                <input
                  type="text"
                  id="razonSocial"
                  name="razonSocial"
                  placeholder="Razón Social"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.razonSocial ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.razonSocial && <p className="mt-1 text-sm text-red-500">{errors.razonSocial}</p>}
              </div>

              <div>
                <input
                  type="text"
                  id="fechaRegistro"
                  name="fechaRegistro"
                  placeholder="Fecha De Registro"
                  value={formData.fechaRegistro}
                  readOnly
                  className="w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">La fecha de registro no es editable</p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center bg-[#f5d433] text-[#303e65] font-medium px-6 py-2.5 rounded-full hover:bg-[#f0ca20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#303e65] border-t-transparent rounded-full animate-spin mr-2"></div>
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
