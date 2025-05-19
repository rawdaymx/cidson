"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Metodo } from "@/types/metodo"

interface NuevoMetodoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (metodo: Metodo) => void
  metodo?: Metodo | null
  empresaId: number
}

export default function NuevoMetodoModal({ isOpen, onClose, onSave, metodo, empresaId }: NuevoMetodoModalProps) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [error, setError] = useState<{ nombre?: string; descripcion?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos del método si estamos en modo edición
  useEffect(() => {
    if (metodo) {
      setNombre(metodo.nombre)
      setDescripcion(metodo.descripcion)
    } else {
      setNombre("")
      setDescripcion("")
    }
    setError(null)
  }, [metodo, isOpen])

  const validateForm = (): boolean => {
    const newErrors: { nombre?: string; descripcion?: string } = {}
    let isValid = true

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre del método es requerido"
      isValid = false
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = "La descripción del método es requerida"
      isValid = false
    }

    setError(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Los datos que se enviarán al servicio
    const metodoData = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    }

    // Simulamos la respuesta del servidor para mantener la interfaz consistente
    // En una implementación real, esto vendría de la API
    const mockResponse: Metodo = {
      id: metodo?.id || Math.floor(Math.random() * 1000),
      configuracion_id: empresaId,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado: metodo?.estado || true,
      fecha_creacion: metodo?.fecha_creacion || new Date().toISOString().split("T")[0],
    }

    // Llamamos a onSave con los datos simulados
    // En una implementación real, esto se reemplazaría con la respuesta de la API
    onSave(mockResponse)

    // Limpiar formulario
    setNombre("")
    setDescripcion("")
    setError(null)
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{metodo ? "Editar Método" : "Nuevo Método"}</h2>
          <button
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre del Método
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (error?.nombre && e.target.value.trim()) {
                    setError({ ...error, nombre: undefined })
                  }
                }}
                className={`w-full p-2 border ${
                  error?.nombre ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#303e65]`}
                placeholder="Ingrese el nombre del método"
                disabled={isSubmitting}
              />
              {error?.nombre && <p className="text-red-500 text-xs mt-1">{error.nombre}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción del Método
              </label>
              <input
                type="text"
                id="descripcion"
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value)
                  if (error?.descripcion && e.target.value.trim()) {
                    setError({ ...error, descripcion: undefined })
                  }
                }}
                className={`w-full p-2 border ${
                  error?.descripcion ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#303e65]`}
                placeholder="Ingrese la descripción del método"
                disabled={isSubmitting}
              />
              {error?.descripcion && <p className="text-red-500 text-xs mt-1">{error.descripcion}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cidson-blue text-white rounded-md hover:bg-cidson-blue-light disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : metodo ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
