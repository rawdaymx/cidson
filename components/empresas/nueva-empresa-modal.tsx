"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Empresa } from "@/types/empresa"
import { EmpresaService, type EmpresaCreateData } from "@/services/empresa-service"

interface NuevaEmpresaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (empresa: Empresa) => void
  empresa?: Empresa | null
}

export default function NuevaEmpresaModal({ isOpen, onClose, onSave, empresa }: NuevaEmpresaModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    razonSocial: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos de la empresa si estamos en modo edición
  useEffect(() => {
    if (empresa) {
      setFormData({
        nombre: empresa.nombre,
        razonSocial: empresa.razonSocial,
      })
    } else {
      setFormData({
        nombre: "",
        razonSocial: "",
      })
    }
  }, [empresa])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Si estamos editando, mantener la fecha de registro y el estado original
      if (empresa) {
        // Aquí iría la lógica para actualizar la empresa a través de la API
        // Por ahora, usamos el comportamiento anterior
        onSave({
          id: empresa.id,
          nombre: formData.nombre,
          razonSocial: formData.razonSocial,
          fechaRegistro: empresa.fechaRegistro,
          estado: empresa.estado,
        })
      } else {
        // Crear nueva empresa a través de la API
        const empresaData: EmpresaCreateData = {
          nombre: formData.nombre,
          razon_social: formData.razonSocial,
        }

        const nuevaEmpresa = await EmpresaService.create(empresaData)
        onSave(nuevaEmpresa)
      }

      // Limpiar formulario
      setFormData({
        nombre: "",
        razonSocial: "",
      })

      // Cerrar modal
      onClose()
    } catch (err) {
      console.error("Error al guardar empresa:", err)
      setError(err instanceof Error ? err.message : "Error al guardar la empresa. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{empresa ? "Editar Empresa" : "Nueva Empresa"}</h2>
          <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese el nombre de la empresa"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700">
                Razón Social
              </label>
              <input
                type="text"
                id="razonSocial"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese la razón social"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cidson-blue text-white rounded-md disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : empresa ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
