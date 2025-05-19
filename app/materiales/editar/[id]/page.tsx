"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { MaterialService } from "@/services/material-service"

export default function EditarMaterialPage() {
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
    const fetchMaterial = async () => {
      try {
        setIsLoading(true)

        // Obtener los materiales desde localStorage
        const materialesString = localStorage.getItem("materiales")

        if (materialesString) {
          const materiales = JSON.parse(materialesString)
          const material = materiales.find((m: any) => m.id === id)

          if (material) {
            setFormData({
              nombre: material.nombre || "",
            })
          } else {
            // Si no se encuentra el material en localStorage, redirigir a la lista
            router.push("/materiales")
          }
        } else {
          // Si no hay materiales en localStorage, redirigir a la lista
          router.push("/materiales")
        }
      } catch (error) {
        console.error("Error al cargar el material:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMaterial()
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
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del material es requerido"
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

      // Enviar solo el nombre según la API
      await MaterialService.update(id, {
        nombre: formData.nombre.trim(),
      })

      // Redirigir a la lista de materiales
      router.push("/materiales")
    } catch (error) {
      console.error("Error al actualizar el material:", error)
      setErrors({
        ...errors,
        nombre: "El nombre del material ya existe. Por favor, utilice otro nombre.",
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
        <Link href="/materiales" className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar registro</h1>
        <p className="text-gray-600 mb-8">Edita el nombre del material seleccionado.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre Del Material"
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
